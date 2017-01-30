// Check out a old version first for comparing.
// Command example:
// >git show 1.0.2:index.js>./.abtest/index.js
// 
// the "1.0.2" is a tagged commit.

// Here start the a/b perf test:
var sampleSize = 1000000;
var data = [];
for(var i=0;i<sampleSize;i++)
    data.push(Math.random());

function perfTest(SortedListClass, data, scenario){
    var sorted = new SortedListClass();

    console.time(scenario);
    sorted.insertBatch(data);
    console.timeEnd(scenario);
}

var current = require('./index.js');
var base = require('./.abtest/index.js');

for(var i=0;i<3;i++){
    perfTest(current, data, i+ ": Insertion - Current");
    perfTest(base, data, i+ ": Insertion - Base");
}
