module.exports = {
    // 节点变灰组件
    grayed(node) {
        let spr = node.getComponent(cc.Sprite);
        if (spr) {
            spr._sgNode.setState(1);
        }
    },
    unGrayed(node){
        let spr = node.getComponent(cc.Sprite);
        if (spr) {
            spr._sgNode.setState(0);
        }
    },
};