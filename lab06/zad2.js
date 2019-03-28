/* jshint strict: global, esversion: 6, devel: true, node: true */
'use strict';

const fun1 = (cb) => {
    setTimeout(() => {
        cb(123);
    }, Math.random() * 1000);
};

const fun2 = (cb) => {
    setTimeout(() => {
        cb(999);
    }, Math.random() * 1000);
};

const razem = (fun1, fun2, cb) => {
    let array = [];
    fun1((dane) => {
        array.push(dane);
        if (array.length === 2) {
            cb(array);
        }
    });
    fun2((dane) => {
        array.push(dane);
        if (array.length === 2) {
            cb(array);
        }

    });

};

razem(fun1, fun2, (dane) => {
    console.log(dane);
});