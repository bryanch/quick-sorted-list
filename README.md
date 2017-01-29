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
### Properties ###
### - length ###
Return the number of values stored in the sorted list.
```
var sortedList = new SortedList();
sortedList.insert(1);
sortedList.insert(3);
console.log(sortedList.length); // 2
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
### - cut ###
Cut the sorted list by specified value. 
The first parameter 'element', specify the value to cut the sorted list.
Second parameter 'side', specify the side of sorted list to cut, either 'left' or 'right'.
The third parameter 'inclusive', specify if the elements which equal to the value should be cut or not.
```
var sorted = new SortedList();
sorted.insertBatch([10, 5, 22, 2, -2, 0, 11, -1, 7, 2, 8, -3]);

var removed = sorted.cut(-1, 'left', true);
console.log(removed);         // [-3, -2, -1];
console.log(sorted.toArray()) //[0, 2, 2, 5, 7, 8, 10, 11, 22]);

```
