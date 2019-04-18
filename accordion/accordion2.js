/* jshint strict: global, esversion: 6, devel: true, browser: true */
'use strict';

const hideElement = (el) => {
    if (!el.hasAttribute('closed')) {
        el.setAttribute('closed', 'true');
        el.nextElementSibling.style.display = "none";
    }
};

const showElement = (el) => {
    if (el.hasAttribute('closed')) {
        el.removeAttribute('closed');
        el.nextElementSibling.removeAttribute('style');
    }
};

window.addEventListener('DOMContentLoaded', (event) => {
    let hd = document.querySelectorAll('.hd');

    hd.forEach(el => {
        // Ukrywamy na początek wszystkie elementy
        hideElement(el);
        el.addEventListener('mouseout', function () {
            hideElement(el);
        });
        el.addEventListener('mouseover', function () {
            showElement(el);
        });
    });
});