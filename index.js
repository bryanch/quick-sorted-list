
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

var SortedList = defineClass({
    constructor: function(comparer){
        var AVLTree = defineClass({
            constructor: function(){
                this.left = null;
                this.right = null;
                this.data = [];
            },

            insert: function(element){
                if(this.data.length===0)
                    this.data.push(element);
                else{
                    var check = this.comparer(element, this.data[0]);
                    if(check===0)
                        this.data.push(element);
                    else if(check>0){
                        if(this.right==null)this.right=new AVLTree();
                        this.right.insert(element);
                    }
                    else{
                        if(this.left==null)this.left=new AVLTree();
                        this.left.insert(element);
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
    },

    insert: function(element){
        this.data.insert(element);
    },

    insertBatch: function(elements){
        elements.forEach(function(e){this.data.insert(e);});
    },

    toArray: function(){
        return this.data.toArray();
    }
});

module.exports = SortedList;
