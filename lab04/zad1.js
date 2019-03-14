/* jshint strict: global, esversion: 6, devel: true */
'use strict';
let defFun = function (fun, types) {
    fun.typeConstr = types;
    return fun;
};

const myfun = defFun((a, b) => a + b, ['number', 'number']);

let appFun = function (f) {
    if (!f.typeConstr) {
        throw ({ typerr: "typeConstr is undefinied" });
    }

    let args = Array.from(arguments);
    args.shift();
    
    args.forEach((element, key) => {
        if(typeof element === f.typeConstr[key]) {
            args.push(element);
        } else {
            throw ({ typerr: element + " is not equal with " + f.typeConstr[key] });
        }
    });

    return f.apply(this, args);
};

try {
    console.log(appFun(myfun, 12, 15));
} catch (e) {
    console.log(e.typerr);
}

