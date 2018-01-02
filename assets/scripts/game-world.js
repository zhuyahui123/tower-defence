cc.Class({
    extends: cc.Component,

    properties: {
        levelPrefabs: {displayName:"关卡预制", default: [], type: cc.Prefab},
        gameLayerNode: {displayName:"游戏层节点", default: null, type: cc.Node},
        gameUiLayerNode: {displayName:"游戏层UI节点", default: null, type: cc.Node}
    },

    onLoad() {
        let level = cc.instantiate(this.levelPrefabs[0]);
        level.parent = this.gameLayerNode;
    }
});
