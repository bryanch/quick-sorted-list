
function defineClass(prototype) {
    var constructor = prototype.constructor;
    constructor.prototype = prototype;
    return constructor;
}

function defaultComparer(a,b){
    if(a===b)
        return 0;
    else
        return a>b?1:-1;
}

function max(a,b){
    return a>b?a:b;
}

function getHeight(tree){
    return tree==null?0:tree.height;
}

function getDataCount(tree){
    return tree==null?0:tree.count;
}

function updateHeight(tree){
    tree.height = max(getHeight(tree.left), getHeight(tree.right))+1;
}

function updateCount(tree){
    tree.count = getDataCount(tree.left)+tree.data.length+getDataCount(tree.right);
}

function rotateLeft(tree){
    var root = tree.right;
    tree.right = root.left;
    root.left = tree;
    tree.height = max(getHeight(tree.left), getHeight(tree.right))+1;
    tree.count = getDataCount(tree.left)+tree.data.length+getDataCount(tree.right);
    root.height = max(root.left.height, getHeight(root.right))+1;
    root.count = root.left.count+root.data.length+getDataCount(root.right);
    return root;
}

function rotateRight(tree){
    var root = tree.left;
    tree.left = root.right;
    root.right = tree;
    tree.height = max(getHeight(tree.left), getHeight(tree.right))+1;
    tree.count = getDataCount(tree.left)+tree.data.length+getDataCount(tree.right);
    root.height = max(getHeight(root.left), root.right.height)+1;
    root.count = getDataCount(root.left)+root.data.length+root.right.count;
    return root;
}

function getHeightDiff(tree){
    return getHeight(tree.right)-getHeight(tree.left);
}

function balanceOnce(tree){
    var heightDiff = getHeightDiff(tree);
    if(heightDiff>1){
        if(getHeightDiff(tree.right)<0){
            tree.right=rotateRight(tree.right);
        }

        return rotateLeft(tree);
    }
    else if(heightDiff<-1){
        if(getHeightDiff(tree.left)>0){
            tree.left=rotateLeft(tree.left);
        }

        return rotateRight(tree);
    }

    return tree;
}

function balance(tree){
    var newHead = balanceOnce(tree);
    while(newHead!==tree){
        tree = newHead;
        newHead = balanceOnce(tree);
    }

    return newHead;
}

function balanceAfterInsertRight(tree, prevRightHeight){
    if(tree.right.height>prevRightHeight){
        var leftHeight = getHeight(tree.left);
        if(prevRightHeight>leftHeight){
            if(getHeight(tree.right.left)>getHeight(tree.right.right)){
                tree.right = rotateRight(tree.right);
            }

            return rotateLeft(tree);
        }
        else{
            tree.height = tree.right.height+1;
            return tree;
        }
    }
    else
        return tree;
}

function balanceAfterInsertLeft(tree, prevLeftHeight){
    if(tree.left.height>prevLeftHeight){
        var rightHeight = getHeight(tree.right);
        if(prevLeftHeight>rightHeight){
            if(getHeight(tree.left.right)>getHeight(tree.left.left)){
                tree.left = rotateLeft(tree.left);
            }

            return rotateRight(tree);
        }
        else{
            tree.height = tree.left.height+1;
            return tree;
        }
    }
    else
        return tree;
}

