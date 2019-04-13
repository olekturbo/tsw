/* jshint strict: global, esversion: 6, devel: true, browser: true */
'use strict';

const serverIp = "http://localhost:3001/";

const colorPool = [
    'rgb(231, 76, 60)', 'rgb(136, 78, 160)', 'rgb(46, 134, 193)', 'rgb(23, 165, 137)',
    'rgb(40, 180, 99)', 'rgb(247, 220, 111)', 'rgb(154, 125, 10)', 'rgb(235, 152, 78)',
    'rgb(211, 84, 0)', 'rgb(131, 145, 146)', 'rgb(33, 47, 61)'
];

let colorMap = new Map();

colorPool.forEach((element, i) => {
    colorMap.set(element, i + 1);
});

const isFormValidated = (size, colors, steps) => {

    let array = [size, colors, steps];

    array.forEach(element => {
        element.style.borderBottomColor = element.value < 1 ? "red" : "#3f3f3f";
    });

    return size.value > 0 && colors.value > 0 && steps.value > 0 ? true : false;
};

function createGameboard() {
    let size = document.getElementById('form-size');
    let colors = document.getElementById('form-colors');
    let steps = document.getElementById('form-steps');
    if (isFormValidated(size, colors, steps)) {
        try {
            var xhttp = new XMLHttpRequest();
            xhttp.responseType = "json";
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    document.getElementById('start-form').style.display = "none";
                    localStorage.setItem('gameId', this.response.game);
                }
            };
            let data = {
                "size": parseInt(size.value),
                "colors": parseInt(colors.value),
                "steps": parseInt(steps.value)
            };
            xhttp.open("POST", serverIp + "game/new", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify(data));

            createGame(size.value, colors.value, steps.value);
        }
        catch (e) {
            alert(e);
        }
    }
}

const createGame = (size, colors, steps) => {
    displayGame();
    createSections(colors, size, steps);
    createSubmitButton();
    createEventListeners();
};

const displayGame = () => {
    document.getElementById("game").style.display = "flex";
};

const createElement = (type, singular, plural, appendTo, counter) => {
    let element = document.createElement(type);
    element.setAttribute("id", singular + counter);
    element.className = plural;
    document.getElementById(appendTo).append(element);
};

const createDisabledElement = (type, singular, plural, appendTo, firstCounter, secondCounter, condition) => {
    let element = document.createElement(type);
    element.setAttribute("id", singular + firstCounter + secondCounter);
    if (condition) {
        element.setAttribute("disabled", "disabled");
    }
    element.className = plural;
    document.getElementById(appendTo).append(element);
};


const createSections = (colors, size, steps) => {

    for (let i = 1; i <= colors; i++) {
        createElement("span", "color", "colors", "colors-list", i);
    }

    for (let i = 1; i <= steps; i++) {
        createElement("div", "step", "steps", "steps-list", i);

        for (let j = 1; j <= size; j++) {
            createDisabledElement("span", "size", "sizes", "step" + i, i, j, i != steps);
        }

        for (let k = 1; k <= size; k++) {
            createDisabledElement("span", "peg", "pegs", "step" + i, i, k, i != steps);
        }
    }
};

const createSubmitButton = () => {
    let element = document.createElement("button");
    element.setAttribute("id", "submitButton");
    element.innerHTML = "Check";
    document.getElementById("game").append(element);
};

const createEventListeners = () => {
    const colorsArray = [...document.getElementsByClassName('colors')];
    const sizesArray = [...document.getElementsByClassName('sizes')];
    const pegsArray = [...document.getElementsByClassName('pegs')];

    createColorsListener(colorsArray);
    createSizesListener(sizesArray);
    createSubmitListener(sizesArray, pegsArray);
};

const createColorsListener = (colorsArray) => {
    colorsArray.forEach(element => {
        element.addEventListener('click', function () {
            localStorage.setItem("color", getComputedStyle(element).backgroundColor);
        });
    });
};

const createSizesListener = (sizesArray) => {
    sizesArray.forEach(element => {
        element.addEventListener('click', function () {
            if (!element.hasAttribute("disabled")) {
                element.style.backgroundColor = localStorage.getItem("color");
                element.setAttribute("data-color", colorMap.get(localStorage.getItem("color")));
            }
        });
    });
};

const createSubmitListener = (sizesArray, pegsArray) => {
    document.getElementById('submitButton').addEventListener('click', function () {
        handleMove();
        handleDisabled(sizesArray, "size");
        handleDisabled(pegsArray, "peg");
    });
};

const handleDisabled = (array, toReplace) => {
    array.forEach(element => {
        if (!element.hasAttribute("disabled")) {
            element.setAttribute("disabled", "disabled");
            let id = element.getAttribute("id").replace(toReplace, "") - 10;
            if (document.getElementById(toReplace + id) !== null) {
                document.getElementById(toReplace + id).removeAttribute("disabled");
            }
        }
    });
};

const handleMove = () => {
    try {
        const tempColorsArray = [...document.querySelectorAll('.sizes:not([disabled="disabled"])')];
        const tempPegsArray = [...document.querySelectorAll('.pegs:not([disabled="disabled"])')];
        let move = [];
        tempColorsArray.forEach(element => {
            move.push(parseInt(element.getAttribute("data-color")));
        });
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = "json";
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let pegs = JSON.parse(this.response.result.places);
                pegs.forEach((element, i) => {
                    if (element) {
                        tempPegsArray[i].style.backgroundColor = element;
                    }
                });
                handleStatus(this.response.steps);
            }
        };
        let data = {
            "game": localStorage.getItem("gameId"),
            "move": move
        };
        xhttp.open("POST", serverIp + "game/move", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));

    }
    catch (e) {
        alert(e);
    }
};

const handleStatus = (steps) => {
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = "json";
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                if (this.response.solved) {
                    alert("Congratulations, you've won!");
                } else if (!steps) {
                    alert("Unfortunetely, you've lost!");
                }

                if (this.response.solved || !steps) {
                    localStorage.clear();
                    location.reload();
                }
            }
        };
        let data = {
            "game": localStorage.getItem("gameId"),
        };
        xhttp.open("POST", serverIp + "game/status", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(data));
    } catch (e) {
        alert(e);
    }
};