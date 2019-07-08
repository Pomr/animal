var pool={
    createPoolNode(prefab1,prefab2){
        if(!this.chessNodepool){
            this.chessNodepool = new cc.NodePool();
            this.chess=prefab1;
        }
        if(!this.nextNodepool){
            this.nextNodepool = new cc.NodePool();
            this.next=prefab2;
        }
        // for (var i = 0; i < this.row * this.column; i++) {
        //     var chess = cc.instantiate(this.chess);
        //     this.chessNodepool.put(chess);
        //     var next = cc.instantiate(this.next);
        //     this.nextNodepool.put(next);
        // }
    },
    getChess(){
        var prefab=null;
        if(this.chessNodepool.size()>0){
            prefab=this.chessNodepool.get();
        }
        else{
            prefab=cc.instantiate(this.chess);
        }
        return prefab;
    },
    getNext(){
        var prefab=null;
        if(this.nextNodepool.size()>0){
            prefab=this.nextNodepool.get();
        }
        else{
            prefab=cc.instantiate(this.next);
        }
        return prefab;
    },
    putChess(node){
        this.chessNodepool.put(node);
    },
    putNext(node){
        this.nextNodepool.put(node);
    },
}
module.exports=pool;