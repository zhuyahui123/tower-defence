let UIMgr = require("UIMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        gameGuideNode: {displayName: "游戏指引节点", default: null, type: cc.Node},
        gameGuideTips: {displayName: "游戏指引图标", default: null, type: cc.Sprite},

        gameGuide1: {displayName: "游戏指引1", default: null, type: cc.Node},
        gameGuide2: {displayName: "游戏指引2", default: null, type: cc.Node},
        gameGuide3: {displayName: "游戏指引3", default: null, type: cc.Node},
        gameGuide4: {displayName: "游戏指引4", default: null, type: cc.Node},

        gameGuide1NextBtn: {displayName: "指引1下一步", default: null, type: cc.Node},
        gameGuide1ExitBtn: {displayName: "指引1退出", default: null, type: cc.Node},
        gameGuide2PrevBtn: {displayName: "指引2上一步", default: null, type: cc.Node},
        gameGuide2NextBtn: {displayName: "指引2下一步", default: null, type: cc.Node},
        gameGuide2ExitBtn: {displayName: "指引2退出", default: null, type: cc.Node},
        gameGuide3PrevBtn: {displayName: "指引3上一步", default: null, type: cc.Node},
        gameGuide3NextBtn: {displayName: "指引3下一步", default: null, type: cc.Node},
        gameGuide3ExitBtn: {displayName: "指引3退出", default: null, type: cc.Node},
        gameGuide4PrevBtn: {displayName: "指引4上一步", default: null, type: cc.Node},
        gameGuide4NextBtn: {displayName: "指引4下一步", default: null, type: cc.Node},
        gameGuide4ExitBtn: {displayName: "指引4退出", default: null, type: cc.Node}
    },

    onLoad() {
        this.gameGuide1.active = true;
        this.gameGuideTips.node.active = true;
        this.gameGuide2.active = false;
        this.gameGuide3.active = false;
        this.gameGuide4.active = false;
    },

    // 指引1下一步
    onBtnClickNextStep1(){
        this.gameGuide1.active = false;
        this.gameGuide2.active = true;
        this.gameGuideTips.node.active = false;
    },
    // 指引1退出(游戏开始)
    onBtnClickExitStep1(){
        this.gameGuideNode.active = false;
        this.gameGuide1.active = false;
        this.gameGuideTips.node.active = false;
        cc.director.loadScene("game");
    },
    // 指引2上一步
    onBtnClickPrevStep2(){
        this.gameGuide1.active = true;
        this.gameGuide2.active = false;
    },
    // 指引2下一步
    onBtnClickNextStep2(){
        this.gameGuide2.active = false;
        this.gameGuide3.active = true;
    },
    // 指引2退出(游戏开始)
    onBtnClickExitStep2(){
        this.gameGuideNode.active = false;
        this.gameGuide2.active = false;
        cc.director.loadScene("game");
    },
    // 指引3上一步
    onBtnClickPrevStep3(){
        this.gameGuide2.active = true;
        this.gameGuide3.active = false;
    },
    // 指引3下一步
    onBtnClickNextStep3(){
        this.gameGuide3.active = false;
        this.gameGuide4.active = true;
    },
    // 指引3退出(游戏开始)
    onBtnClickExitStep3(){
        this.gameGuideNode.active = false;
        this.gameGuide3.active = false;
        cc.director.loadScene("game");
    },
    // 指引4上一步
    onBtnClickPrevStep4(){
        this.gameGuide3.active = true;
        this.gameGuide4.active = false;
    },
    // 指引4下一步(游戏开始)
    onBtnClickNextStep4(){
        this.gameGuideNode.active = false;
        cc.director.loadScene("game");
    },
    // 指引4退出(游戏开始)
    onBtnClickExitStep4(){
        this.gameGuideNode.active = false;
        this.gameGuide4.active = false;
        cc.director.loadScene("game");
    },
    onBtnClickClose() {
        UIMgr.destroyUI(this);
    }

});
