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
    let places = new Array(solution.length);
    
    solution.forEach((s,i) => {
        if(s === move[i]) {
            flags[i] = true;
            places[i] = "BLACK";
            blackColors++;
        }
    });

    solution.forEach((s, i) => {
        if(s !== move[i]) {
            move.forEach((m, j) => {
                if(!flags[j] && j !== i && m === s) {
                    flags[j] = true;
                    places[j] = "WHITE";
                    whiteColors++;
                    return;
                }
            });
        }
    });

    return {
        "black": blackColors,
        "white": whiteColors,
        "places": JSON.stringify(places)
    };
};