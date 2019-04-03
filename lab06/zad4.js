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

const fun3 = (cb) => {
    setTimeout(() => {
        cb(555);
    }, Math.random() * 1000);
};

const funTab = [fun1, fun2, fun3];

const razemTab = (funTab, cb) => {
    let array = [];
    funTab.forEach(fun => {
        fun((dane) => {
            array.push(dane);
            if (array.length === funTab.length) {
                cb(array);
            }
        });
    });
};

razemTab(funTab, (dane) => {
    console.log(dane);
});