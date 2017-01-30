
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

function updateHeight(tree){
    tree.height = max(getHeight(tree.nodes[0]), getHeight(tree.nodes[1]))+1;
}

function getOpposite(side){
    return 1^side;
}

function rotate(tree, side){
    var opposite = 1^side;
    var root = tree.nodes[opposite];
    tree.nodes[opposite] = root.nodes[side];
    root.nodes[side] = tree;
    updateHeight(tree);
    updateHeight(root);
    return root;
}

function getHeightDiff(tree){
    return getHeight(tree.nodes[1])-getHeight(tree.nodes[0]);
}

function balanceOnce(tree){
    var heightDiff = getHeightDiff(tree);
    if(heightDiff<=1 && heightDiff>=-1)
        return tree;
    
    var heavySide = heightDiff>0?1:0;
    var subDiff = getHeightDiff(tree.nodes[heavySide]);
    if(subDiff!==0 && ((subDiff>0?1:0)^heavySide)==1){
        tree.nodes[heavySide]=rotate(tree.nodes[heavySide], heavySide);
    }

    return rotate(tree, 1^heavySide);
}

function balance(tree){
    var newHead = balanceOnce(tree);
    while(newHead!==tree){
        tree = newHead;
        newHead = balanceOnce(tree);
    }

    return newHead;
}

var SortedList = defineClass({
    constructor: function(comparer){
        var AVLTree = defineClass({
            constructor: function(){
                this.nodes = [null, null];
                this.data = [];
                this.height = 0;
            },

            insert: function(element){
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
                    
                    var side = check>0?1:0;
                    if(this.nodes[side]==null)
                        this.nodes[side]=new AVLTree();
                    
                    this.nodes[side]=this.nodes[side].insert(element);
                    updateHeight(this);
                    return balanceOnce(this);
                }
            },

            insertNode: function(node){
                if(this.data.length==0){
                    return node;
                }

                if(node.nodes[0] || node.nodes[1] || node.height>1){
                    throw error("node should be singleton for insertNode function.");
                }

                var sample = node.data[0];
                var check = this.comparer(sample, this.data[0]);
                if(check===0){
                    throw new Error("node with the same value '"+sample+"' should not exist.");
                }

                var side = check>0?1:0;
                if(this.nodes[side]==null)
                    this.nodes[side]=node;
                else
                    this.nodes[side]=this.nodes[side].insertNode(node);
                    
                updateHeight(this);
                return balanceOnce(this);
            },

            cut: function(element, side, includeHead, removed){
                if(this.data.length==0){
                    return [];
                }

                var check = this.comparer(element, this.data[0]);
                var opSide = 1^side;
                if(check===0){
                    var newHead = this.nodes[opSide];
                    if(includeHead){
                        this.nodes[opSide] = null;
                        if(removed)removed.push(this);
                        return newHead;
                    }
                    else{
                        if(removed&&this.nodes[side])removed.push(this.nodes[side]);
                        this.nodes=[null, null];
                        this.height=1;
                        return newHead==null?null:newHead.insertNode(this);
                    }
                }

                var nextSide=check>0?1:0;
                if(nextSide==side){
                    if(this.nodes[side]==null)return this;

                    this.nodes[side] = this.nodes[side].cut(element, side, includeHead, removed);
                    updateHeight(this);
                    return balance(this);
                }
                else{
                    var newHead = this.nodes[opSide];
                    this.nodes[opSide]=null;
                    if((side==0)&&removed)removed.push(this);
                    if(newHead!=null)newHead=newHead.cut(element, side, includeHead, removed);
                    if((side==1)&&removed)removed.push(this);
                    return newHead;
                }
            },

            toArray: function(){
                var result = [];
                if(this.nodes[0]!=null)result=result.concat(this.nodes[0].toArray());
                result=result.concat(this.data);
                if(this.nodes[1]!=null)result=result.concat(this.nodes[1].toArray());
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
        var self=this;
        elements.forEach(function(e){self.insert(e);});
    },

    toArray: function(){
        return this.data.toArray();
    },

    print: function(){
        var _write = process.stdout.write;
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
                        if(head.nodes[0])countNode++;
                        if(head.nodes[1])countNode++;
                        newQueue.push(head.nodes[0]);
                        newQueue.push(space);
                        newQueue.push(head.nodes[1]);
                    }
                }
            }
            console.log(output);

            levelSpace = levelSpace.substring(0, ((levelSpace.length/space.length)>>1)*space.length);
            queue = newQueue;
        }        
    },

    cut: function(element, side, inclusive){
        var s = (side=='left')?0:1;
        var removed = [];
        this.data = this.data.cut(element, s, inclusive, removed);
        if(this.data==null)this.data = this.createNewHead();

        var result = [];
        removed.forEach(function(element) {
            result = result.concat(element.toArray());  
        });

        return result;
    }
});

module.exports = SortedList;
