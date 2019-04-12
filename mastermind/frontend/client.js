/* jshint strict: global, esversion: 6, devel: true, browser: true */
'use strict';

const serverIp = "http://localhost:3001/";

let size = document.getElementById('form-size');
let colors = document.getElementById('form-colors');
let steps = document.getElementById('form-steps');

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
                "size": size.value,
                "colors": colors.value,
                "steps": steps.value
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
            let solutionElement = document.createElement("span");
            solutionElement.setAttribute("id", "solution" + i + k);
            solutionElement.className = "solutions";
            document.getElementById("step" + i).append(solutionElement);
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

    colorsArray.forEach(element => {
        element.addEventListener('click', function () {
            localStorage.setItem("color", getComputedStyle(element).backgroundColor);
        });
    });

    sizesArray.forEach(element => {
        element.addEventListener('click', function () {
            if (!element.hasAttribute("disabled")) {
                element.style.backgroundColor = localStorage.getItem("color");
            }
        });
    });

    document.getElementById('submitButton').addEventListener('click', function () {
        sizesArray.forEach(element => {
            if (!element.hasAttribute("disabled")) {
                element.setAttribute("disabled", "disabled");
                let id = element.getAttribute("id").replace("size", "") - 10;
                if (document.getElementById("size" + id) !== null) {
                    document.getElementById("size" + id).removeAttribute("disabled");
                }
            }
        });
    });
};
