// Check out a old version first for comparing.
// Command example:
// >git show 1.0.2:index.js>./.abtest/index.js
// 
// the "1.0.2" is a tagged commit.

// Note it turns out the noise in measuring the perf is so big that 
// even running exactly the same code could have 10-20% diff in elapsed time.
// However, the refactoring work using array instead of the left and right property
// keep getting a ~35% performance downgrade based on this test, might need to revisit
// that change later.

// Here start the a/b perf test:
var sampleSize = 100000;
var data = [];
for(var i=0;i<sampleSize;i++)
    data.push(Math.random());

function perfTest(SortedListClass, data){
    var sorted = new SortedListClass();

    var time = process.hrtime();
    sorted.insertBatch(data);
    var diff = process.hrtime(time);

    return diff[0]*1e9+diff[1];
}

var current = require('./index.js');
var base = require('./.abtest/index.js');

function perfDelta(baseET, newET){
    var r = (baseET/newET) - 1;
    if(r>0)
        return (r*100).toString().slice(0, 5) + '% Better';
    else if(r<0)
        return (-r*100).toString().slice(0, 5) + '% Worse';
    else
        return 'The same.';
}

console.log(' \t \t\t Base \t\t Current \t\t Delta%');
var measureCount = 7;
var basePerfs = [], currentPerfs = [];
for(var i=0;i<measureCount;i++){
    var basePerf = perfTest(base, data);
    var currentPerf = perfTest(current, data);

    console.log(' \t '+ i + '\t '+basePerf + 'ns\t\t'+ currentPerf +'ns\t\t'+perfDelta(basePerf, currentPerf));

    basePerfs.push(basePerf);
    currentPerfs.push(currentPerf);
}

function calculateAverage(floats){
    var max = Math.max(...floats);
    var min = Math.min(...floats);
    //console.log(max,min,floats);
    return (floats.reduce(function(a,b){return a+b;}, 0)-max-min)/(floats.length-2);
}

var avgBasePerf = calculateAverage(basePerfs);
var avgCurrentPerf = calculateAverage(currentPerfs);
console.log(' Average\t '+avgBasePerf + 'ns\t\t'+ avgCurrentPerf +'ns\t\t'+perfDelta(avgBasePerf, avgCurrentPerf));

