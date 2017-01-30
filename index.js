
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
    constructor: function(comparer){
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
                        this.data.push(element);
                        return this;
                    }
                    else if(check>0){
                        if(this.right==null){
                            this.right=new AVLTree();
                        }

                        var previousHeight = this.right.height;
                        this.right = this.right.insert(element);
                        updateHeight(this);
                        return balanceAfterInsertRight(this, previousHeight);
                    }
                    else{
                        if(this.left==null){
                            this.left=new AVLTree();
                        }

                        var previousHeight = this.left.height;
                        this.left = this.left.insert(element);
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
                    return [];
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

            toArray: function(){
                var result = [];
                if(this.left!=null)result=result.concat(this.left.toArray());
                result=result.concat(this.data);
                if(this.right!=null)result=result.concat(this.right.toArray());
                return result;
            }
        });

        AVLTree.prototype.comparer = comparer || defaultComparer;

        this.createNewHead = function(){return new AVLTree();};
        this.data = this.createNewHead();
        this.length = 0;
    },

    insert: function(element){
        this.data = this.data.insert(element);
        this.length++;
    },

    insertBatch: function(elements){
        var data = this.data;
        elements.forEach(function(e){data=data.insert(e);});
        this.data = data;
        this.length = data.count;
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
    }
});

module.exports = SortedList;
