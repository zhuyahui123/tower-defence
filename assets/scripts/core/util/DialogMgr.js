module.exports = {
    showTipsWithOkBtn(word, okCb, cancelCb, closeCb) {
        let scene = cc.director.getScene();
        if (scene) {
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.loader.loadRes("prefab/dialog/DialogLayer", function (err, prefab) {
                if (!err) {
                    let layer = cc.instantiate(prefab);
                    layer.x = w / 2;
                    layer.y = h / 2;
                    scene.addChild(layer);
                    let script = layer.getComponent("DialogLayer");
                    if (script) {
                        script.showTipsWithOkBtn(word, okCb, cancelCb, closeCb);
                    }
                }
            });
        }
    },
    showTipsWithOkCancelBtn(word, okCb, cancelCb, closeCb) {
        let scene = cc.director.getScene();
        if (scene) {
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.loader.loadRes("prefab/dialog/DialogLayer", function (err, prefab) {
                if (!err) {
                    let layer = cc.instantiate(prefab);
                    layer.x = w / 2;
                    layer.y = h / 2;
                    scene.addChild(layer);
                    let script = layer.getComponent("DialogLayer");
                    if (script) {
                        script.showTipsWithOkCancelBtn(word, okCb, cancelCb, closeCb);
                    }
                }
            });
        }
    },
    // 只有一个确定按钮
    showTipsWithOkBtnAndNoCloseBtn(word, okCb, cancelCb) {
        let scene = cc.director.getScene();
        if (scene) {
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.loader.loadRes("prefab/dialog/DialogLayer", function (err, prefab) {
                if (!err) {
                    let layer = cc.instantiate(prefab);
                    layer.x = w / 2;
                    layer.y = h / 2;
                    scene.addChild(layer);
                    let script = layer.getComponent("DialogLayer");
                    if (script) {
                        script.showTipsWithOkBtn(word, okCb, cancelCb);
                        script.setCloseBtnVisible();
                    }
                }
            });
        }
    },
}