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

const poKolei = (fun1, fun2, cb) => {
    fun1((dane) => {
        fun2(dane, (dane2) => {
            cb(dane2);
        });
    });
};

poKolei(fun1, fun2, (cb) => {
    console.log(cb);
});