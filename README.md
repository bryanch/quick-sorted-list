# quick-sorted-list
A javascript sorted list using AVL binary tree for quick search.

### Installation ###
```
npm install quick-sorted-list
```
### Usage ###
```
var SortedList = require('quick-sorted-list');
var sortedList = new SortedList();
```
### Instantiation ###
The quick can be instantiated with an optional parameter object to specify a comparer to sort the elements.
```
var sortedList = new SortedList(function(a,b){return a.key-b.key;});
```
### Methods ###
### - insert ###
```
sortedList.insert({key:1});
```

### - toArray ###
Converts the sorted list to an Array
```
var valueArray = sortedList.toArray();
console.log(valueArray.toString());
```
