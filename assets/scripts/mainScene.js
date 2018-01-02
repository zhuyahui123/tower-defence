let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        startGameInstructionPre: {displayName: "游戏流程说明", default: null, type: cc.Prefab},
        startGamePre: {displayName: "游戏开始", default: null, type: cc.Prefab},
        instructionPre: {displayName: "游戏说明", default: null, type: cc.Prefab},
        uiNode: {displayName: "游戏节点", default: null, type: cc.Node},
    },

    onLoad() {
    },
    // 游戏开始
    onBtnClickGameStart() {
        // cc.director.loadScene("game");
        this.uiNode.destroyAllChildren();
        UIMgr.createPrefab(this.startGameInstructionPre, function (root, ui) {
            this.uiNode.addChild(root);
        }.bind(this));
    },
    // 游戏说明
    onBtnClickGameInstruction() {
        this.uiNode.destroyAllChildren();
        UIMgr.createPrefab(this.instructionPre, function (root, ui) {
            this.uiNode.addChild(root);
        }.bind(this));
    },
});
