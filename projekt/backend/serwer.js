/*jshint node: true, esversion: 6, devel: true */

// Aplikacja Express.js
const express = require('express');
const app = express();

// mechanizm sesji (wykorzystamy bazę Redis)
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const sessionStore = new RedisStore({
    host: '192.168.1.12',
    port: 6379,
    client: require('redis').createClient(),
    disableTTL: true
});

// baza danych lowdb
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('../database/database.json');
const db = low(adapter);
const shortid = require('shortid');

// Passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Socket.io (wraz z modułem autoryzacji poprzez Passport)
const socketIo = require('socket.io');
const passportSocketIo = require('passport.socketio');

// Konfiguracja passport.js
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        if ((username === 'admin') && (password === 'tajne')) {
            console.log('Udane logowanie...');
            return done(null, {
                username: username,
                password: password
            });
        } else {
            return done(null, false);
        }
    }
));

// konfiguracji aplikacji Express.js
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
const cors = require('cors');
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        return callback(null, true);
    },
}));

// konfiguracja obsługi sesji (poziom Express,js)
const sessionSecret = 'Wielki$ekret44';
const sessionKey = 'express.sid';
app.use(session({
    key: sessionKey,
    secret: sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
}));

// middleware Passport.js
app.use(passport.initialize());
app.use(passport.session());
// obsługa zasobów statycznych
app.use(express.static('public'));

app.post('/login',
    passport.authenticate('local'),
    (req, res) => {
        res.status(200).send('ok');
    }
);
app.get('/logout', (req, res) => {
    console.log('Wylogowanie...');
    req.logout();
    res.send("Wylogowano");
});

/* Referees */

app.post('/referee', (req, res) => {
    addReferee(req, res);
});

app.get('/referee', (req, res) => {
    getReferees(req, res);
});

app.get('/referee/:id', (req, res) => {
    const id = req.params.id;
    getReferee(req, res, id);
});

app.delete('/referee/:id', (req, res) => {
    const id = req.params.id;
    removeReferee(req, res, id);
});

app.put('/referee/:id', (req, res) => {
    const id = req.params.id;
    updateReferee(req, res, id);
});

/* Classes */

app.post('/class', (req, res) => {
    addClass(req, res);
});

app.get('/class', (req, res) => {
    getClasses(req, res);
});

app.get('/class/:id', (req, res) => {
    const id = req.params.id;
    getClass(req, res, id);
});

app.delete('/class/:id', (req, res) => {
    const id = req.params.id;
    removeClass(req, res, id);
});

app.put('/class/:id', (req, res) => {
    const id = req.params.id;
    updateClass(req, res, id);
});

/* Horses */

app.post('/horse', (req, res) => {
    addHorse(req, res);
});

app.get('/horse', (req, res) => {
    getHorses(req, res);
});

app.get('/horse/:id', (req, res) => {
    const id = req.params.id;
    getHorse(req, res, id);
});

app.delete('/horse/:id', (req, res) => {
    const id = req.params.id;
    removeHorse(req, res, id);
});

app.put('/horse/:id', (req, res) => {
    const id = req.params.id;
    updateHorse(req, res, id);
});

app.put('/horse/mark/:id', (req, res) => {
    const id = req.params.id;
    markHorse(req, res, id);
});

app.put('/horse/draw/:id', (req, res) => {
    const id = req.params.id;
    fixDrawHorse(req, res, id);
});

app.get('/horse/marked/:id', (req, res) => {
    const id = req.params.id;
    getMarkedHorses(req, res, id);
});

app.post('/clear', (req, res) => {
    db.unset('referees').write();
    db.unset('classes').write();
    db.unset('horses').write();
    db.defaults({
            referees: JSON.parse(req.body.referees),
            classes: JSON.parse(req.body.classes),
            horses: JSON.parse(req.body.horses)
        })
        .write();
    res.status(200).send('clear');
});


/* Referees */

const addReferee = (req, res) => {
    db.get('referees')
        .push({
            id: shortid.generate(),
            name: req.body.name,
            country: req.body.country
        })
        .write();

    res.status(201).send("Referee has been created");
};

const getReferees = (req, res) => {
    const referees = db.get('referees');

    res.json(referees);
};

