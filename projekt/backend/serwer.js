/*jshint node: true, esversion: 6, devel: true */

// Aplikacja Express.js
const express = require('express');
const app = express();

// mechanizm sesji (wykorzystamy bazę Redis)
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const sessionStore = new RedisStore({
    host: 'localhost',
    port: 6379,
    client: require('redis').createClient(),
    ttl:  260
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
passport.serializeUser( (user, done) => {
    done(null, user);
});

passport.deserializeUser( (obj, done) => {
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
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({credentials: true, origin: 'http://localhost:8080'}));

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

app.get('/user', (req, res) => {
      res.send(req.session.passport);
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

/* Horsers */

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
    const referee = db.get('referees').find({ id: id }).value();

    res.json(referee);
};

const removeReferee = (req, res, id) => {
    db.get('referees')
    .remove({ id: id })
    .write();

    res.status(200).send("Referee has been removed");
};

const updateReferee = (req, res, id) => {
    db.get('referees')
    .find({ id: id })
    .assign({
        name: req.body.name,
        country: req.body.country
    })
    .write();

    res.status(200).send("Referee has been updated");
};

/* Classes */

const addClass = (req, res) => {
    db.get('classes')
    .push({
        id: shortid.generate(),
        number: req.body.number,
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
    const singleClass = db.get('classes').find({ id: id }).value();

    res.json(singleClass);
};

const removeClass = (req, res, id) => {
    db.get('classes')
    .remove({ id: id })
    .write();

    res.status(200).send("Class has been removed");
};

const updateClass = (req, res, id) => {
    db.get('classes')
    .find({ id: id })
    .assign({
        number: req.body.number,
        category: req.body.category,
        comission: JSON.parse(req.body.comission)
    })
    .write();

    res.status(200).send("Class has been updated");
};

/* Horses */

const addHorse = (req, res) => {
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
    const horse = db.get('horses').find({ id: id }).value();

    res.json(horse);
};


db.defaults({ referees: [], classes: [], horses: [] })
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
    console.log('Udane połączenie z socket.io');
    accept();
};
// połączenie od nieutoryzowanego użytkownika lub sytuacja błędna
const onAuthorizeFail = (data, message, error, accept) => {
   
    // połączenie nieautoryzowane (ale nie błąd)
    console.log('Nieudane połączenie z socket.io');
    accept(new Error('Brak autoryzacji!'));
};
// passport-socketio jako „middleware” dla Socket.io
sio.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:          sessionKey,
    secret:       sessionSecret,
    store:        sessionStore,
    success:      onAuthorizeSuccess,
    fail:         onAuthorizeFail
}));

sio.sockets.on('connection', (socket) => {
    console.log('test');
});

server.listen(3001, () => {
    console.log('Serwer pod adresem http://localhost:3001/');
});