var SortedList = defineClass({
    constructor: function(comparer, allowDuplicate){
        var AVLTree = defineClass({
            constructor: function(){
                this.left = null;
                this.right = null;
                this.height = 0;
                this.count = 0;
                this.data = [];
            },

            insert: function(element){
                this.count++;
                if(this.data.length===0){
                    this.data.push(element);
                    this.height = 1;
                    return this;
                }
                else{
                    var check = this.comparer(element, this.data[0]);
                    if(check===0){
                        if(!this.allowDuplicate)return false;
                        this.data.push(element);
                        return this;
                    }
                    else if(check>0){
                        if(this.right==null){
                            this.right=new AVLTree();
                        }

                        var previousHeight = this.right.height;
                        var result = this.right.insert(element);
                        if(result==false)return false;

                        this.right = result;
                        updateHeight(this);
                        return balanceAfterInsertRight(this, previousHeight);
                    }
                    else{
                        if(this.left==null){
                            this.left=new AVLTree();
                        }

                        var previousHeight = this.left.height;
                        var result = this.left.insert(element);
                        if(result==false)return false;
                        
                        this.left = result;
                        updateHeight(this);
                        return balanceAfterInsertLeft(this, previousHeight);
                    }
                }
            },

            insertNode: function(node){
                if(this.data.length==0){
                    return node;
                }

                if(node.left || node.right || node.height>1){
                    throw new Error("node should be singleton for insertNode function.");
                }

                var sample = node.data[0];
                var check = this.comparer(sample, this.data[0]);
                if(check===0){
                    throw new Error("node with value '"+sample+"' should not exist.");
                }

                if(check>0){
                    if(this.right==null){
                        this.right = node;
                        this.height = max(this.height, this.right.height+1);
                        return this;
                    }

                    var previousHeight = this.right.height;
                    this.right = this.right.insertNode(node);
                    return balanceAfterInsertRight(this, previousHeight);
                }
                else{
                    if(this.left==null){
                        this.left = node;
                        this.height = max(this.height, this.left.height+1);
                        return this;
                    }

                    var previousHeight = this.left.height;
                    this.left = this.left.insertNode(node);
                    return balanceAfterInsertLeft(this, previousHeight);
                }
            },

            cut: function(element, side, includeHead, removed){
                if(this.data.length==0){
                    return this;
                }

                var check = this.comparer(element, this.data[0]);
                if(check==0){
                    if(side=='left'){
                        var newHead = this.right;
                        if(includeHead){
                            this.right = null;
                            if(removed)removed.push(this);
                            return newHead;
                        }
                        else{
                            if(removed&&this.left)removed.push(this.left);
                            this.left=null;
                            this.right=null;
                            this.height=1;
                            return newHead==null?newHead:newHead.insertNode(this);
                        }
                    }
                    else{
                        var newHead = this.left;
                        if(includeHead){
                            this.left = null;
                            if(removed)removed.push(this);
                            return newHead;
                        }
                        else{
                            if(removed&&this.right)removed.push(this.right);
                            this.left=null;
                            this.right=null;
                            this.height=1;
                            return newHead==null?newHead:newHead.insertNode(this);
                        }
                    }
                }
                else if(check>0){
                    if(side=='left'){
                        var newHead = this.right;
                        this.right = null;
                        if(removed)removed.push(this);
                            
                        return newHead==null?newHead:newHead.cut(element, side, includeHead, removed);
                    }
                    else{
                        if(this.right==null){
                            return this;
                        }
                        else{
                            this.right = this.right.cut(element, side, includeHead, removed);
                            updateHeight(this);
                            return balance(this);
                        }
                    }
                }
                else{
                    if(side=='right'){
                        var newHead = this.left;
                        newHead = (newHead==null)?newHead:newHead.cut(element, side, includeHead, removed);
                        this.left = null;
                        if(removed)removed.push(this);
                        return newHead;
                    }
                    else{
                        if(this.left==null){
                            return this;
                        }
                        else{
                            this.left = this.left.cut(element, side, includeHead, removed);
                            updateHeight(this);
                            return balance(this);
                        }
                    }
                }
            },

            iloc: function(index){
                if(index>=this.count || index<0)
                    return null;
                
                var leftCount = getDataCount(this.left);
                if(index<leftCount)
                    return this.left.iloc(index);
                
                index -= leftCount;
                if(index<this.data.length)
                    return this.data[index];
                
                return this.right.iloc(index-this.data.length);
            },

            loc: function(element, side){
                if(this.data.length==0)
                    return 0;
                
                var check = this.comparer(element, this.data[0]);
                if(check==0)
                    return side=='left'?getDataCount(this.left):getDataCount(this.left)+this.data.length;
                else if(check>0)
                    return this.right==null?this.count:getDataCount(this.left)+this.data.length+this.right.loc(element, side);
                else
                    return this.left==null?0:this.left.loc(element, side);
            },

            removeHead: function(){
                if(this.left==null){
                    if(this.right==null){
                        return null;
                    }
                    else{
                        return this.right;
                    }
                }
                else{
                    if(this.right==null){
                        return this.left;
                    }
                    else{
                        var newHead;
                        var pathToTheLeaf = [];
                        if(this.left.height>=this.right.height){
                            newHead = this.left;
                            while(newHead.right!=null){
                                pathToTheLeaf.push(newHead);
                                newHead=newHead.right;
                            }

                            if(pathToTheLeaf.length===0){
                                newHead.right = this.right;
                            }
                            else{
                                var parent = pathToTheLeaf.pop();
                                parent.right = newHead.left;
                                newHead.left = this.left;
                                newHead.right= this.right;

                                updateHeight(parent);
                                updateCount(parent);
                                while(true){
                                    var grandParent = pathToTheLeaf.pop();
                                    if(grandParent==null){
                                        newHead.left = balanceOnce(parent);
                                        break;
                                    }
                                    else
                                        grandParent.right = balanceOnce(parent);
                                    
                                    parent = grandParent;
                                }
                            }
                        }
                        else{
                            newHead = this.right;
                            while(newHead.left!=null){
                                pathToTheLeaf.push(newHead);
                                newHead=newHead.left;
                            }

                            if(pathToTheLeaf.length===0){
                                newHead.left = this.left;
                            }
                            else{
                                var parent = pathToTheLeaf.pop();
                                parent.left = newHead.right;
                                newHead.right = this.right;
                                newHead.left= this.left;

                                updateHeight(parent);
                                updateCount(parent);
                                while(true){
                                    var grandParent = pathToTheLeaf.pop();
                                    if(grandParent==null){
                                        newHead.right = balanceOnce(parent);
                                        break;
                                    }
                                    else
                                        grandParent.left = balanceOnce(parent);
                                    
                                    parent = grandParent;
                                }
                            }
                        }

                        updateHeight(newHead);
                        updateCount(newHead);
                        return newHead;
                    }
                }
            },

            remove: function(element, removed){
                var check = this.comparer(element, this.data[0]);
                if(check==0){
                    var newHead = this.removeHead();
                    if(removed)
                        for(var i=0;i<this.data.length;i++)
                            removed.push(this.data[i]);
                    return newHead;
                }

                if(check>0){
                    if(this.right==null){
                        return this;
                    }
                    else{
                        this.right = this.right.remove(element, removed);
                        updateCount(this);
                        return balanceOnce(this);
                    }
                }
                else{
                    if(this.left==null){
                        return this;
                    }
                    else{
                        this.left=this.left.remove(element, removed);
                        updateCount(this);
                        return balanceOnce(this);
                    }
                }
            },

            removeByIndex: function(index, removed){
                if(index>=this.count || index<0){
                    throw new Error("Index out of range.");
                }

                var leftCount = getDataCount(this.left);
                if(index<leftCount){
                    this.left=this.left.removeByIndex(index, removed);
                    return balanceOnce(this);
                }
                
                index -= leftCount;
                if(index<this.data.length){
                    if(this.data.length===1){
                        var newHead = this.removeHead();
                        if(removed)removed.push(this.data[0]);
                        return newHead;
                    }
                    else{
                        this.count--;
                        var r = this.data.splice(index, 1);
                        if(removed)
                            removed.push(r[0]);
                        return this;
                    }
                }
                else{
                    this.right = this.right.removeByIndex(index-this.data.length, removed);
                    return balanceOnce(this);
                }
            },

            toArray: function(){
                var result = [];
                if(this.left!=null)result=result.concat(this.left.toArray());
                result=result.concat(this.data);
                if(this.right!=null)result=result.concat(this.right.toArray());
                return result;
            }
        });

        AVLTree.prototype.comparer = comparer || defaultComparer;
        AVLTree.prototype.allowDuplicate = (allowDuplicate==undefined)?true:allowDuplicate;

        this.createNewHead = function(){return new AVLTree();};
        this.data = this.createNewHead();
        this.length = 0;
    },

    insert: function(element){
        var result = this.data.insert(element); 
        if(result==false)return false;
        this.data = result;
        this.length++;
        return true;
    },

    insertBatch: function(elements){
        var data = this.data;
        var result;
        for(var i = 0;i<elements.length;i++){
            var result = data.insert(elements[i]);
            if(result===false)break;
            data=result;
        }

        this.data = data;
        this.length = data.count;
        return result!==false;
    },

    toArray: function(){
        return this.data.toArray();
    },

    print: function(){
        var size = 5;
        var space = Array(size+1).join(" ");
        var formatValue= function(d){
            var str = d.toString();
            if(str.length>=size)
                return str.substring(0,size);
            else if(str.length>(size-2))
                return '['+str;
            else {
                var spaces = size-str.length-2;
                var leftSpaces = spaces>>1;
                return '['+space.substring(0, leftSpaces) + str + space.substring(0, spaces-leftSpaces)+ ']';
            }
        }
        
        var queue = [this.data];
        var levelSpace = '';
        var countPositions = (1<<(this.data.height-1))-1;
        for(var i=0;i<countPositions;i++)
            levelSpace+=space;
        var countNode=queue.length;
        while(countNode>0){
            countNode=0;
            var newQueue = [];
            var output = "";
            for(var i = 0;i<queue.length;i++){
                var head=queue[i];
                if(head==space){
                    output+=space;
                    newQueue.push(space);
                }
                else{
                    var value = (head==null)?space:formatValue(head.data);
                    output+=levelSpace+value+levelSpace;

                    if(head==null){
                        newQueue.push(null);
                        newQueue.push(space);
                        newQueue.push(null);
                    }
                    else{
                        if(head.left)countNode++;
                        if(head.right)countNode++;
                        newQueue.push(head.left);
                        newQueue.push(space);
                        newQueue.push(head.right);
                    }
                }
            }
            console.log(output);

            levelSpace = levelSpace.substring(0, ((levelSpace.length/space.length)>>1)*space.length);
            queue = newQueue;
        }        
    },

    cut: function(element, side, inclusive){
        var s = (side=='left')?'left':'right';
        var removed = [];
        this.data = this.data.cut(element, s, inclusive, removed);
        if(this.data==null)this.data = this.createNewHead();

        var result = [];
        removed.forEach(function(element) {
            result = result.concat(element.toArray());  
        });

        this.length = this.data.count;
        return result;
    },

    locateByIndex: function(index){
        return this.data.iloc(index);
    },

    locate: function(element, side){
        return this.data.loc(element, side);
    },

    remove: function(element){
        var removed = [];
        this.data = this.data.remove(element, removed);
        return removed;
    },

    removeByIndex: function(index){
        var removed = [];
        this.data = this.data.removeByIndex(index, removed);
        return removed[0];
    }
});

module.exports = SortedList;
