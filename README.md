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
### - locateByIndex ###
Find the element located at the *index* position of the list.
```
var sorted = new SortedList();
sorted.insertBatch([10, 5, 22, 2, -2, 0, 11, -1, 7, 2, 8, -3]);
// Now they are sorted as [-3, -2, -1, 0, 2, 2, 5, 7, 8, 10, 11, 22]

sorted.locateByIndex(5); // the 6th element in the sorted list is 2.
```

### - locate ###
Find the index in the sorted list where the given element could be inserted. 
The second parameter is to specify at which side we want to insert the given element, accept either 'left' or 'right'.
```
var sorted = new SortedList();
sorted.insertBatch([10, 5, 22, 2, -2, 0, 11, -1, 7, 2, 8, -3]); 
// Now they are sorted as [-3, -2, -1, 0, 2, 2, 5, 7, 8, 10, 11, 22]

sorted.locate(5, 'left'); // the first place (by insert to the 'left' side of same values) to insert is 6.
sorted.locate(7, 'right'); // the last place (by insert to the 'right' side of same values) to insert is 8.
```

### - removeByIndex ###
Remove the element at the given position of the list and return the element.
```
var sorted = new SortedList();
sorted.insertBatch([10, 5, 22, 2, -2, 0, 11, -1, 7, 2, 8, -3]); 
// Now they are sorted as [-3, -2, -1, 0, 2, 2, 5, 7, 8, 10, 11, 22]

sorted.removeByIndex(5); // the second instance of '2' is removed, the returned value is 2. 
sorted.toArray();        // the remaining values are [-3, -2, -1, 0, 2, 5, 7, 8, 10, 11, 22]
```

### - remove ###
Remove elements in the sorted list which equals to the given element, and return the removed ones.
```
var sorted = new SortedList();
sorted.insertBatch([10, 5, 22, 2, -2, 0, 11, -1, 7, 2, 8, -3]); 
// Now they are sorted as [-3, -2, -1, 0, 2, 2, 5, 7, 8, 10, 11, 22]

sorted.remove(2);        // Two instances of '2' are removed, the returned value is [2, 2]. 
sorted.remove(13);       // There is no '13' in the list, the returned value is [];
sorted.toArray();        // the remaining values are [-3, -2, -1, 0, 5, 7, 8, 10, 11, 22]
```
