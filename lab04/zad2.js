/* jshint strict: global, esversion: 6, devel: true */
'use strict';

var tekst = 'Ala i As poszli w las';

String.prototype.nbsp = function() {
	return this.replace(/\s[aiouwz]\s/g, function(str) {
		return str + '&nbsp;';
    });
};

console.log(tekst.nbsp());