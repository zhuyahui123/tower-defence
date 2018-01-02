let global = require('global');

cc.Class({
    extends: cc.Component,

    properties: {
        timeCountDownLabel: {displayName: "倒计时", default: null, type: cc.Label}
    },

    onLoad() {
        this.nowTime = 4;
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
                    this.nowTime = 0;
                    global.event.fire("game_start"); //发一个游戏开始消息
                }
            }
        }
    }
});
