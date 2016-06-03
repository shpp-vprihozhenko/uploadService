/**
 * Created by vladimir on 03.05.16.
 */
var sourceFileName = "./words24m.txt";
var prefMaxLength = 8,
    prefMinLength = 3;
var prefLimitFreq = 30;
var resFileName = "pref.txt";

var fs = require('fs');

var arWords = fs.readFileSync(sourceFileName).toString().split("\n").map(function(el){
    var obj={};
    var arEl = el.split(" ");
    obj.state = arEl[0];
    obj.word = arEl[1];
    return obj;
});
console.log ("words read", arWords.length);

var objOk = {},
    objBad= {};

findPrefFreq (arWords, objOk, objBad, prefMaxLength, prefMinLength);

//console.log(" OK ", objOk);
//console.log(" BAD ", objBad);
var arOkPref = filterByFreq (objOk, objBad);
console.log ("arOk fin", arOkPref);
console.log ("arOk size", arOkPref.length);

writeToFile (arOkPref, resFileName);

// ---------------------------------------------------------------
function writeToFile(arOkPref, resFileName) {
    var stream = fs.createWriteStream(resFileName);
    stream.once('open', function(fd) {
        arOkPref.forEach(function(elem){
            stream.write(elem+"\n");
        });
        stream.end();
    });
}

function filterByFreq(objOk, objBad) {
    var res = [];
    for (var pref in objOk) {
        if (objOk[pref] > prefLimitFreq) {
            if (objBad[pref] == undefined) {
                res.push(pref);
            } else {
                if (objOk[pref] > objBad[pref]) {
                    res.push(pref);
                }
            }
        }
    }
    return res;
}

function findPrefFreq(arWords, objOk, objBad, prefMaxLength, prefMinLength) {
    arWords.forEach(function(el){
        if (el.word){
            for (var i = prefMinLength; i<prefMaxLength; i++) {
                var pref = el.word.substr(0, i);
                if (el.state=="1") {
                    if (objOk[pref]==undefined) {
                        objOk[pref]=1;
                    } else {
                        objOk[pref]++;
                    }
                } else {
                    if (objBad[pref]==undefined) {
                        objBad[pref]=1;
                    } else {
                        objBad[pref]++;
                    }
                }
            }
        }
    })
}
