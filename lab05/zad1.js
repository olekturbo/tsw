/* jshint strict: global, esversion: 6, devel: true */
'use strict';

const ocena = (kod) => {
    return (ruch) => {
        
    };
};

const ruch = [2, 2, 3, 9, 2];
const kod = [1, 3, 3, 2, 2];

const toMap = (tab) => {
    let map = new Map();

    tab.forEach((element, index) => {
        // robimy coś z elementem "element" stojącym na indeksie "index"
        if (!map.has(element)) {
            map.set(element, new Set());
        }
        map.get(element).add(index);
    });

    // zwraca reprezentację kodu/ruchu
    return map;
};

console.log(toMap(ruch));
console.log(toMap(kod));
console.log(ocena(toMap(kod)));