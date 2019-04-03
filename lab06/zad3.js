/* jshint strict: global, esversion: 6, devel: true, node: true */
'use strict';

const fun1 = (cb) => {
    setTimeout(() => {
        cb(123);
    }, Math.random() * 1000);
};

const fun2 = (dane, cb) => {
    setTimeout(() => {
        cb(dane);
    }, Math.random() * 1000);
};

const funTab = [fun1, fun2];

const poKoleiTab = (funTab, cb) => {
    funTab[0]((dane) => {
        funTab[1](dane, (dane2) => {
            cb(dane2);
        });
    });
};

poKoleiTab(funTab, (cb) => {
    console.log(cb);
});