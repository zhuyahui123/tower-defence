let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        startGameInstructionPre: {displayName: "游戏流程说明", default: null, type: cc.Prefab},
        startGamePre: {displayName: "游戏开始", default: null, type: cc.Prefab},
        instructionPre: {displayName: "游戏说明", default: null, type: cc.Prefab},
        shootSprite1: {displayName: "精灵1", default: null, type: cc.Sprite},
        shootSprite2: {displayName: "精灵2", default: null, type: cc.Sprite},
        uiNode: {displayName: "游戏节点", default: null, type: cc.Node}
    },

    onLoad() {
        let action1 = cc.moveTo(1,cc.p(0,200));
        let action2 = cc.fadeOut(1);
        let action3 = cc.moveTo(1,cc.p(0,50));
        let action4 = cc.fadeIn(1);
        let sequence0 = cc.sequence(action1, action2, action3, action4);
        let repeat0 = cc.repeatForever(sequence0);
        this.shootSprite1.node.runAction(repeat0);
        let delayTime = cc.delayTime(1);
        let action5 = cc.moveTo(1,cc.p(0,200));
        let action6 = cc.fadeOut(1);
        let action7 = cc.moveTo(1,cc.p(0,50));
        let action8 = cc.fadeIn(1);
        let sequence1 = cc.sequence(delayTime, action5, action6, action7, action8);
        let repeat1 = cc.repeatForever(sequence1);
        this.shootSprite2.node.runAction(repeat1);
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
