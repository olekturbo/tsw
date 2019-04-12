/* jshint strict: global, esversion: 6, devel: true, node: true */
'use strict';

exports.createGame = function createGame(size, colorCount, steps) {
    return {
        solution: [...Array(size).keys()].map(x => Math.floor(Math.random() * colorCount) + 1),
        solved: false,
        steps: steps,
        size: size
    };
};

exports.countSolution = function countSolution(solution, move) {
    let whiteColors = 0;
    let blackColors = 0;
    let flags = new Array(solution.length);
    
    solution.forEach((s,i) => {
        if(s === move[i]) {
            flags[i] = true;
            blackColors++;
        }
    });

    solution.forEach((s, i) => {
        if(s !== move[i]) {
            move.forEach((m, j) => {
                if(!flags[j] && j !== i && m === s) {
                    flags[j] = true;
                    whiteColors++;
                    return;
                }
            });
        }
    });

    return {
        "black": blackColors,
        "white": whiteColors
    };
};