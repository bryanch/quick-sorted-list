var expect = require('chai').expect;
var SortedList = require('./');

describe('sorted-list', function(){
    var rawdata = [10, 5, 22, 2, -2, 0, 11, -1, 7, 2, 8, -3];

    it('validate order of the inserted elements', function(){
        var sorted = new SortedList();
        rawdata.forEach(function(d){sorted.insert(d);});

        expect(sorted.toArray()).to.eql([-3, -2, -1, 0, 2, 2, 5, 7, 8, 10, 11, 22]);
    });

    it('validate multiple instances of sorted list with different comparer', function(){
        var sorted = new SortedList();
        rawdata.forEach(function(d){sorted.insert(d);});

        var sorted2 = new SortedList(function(a,b){return a.key-b.key;});
        sorted2.insert({key: 10});
        sorted2.insert({key: 5});
        sorted2.insert({key: 22});
        sorted2.insert({key: 2});
        sorted2.insert({key: -2});
        sorted2.insert({key: 0});

        var sortedArray2 = sorted2.toArray().map(function(d){return d.key;});
        expect(sortedArray2).to.eql([-2, 0, 2, 5, 10, 22]);
    });

    it('validate length property counts correctly.', function(){
        var sorted = new SortedList();
        rawdata.forEach(function(d){sorted.insert(d);});

        expect(sorted.length).to.equal(rawdata.length);
    });

    var randomSize = 1000;
    it('validate '+randomSize+' random numbers.', function(){
        var raws = [];
        var sorted = new SortedList();

        for(var i = 0; i< randomSize; i++){
            var v = Math.random();
            raws.push(v);
            sorted.insert(v);
        }

        raws.sort();

        expect(sorted.toArray()).to.eql(raws);
    });

    it('validate cut function', function(){
        var sorted = new SortedList();
        sorted.insertBatch(rawdata);
        //sorted.print();
        
        var removed = sorted.cut(-1, 'left', true);
        expect(removed).to.eql([-3, -2, -1]);
        expect(sorted.toArray()).to.eql([0, 2, 2, 5, 7, 8, 10, 11, 22]);

        removed = sorted.cut(2, 'left', false);
        expect(removed).to.eql([0]);
        expect(sorted.toArray()).to.eql([2, 2, 5, 7, 8, 10, 11, 22]);

        removed = sorted.cut(2, 'left', true);
        expect(removed).to.eql([2,2]);
        expect(sorted.toArray()).to.eql([5, 7, 8, 10, 11, 22]);

        removed = sorted.cut(6, 'right', false);
        expect(removed).to.eql([7, 8, 10, 11, 22]);
        expect(sorted.toArray()).to.eql([5]);

        removed = sorted.cut(4, 'right', false);
        expect(removed).to.eql([5]);
        expect(sorted.toArray()).to.eql([]);
    });

});

