let global = require('global');

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
    },
    onBtnClickUpdate(event, coustomData) {
        cc.log("button click = " + coustomData);
        global.event.fire(coustomData + "_tower"); // 发布升级塔消息
    }
});