const getReferee = (req, res, id) => {
    const referee = db.get('referees').find({
        id: id
    }).value();

    res.json(referee);
};

const removeReferee = (req, res, id) => {
    db.get('referees')
        .remove({
            id: id
        })
        .write();

    res.status(200).send("Referee has been removed");
};

const updateReferee = (req, res, id) => {
    db.get('referees')
        .find({
            id: id
        })
        .assign({
            name: req.body.name,
            country: req.body.country
        })
        .write();

    res.status(200).send("Referee has been updated");
};

/* Classes */

const moveClassOnAdd = (req) => {

    const singleClass = db.get('classes').find({
        "number": parseInt(req.body.number)
    }).value();
    const classes = db.get('classes').value();

    if (singleClass) {
        classes.forEach(s => {
            if (s.number >= req.body.number) {
                db.get('classes')
                    .find({
                        id: s.id
                    })
                    .assign({
                        number: parseInt(s.number) + 1
                    })
                    .write();
            }
        });
    }
};

const moveClassOnUpdate = (req) => {

    const oldNumber = db.get('classes').find({
        "id": req.body.id
    }).value().number;
    const newNumber = req.body.number;
    const classes = db.get('classes').value();

    if (newNumber < oldNumber) {
        classes.forEach(s => {
            if (s.number >= newNumber && s.number < oldNumber) {
                db.get('classes')
                    .find({
                        id: s.id
                    })
                    .assign({
                        number: parseInt(s.number) + 1
                    })
                    .write();
            }
        });
    } else if (newNumber > oldNumber) {
        classes.forEach(s => {
            if (s.number <= newNumber && s.number > oldNumber) {
                db.get('classes')
                    .find({
                        id: s.id
                    })
                    .assign({
                        number: parseInt(s.number) - 1
                    })
                    .write();
            }
        });
    }
};

const addClass = (req, res) => {

    moveClassOnAdd(req);

    db.get('classes')
        .push({
            id: shortid.generate(),
            number: parseInt(req.body.number),
            category: req.body.category,
            comission: JSON.parse(req.body.comission)
        })
        .write();

    res.status(201).send("Class has been created");
};

const getClasses = (req, res) => {
    const classes = db.get('classes');

    res.json(classes);
};

const getClass = (req, res, id) => {
    const singleClass = db.get('classes').find({
        id: id
    }).value();

    res.json(singleClass);
};

const removeClass = (req, res, id) => {
    db.get('classes')
        .remove({
            id: id
        })
        .write();

    res.status(200).send("Class has been removed");
};

const updateClass = (req, res, id) => {

    moveClassOnUpdate(req);

    const horses = db.get('horses')
        .filter({
            class: id
        })
        .value();

    horses.forEach(horse => {
        db.get('horses')
            .find({
                id: horse.id
            })
            .unset('score')
            .write();
    });

    db.get('classes')
        .find({
            id: id
        })
        .assign({
            number: parseInt(req.body.number),
            category: req.body.category,
            comission: JSON.parse(req.body.comission)
        })
        .write();

    res.status(200).send("Class has been updated");
};

/* Horses */
const moveHorseOnAdd = (req) => {

    const horse = db.get('horses').find({
        "number": parseInt(req.body.number)
    }).value();
    const horses = db.get('horses').value();

    if (horse) {
        horses.forEach(h => {
            if (h.number >= req.body.number) {
                db.get('horses')
                    .find({
                        id: h.id
                    })
                    .assign({
                        number: parseInt(h.number) + 1
                    })
                    .write();
            }
        });
    }
};

const moveHorseOnUpdate = (req) => {

    const oldNumber = db.get('horses').find({
        "id": req.body.id
    }).value().number;
    const newNumber = req.body.number;
    const horses = db.get('horses').value();

    if (newNumber < oldNumber) {
        horses.forEach(h => {
            if (h.number >= newNumber && h.number < oldNumber) {
                db.get('horses')
                    .find({
                        id: h.id
                    })
                    .assign({
                        number: parseInt(h.number) + 1
                    })
                    .write();
            }
        });
    } else if (newNumber > oldNumber) {
        horses.forEach(h => {
            if (h.number <= newNumber && h.number > oldNumber) {
                db.get('horses')
                    .find({
                        id: h.id
                    })
                    .assign({
                        number: parseInt(h.number) - 1
                    })
                    .write();
            }
        });
    }
};

