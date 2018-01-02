let AudioMgr = require("AudioMgr");

cc.Class({
    extends: cc.Component,

    properties: {
        clickSound: {default: null, displayName: "按钮声音", url: cc.AudioClip},
    },

    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_START, function () {
            if (this.clickSound) {
                let soundID = cc.audioEngine.playEffect(this.clickSound, false);
            } else {
                AudioMgr.playNorBtnEffect();
            }
        }, this);
    },
});
