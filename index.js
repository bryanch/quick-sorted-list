
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

function rotateLeft(tree){
    var root = tree.right;
    tree.right = root.left;
    root.left = tree;
    tree.height = max(getHeight(tree.left), getHeight(tree.right))+1;
    root.height = max(root.left.height, getHeight(root.right))+1;
    return root;
}

function rotateRight(tree){
    var root = tree.left;
    tree.left = root.right;
    root.right = tree;
    tree.height = max(getHeight(tree.left), getHeight(tree.right))+1;
    root.height = max(getHeight(root.left), root.right.height)+1;
    return root;
}

var SortedList = defineClass({
    constructor: function(comparer){
        var AVLTree = defineClass({
            constructor: function(){
                this.left = null;
                this.right = null;
                this.height = 0;
                this.data = [];
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
                    else if(check>0){
                        if(this.right==null){
                            this.right=new AVLTree();
                        }

                        var previousHeight = this.right.height;
                        this.right = this.right.insert(element);
                        if(this.right.height>previousHeight){
                            var leftHeight = getHeight(this.left);
                            if(previousHeight>leftHeight){
                                if(getHeight(this.right.left)>getHeight(this.right.right)){
                                    this.right = rotateRight(this.right);
                                }

                                return rotateLeft(this);
                            }
                            else{
                                this.height = this.right.height+1;
                                return this;
                            }
                        }
                        else
                            return this;
                    }
                    else{
                        if(this.left==null){
                            this.left=new AVLTree();
                        }

                        var previousHeight = this.left.height;
                        this.left = this.left.insert(element);
                        if(this.left.height>previousHeight){
                            var rightHeight = getHeight(this.right);
                            if(previousHeight>rightHeight){
                                if(getHeight(this.left.right)>getHeight(this.left.left)){
                                    this.left = rotateLeft(this.left);
                                }

                                return rotateRight(this);
                            }
                            else{
                                this.height = this.left.height+1;
                                return this;
                            }
                        }
                        else
                            return this;
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

        this.data = new AVLTree();
        this.length = 0;
    },

    insert: function(element){
        this.data = this.data.insert(element);
        this.length++;
    },

    insertBatch: function(elements){
        elements.forEach(function(e){this.data.insert(e);});
    },

    toArray: function(){
        return this.data.toArray();
    }
});

module.exports = SortedList;
