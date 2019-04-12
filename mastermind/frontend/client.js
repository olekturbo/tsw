/* jshint strict: global, esversion: 6, devel: true, browser: true */
'use strict';

const serverIp = "http://localhost:3001/";

let size = document.getElementById('form-size');
let colors = document.getElementById('form-colors');
let steps = document.getElementById('form-steps');

const colorPool = [
    'rgb(231, 76, 60)', 'rgb(136, 78, 160)', 'rgb(46, 134, 193)', 'rgb(23, 165, 137)',
    'rgb(40, 180, 99)', 'rgb(247, 220, 111)', '#9a7d0a', '#eb984e',
    '#d35400', '#839192', '#212f3d'
];

let colorMap = new Map();

colorPool.forEach((element, i) => {
    colorMap.set(element, i + 1);
});

const isFormValidated = () => {

    let array = [size, colors, steps];

    array.forEach(element => {
        element.style.borderBottomColor = steps.value < 1 ? "red" : "#3f3f3f";
    });

    return size.value > 0 && colors.value > 0 && steps.value > 0 ? true : false;
};

function loadGame() {
    if (isFormValidated()) {
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
    document.getElementById("game").style.display = "flex";

    createColorsSection(colors);
    createStepsSection(size, steps);
    createSubmitButton();
    createEventListeners();
};

const createColorsSection = (colors) => {
    for (let i = 1; i <= colors; i++) {
        let element = document.createElement("span");
        element.setAttribute("id", "color" + i);
        element.className = "colors";
        document.getElementById("colors-list").append(element);
    }
};

const createStepsSection = (size, steps) => {
    for (let i = 1; i <= steps; i++) {
        let stepElement = document.createElement("div");
        stepElement.setAttribute("id", "step" + i);
        stepElement.className = "steps";
        document.getElementById("steps-list").append(stepElement);

        for (let j = 1; j <= size; j++) {
            let sizeElement = document.createElement("span");
            sizeElement.setAttribute("id", "size" + i + j);
            if (i != steps) {
                sizeElement.setAttribute("disabled", "disabled");
            }
            sizeElement.className = "sizes";
            document.getElementById("step" + i).append(sizeElement);
        }

        for (let k = 1; k <= size; k++) {
            let pegElement = document.createElement("span");
            pegElement.setAttribute("id", "peg" + i + k);
            if (i != steps) {
                pegElement.setAttribute("disabled", "disabled");
            }
            pegElement.className = "pegs";
            document.getElementById("step" + i).append(pegElement);
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
