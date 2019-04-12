/* jshint strict: global, esversion: 6, devel: true, browser: true */
'use strict';

const serverIp = "http://localhost:3001/";

let size = document.getElementById('form-size');
let colors = document.getElementById('form-colors');
let steps = document.getElementById('form-steps');

let isFormValidated = () => {

    if (size.value < 1) {
        size.style.borderBottomColor = "red";
    } else {
        size.style.borderBottomColor = "#3f3f3f";
    }

    if (colors.value < 1) {
        colors.style.borderBottomColor = "red";
    } else {
        colors.style.borderBottomColor = "#3f3f3f";
    }

    if (steps.value < 1) {
        steps.style.borderBottomColor = "red";
    } else {
        steps.style.borderBottomColor = "#3f3f3f";
    }

    if (size.value > 0 && colors.value > 0 && steps.value > 0) {
        return true;
    } else {
        return false;
    }

};

function loadGame() {
    if (isFormValidated()) {
        var xhttp = new XMLHttpRequest();
        xhttp.responseType = "json";
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                document.getElementById('start-form').style.display = "none";
                localStorage.setItem('gameId', this.response.game);
            }
        };
        let data = JSON.stringify({
            "size": size.value,
            "colors": colors.value,
            "steps": steps.value
        });
        xhttp.open("POST", serverIp + "game/new", true);
        xhttp.send(data);
    }
}