/* jshint strict: global, esversion: 6, devel: true, browser: true */
'use strict';

window.addEventListener('DOMContentLoaded', (event) => {
    let hd = document.querySelectorAll('.hd');
    hd.forEach(el => {
        el.addEventListener('click', function () {
            if (!el.hasAttribute('closed')) {
                el.setAttribute('closed', 'true');
                el.nextElementSibling.style.display = "none";
            } else {
                el.removeAttribute('closed');
                el.nextElementSibling.removeAttribute('style');
            }
        });
    });
});