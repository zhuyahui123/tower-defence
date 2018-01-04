let global = require('global');

cc.Class({
    extends: cc.Component,

    properties: {
        timeCountDownLabel: {displayName: "倒计时", default: null, type: cc.Label},
        startLabel: {displayName: "游戏开始", default: null, type: cc.Label}
    },

    onLoad() {
        this.nowTime = 4;
        this.startLabel.node.active = false;
    },
    update(dt) {
        if (this.nowTime > 0) {
            this.nowTime -= dt;
            // cc.log("now time = " +( this.nowTime - Math.floor(this.nowTime)));
            if ((this.nowTime - Math.floor(this.nowTime)) < 0.1) {
                this.timeCountDownLabel.string = (Math.floor(this.nowTime) - 1);
                if (Math.floor(this.nowTime) === 0) {
                    cc.log("游戏开始");
                    this.timeCountDownLabel.string = "";
                    this.startLabel.node.active = true;
                    let action0 = cc.moveTo(0.2, cc.p(0, 0));
                    this.startLabel.node.runAction(action0);
                    this.scheduleOnce(function () {
                        let action1 = cc.fadeOut(1.0);
                        this.startLabel.node.runAction(action1);
                    }, 1);
                    this.nowTime = 0;
                    global.event.fire("game_start"); //发一个游戏开始消息
                }
            }
        }
    }
});
