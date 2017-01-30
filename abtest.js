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
var measureCount = 5;
var avgBasePerf = 0, avgCurrentPerf = 0;
for(var i=0;i<measureCount;i++){
    var basePerf = perfTest(base, data);
    avgBasePerf+=basePerf;
    var currentPerf = perfTest(current, data);
    avgCurrentPerf += currentPerf;

    console.log(' \t '+ i + '\t '+basePerf + 'ns\t\t'+ currentPerf +'ns\t\t'+perfDelta(basePerf, currentPerf));
}
avgBasePerf/=measureCount;
avgCurrentPerf/=measureCount;
console.log(' Average\t '+avgBasePerf + 'ns\t\t'+ avgCurrentPerf +'ns\t\t'+perfDelta(avgBasePerf, avgCurrentPerf));

