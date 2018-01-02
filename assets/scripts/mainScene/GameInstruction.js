let UIMgr = require("UIMgr");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },

    onBtnclickReback() {
        UIMgr.destroyUI(this);
    },
});
