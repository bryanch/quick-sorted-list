var expect = require('chai').expect;
var SortedList = require('./');

describe('sorted-list', function(){
    var target, target2;

    it('validate order of the inserted elements', function(){
        target = new SortedList();

        target.insert(10);
        target.insert(5);
        target.insert(17);
        target.insert(2);
        target.insert(-2);
        target.insert(0);

        var sorted = target.toArray();
        expect(sorted).to.eql([-2, 0, 2, 5, 10, 17]);
    });

    it('validate multiple instances of sorted list with different comparer', function(){
        target2 = new SortedList(function(a,b){return a.key-b.key;});
        target2.insert({key: 10});
        target2.insert({key: 5});
        target2.insert({key: 22});
        target2.insert({key: 2});
        target2.insert({key: -2});
        target2.insert({key: 0});

        target.insert(10);
        var sorted = target.toArray();
        expect(sorted).to.eql([-2, 0, 2, 5, 10, 10, 17]);

        var sorted2 = target2.toArray().map(function(d){return d.key;});
        expect(sorted2).to.eql([-2, 0, 2, 5, 10, 22]);
    });

    it('validate length property counts correctly.', function(){
        expect(target.length).to.equal(7);
        expect(target2.length).to.equal(6);
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
        var raw = [10, 5, 22, 2, -2, 0, 11, -1, 7, 2, 8, -3];
        var sorted = new SortedList();
        sorted.insertBatch(raw);
        sorted.print();
        
        expect(sorted.toArray()).to.eql([-3, -2, -1, 0, 2, 2, 5, 7, 8, 10, 11, 22]);

        var removed = sorted.cut(9, 'left', true);
        expect(removed).to.eql([-3, -2, -1, 0, 2, 2, 5, 7, 8]);
        expect(sorted.toArray()).to.eql([10, 11, 22]);
    });

});

