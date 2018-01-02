let global = require('global');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
    },
    onBtnClickBuild(event, coustomData) {
        cc.log("button click " + coustomData);
        global.event.fire("build_tower", coustomData); // 发布建塔消息
    }
});