const addHorse = (req, res) => {

    moveHorseOnAdd(req);

    db.get('horses')
        .push({
            id: shortid.generate(),
            number: req.body.number,
            class: req.body.class,
            name: req.body.name,
            country: req.body.country,
            year: req.body.year,
            color: req.body.color,
            gender: req.body.gender,
            farmer: {
                name: req.body.farmersName,
                country: req.body.farmersCountry
            },
            father: {
                name: req.body.fathersName,
                country: req.body.fathersCountry
            },
            mother: {
                name: req.body.mothersName,
                country: req.body.mothersCountry
            },
            grandpa: {
                name: req.body.grandpasName,
                country: req.body.grandpasCountry
            }
        })
        .write();

    res.status(201).send("Referee has been created");
};

const getHorses = (req, res) => {
    const horses = db.get('horses');

    res.json(horses);
};

const getHorse = (req, res, id) => {
    const horse = db.get('horses').find({
        id: id
    }).value();

    res.json(horse);
};

const updateHorse = (req, res, id) => {

    moveHorseOnUpdate(req);

    const horse = db.get('horses')
        .find({
            id: id
        })
        .value();

    if (horse.class !== req.body.class) {
        db.get('horses')
            .find({
                id: id
            })
            .unset('score')
            .write();
    }

    db.get('horses')
        .find({
            id: id
        })
        .assign({
            number: req.body.number,
            class: req.body.class,
            name: req.body.name,
            country: req.body.country,
            year: req.body.year,
            color: req.body.color,
            gender: req.body.gender,
            farmer: {
                name: req.body.farmersName,
                country: req.body.farmersCountry
            },
            father: {
                name: req.body.fathersName,
                country: req.body.fathersCountry
            },
            mother: {
                name: req.body.mothersName,
                country: req.body.mothersCountry
            },
            grandpa: {
                name: req.body.grandpasName,
                country: req.body.grandpasCountry
            }
        })
        .write();

    res.status(200).send("Horse has been updated");
};

const removeHorse = (req, res, id) => {
    db.get('horses')
        .remove({
            id: id
        })
        .write();

    res.status(200).send("Horse has been removed");
};

const markHorse = (req, res, id) => {
    db.get('horses')
        .find({
            id: id
        })
        .assign({
            score: {
                marks: JSON.parse(req.body.marks)
            }
        })
        .unset('draw')
        .write();

    res.status(200).send("Horse has been marked");
};

const getMarkedHorses = (req, res, id) => {
    const horses = db.get('horses')
        .filter({
            class: id
        })
        .value();

    res.json(horses);
};

const fixDrawHorse = (req, res, id) => {
    db.get('horses')
        .find({
            id: id
        })
        .assign({
            draw: {
                fix: req.body.draw
            }
        })
        .write();

    res.status(200).send("Horse has been fixed");
};


db.defaults({
        referees: [],
        classes: [],
        horses: []
    })
    .write();

// serwer HTTP dla aplikacji „app”
const server = require('http').createServer(app);


// obsługa Socket.io
const sio = socketIo.listen(server);
// konfiguracja passport-socketio
// połączenie od autoryzowanego użytkownika
const onAuthorizeSuccess = (data, accept) => {
    // data – informacje o połączeniu (od Passport.js)
    // accept – funkcja służąca do akceptowania/odrzucania połączenia
    //          odrzucenie: accept(new Error('powód odrzucenia'));
    console.log('Udane połączenie z socket.io (zalogowany)');
    accept();
};
// połączenie od nieutoryzowanego użytkownika lub sytuacja błędna
const onAuthorizeFail = (data, message, error, accept) => {

    // połączenie nieautoryzowane (ale nie błąd)
    console.log('Udane połączenie z socket.io (gość)');
    accept();
};
// passport-socketio jako „middleware” dla Socket.io
sio.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: sessionKey,
    secret: sessionSecret,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
}));

sio.sockets.on('connection', (socket) => {
    socket.on('markHorse', () => {
        sio.emit('refreshHorses');
    });
    socket.emit('IS_AUTHORIZED', socket.request.user);
});

server.listen(3001, '192.168.1.12', () => {
    console.log('Serwer pod adresem http://192.168.1.12:3001/');
});