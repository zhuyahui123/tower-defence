let global = require('global');
let UIMgr = require("UIMgr");
let Tips = require('Tips');
let UILoader = require('UILoader');
const TowerPosNodeState = {
    Invalid: -1,
    Null: 1,
    BuildMenu: 2,
    Tower: 3,
    UpdateMenu: 4
};
cc.Class({
    extends: cc.Component,

    properties: {
        enemyPathNodes: {displayName: "敌人路径节点", default: [], type: cc.Node},
        towerPosNodes: {displayName: "防塔位置节点", default: [], type: cc.Node},
        buildMenuPrefab: {displayName: "建立菜单预制", default: null, type: cc.Prefab},
        towerPrefabs: {displayName: "防塔预制", default: [], type: cc.Prefab},
        updateMenuPrefab: {displayName: "更新菜单预制", default: null, type: cc.Prefab},
        enemyPrefab: {displayName: "敌人预制", default: null, type: cc.Prefab},
        bulletPrefab: {displayName: "子弹预制", default: null, type: cc.Prefab},
        startGamePre: {displayName: "游戏开始", default: null, type: cc.Prefab},

        waves: {displayName: "当前波次", default: null, type: cc.Label},
        baseHealth: {displayName: "基地生命值", default: null, type: cc.Label},
        // baseHealthTotalNum: 10, //基地生命总值
        buildTower: {displayName: "建塔间隔", default: [], type: cc.Sprite},
        updateTower: {displayName: "升塔间隔", default: [], type: cc.Sprite},

        uiNode: {displayName: "游戏节点", default: null, type: cc.Node},
        wavesTotalNum: 0, //总波数
        toggle: {displayName: "复选按钮", default: null, type: cc.Toggle},
        G_coinCost: {displayName: "G币消耗", default: null, type: cc.Label},
        G_coinTotalNum: 10000,
        towerType: "",
        yes: 1,
    },

    onLoad() {
        for (let i = 0; i < this.towerPosNodes.length; i++) {
            let node = this.towerPosNodes[i];
            this._setState(node, TowerPosNodeState.Null); // 设置状态
            this._setTouchEvent(node); // 设置触摸事件
        };
        global.event.on("build_tower", this._buildTower.bind(this));// 接收建塔消息
        global.event.on("update_tower", this._updateTower.bind(this));// 接收升级塔消息
        global.event.on("sell_tower", this._sellTower.bind(this));// 接收卖掉塔消息
        global.event.on("game_start", this._gameStart.bind(this));// 接收游戏开始消失
        global.event.on("shoot_bullet", this._addBullet.bind(this));// 接收射击子弹消息
        global.event.on("enemy_running", this._currentPathPoint.bind(this));// 接收敌人跑消息
        this.currentWaveCount = 0; //当前波次
        this.currentEnemyCount = 0; //当前波次下敌人数量
        this.addEnemyCurrentTime = 0; //当前添加敌人的时间
        this.addWaveCurrentTime = 0; //当前加波次的时间
        this.currentPathPointCount = 0; // 当前走过的点的个数
        this.baseEnemyNum = 0; //基地生命总值
        this.enemyNodeList = []; // 敌人节点列表
        this.bulletNodeList = [];
    },
    // 设置触摸事件
    _setTouchEvent(node) {
        node.on(cc.Node.EventType.TOUCH_START, (event) => {
            cc.log("touch node name = " + event.target.name);
            if (node.state === TowerPosNodeState.Null) {
                this.showBuildMenu(event.target);
            } else if (node.state === TowerPosNodeState.Tower) {
                this.showUpdateMenu(event.target);
            }
        });
    },
    // 显示建立菜单
    showBuildMenu(node) {
        this._closeMenu();
        let menu = cc.instantiate(this.buildMenuPrefab);
        menu.parent = this.node;
        menu.position = node.position;
        this._setState(node, TowerPosNodeState.BuildMenu);
        node.menu = menu;
    },
    // 显示升级菜单
    showUpdateMenu(node) {
        this._closeMenu();
        let menu = cc.instantiate(this.updateMenuPrefab);
        menu.parent = this.node;
        menu.position = node.position;
        this._setState(node, TowerPosNodeState.UpdateMenu);
        node.menu = menu;
    },
    // 关闭菜单
    _closeMenu() {
        for (let i = 0; i < this.towerPosNodes.length; i++) {
            let node = this.towerPosNodes[i];
            if (node.state === TowerPosNodeState.BuildMenu) {
                node.menu.destroy();
                this._setState(node, TowerPosNodeState.Null);
                return node;
            } else if (node.state === TowerPosNodeState.UpdateMenu) {
                node.menu.destroy();
                this._setState(node, TowerPosNodeState.Tower);
                return node;
            }
        }
    },
    // 设置状态
    _setState(node, state) {
        if (node.state === state) {
            return;
        }
        switch (state) {
            case TowerPosNodeState.Null:
                break;
            case TowerPosNodeState.BuildMenu:
                break;
            default:
                break;
        }
        node.state = state;
    },
    // 建立塔
    _buildTower(data) {
        cc.log("build tower " + data);
        let node = this._closeMenu();
        let tower = cc.instantiate(this.towerPrefabs[data]);
        tower.parent = this.node;
        tower.position = node.position;
        this._setState(node, TowerPosNodeState.Tower);
        node.tower = tower;
        if (this.towerPrefabs[0]) {
            this.buildTower[0].node.color = cc.hexToColor("#6D6D6D");

            this.scheduleOnce(function () {
                this.buildTower[0].node.color = cc.hexToColor("#FF0303");
            }, 2)
        }
        if (this.towerPrefabs[1]) {
            this.buildTower[1].node.color = cc.hexToColor("#6D6D6D");
            this.scheduleOnce(function () {
                this.buildTower[1].node.color = cc.hexToColor("#FF0303");
            }, 2)
        }

        // 读取tower配置表
        cc.loader.loadRes("./config/tower_config", (err, result) => {
            if (err) {
                cc.log("load config = " + err);
            } else {
                cc.log("load config = " + JSON.stringify(result));
                this.towerConfig_a = result["tower_a"];
                this.buildCost_a = this.towerConfig_a.build_cost;
                this.updateCost_a = this.towerConfig_a.update_cost;
                // cc.log("------------------this.buildCost: " + this.buildCost_a);
                this.G_coinTotalNum -= this.buildCost_a;
                Tips.show("建立塔" + data + "消耗" + this.buildCost_a + "G币");
                this.G_coinCost.string = "G币：" + this.G_coinTotalNum;
                if (this.G_coinTotalNum < this.buildCost_a) {
                    Tips.show("G币不足");
                }
            }
        });
    },
    // 销毁塔
    onDestroy() {
        global.event.off("build_tower", this._buildTower);
    },
    // 升级塔
    _updateTower() {
        let node = this._closeMenu();
        node.tower.getComponent("tower").updateTower();

        if (this.yes) {
            this.updateTower[0].node.color = cc.hexToColor("#6D6D6D");
            this.scheduleOnce(function () {
                this.updateTower[0].node.color = cc.hexToColor("#00F127");
            }, 2);
        } else {
            this.updateTower[1].node.color = cc.hexToColor("#6D6D6D");
            this.scheduleOnce(function () {
                this.updateTower[1].node.color = cc.hexToColor("#00F127");
            }, 2);
        }

        cc.loader.loadRes("./config/tower_config", (err, result) => {
            if (err) {
                cc.log("load config = " + err);
            } else {
                cc.log("load config = " + JSON.stringify(result));
                this.towerConfig_b = result["tower_b"];
                this.updateCost_b = this.towerConfig_b.update_cost;
                this.G_coinTotalNum -= this.updateCost_b;
                this.G_coinCost.string = "G币：" + this.G_coinTotalNum;
                Tips.show("升级塔消耗" + this.updateCost_b + "G币");

                if (this.G_coinTotalNum < this.updateCost_b) {
                    Tips.show("G币不足");
                }
            }
        });
    },
    // 卖掉塔
    _sellTower: function () {
        let node = this._closeMenu();
        this._setState(node, TowerPosNodeState.Null);
        node.tower.getComponent("tower").sellTower();
        node.tower = undefined;
    },
    // 游戏开始
    _gameStart() {
        cc.loader.loadRes("./config/level_config", (err, result) => {
            if (err) {
                cc.log("load config " + err);
            } else {
                cc.log("level config" + JSON.stringify(result));
            }
            let config = result["level_1"];//第一关
            this.levelConfig = config;
            // let wavesConfig = config["waves"];
            this.wavesTotalNum = config["waves"].length;//总波次数
            // this.wavesCongig = wavesConfig;
            // this.currentWaveConfig = wavesConfig[0]; //波次
        });
    },
    // 添加敌人
    _addEnemy(type) {
        let waveNum = this.wavesTotalNum - this.currentWaveCount;
        this.waves.string = "剩余波次：" + waveNum;
        cc.log("add Enemy" + this.currentEnemyCount); //当前敌人个数
        cc.log("add Wave " + this.currentWaveCount); //当前波次个数
        let enemy = cc.instantiate(this.enemyPrefab);
        enemy.getComponent("enemy").initWithData(type, this.enemyPathNodes);
        enemy.parent = this.node;
        this.enemyNodeList.push(enemy);
        this.baseEnemyNum++;
        cc.log("------------this.baseHealthTotalNum: " + this.baseHealthTotalNum);
        let enemyNum = this.baseEnemyNum;
        this.baseHealth.string = "敌人数量：" + enemyNum;
    },
    // 添加子弹
    _addBullet(tower, position) {
        let bullet = cc.instantiate(this.bulletPrefab);
        // bullet.position = tower.position;
        bullet.parent = this.node;
        bullet.getComponent("bullet").initWithData(tower, position, this.enemyNodeList);
    },
    // 退出或关闭游戏
    onBtnClickClose() {
        // this._closeMenu();
        // UILoader.retainScene(this.node);
        // cc.director.loadScene("mainScene");

        // UIMgr.destroyUI(this);
        // this.node.destroyAllChildren();
        // UIMgr.createPrefab(this.startGamePre, function (root, ui) {
        //     this.uiNode.addChild(root);
        // }.bind(this));
    },
    // 暂停和继续游戏
    onToggleClickEvent() {
        if (this.toggle.isChecked === false) {
            cc.log("暂停");
            cc.director.pause();
        } else if (this.toggle.isChecked === true) {
            cc.log("继续");
            // cc.director.loadScene("game");
            cc.director.resume();
        }
    },
    // 当前敌人经过的节点
    _currentPathPoint(num) {
        let enemy = cc.instantiate(this.enemyPrefab);
        enemy.getComponent("enemy").currentPathPoint(num);
        this.currentPathPointCount = num;
        this.currentPathPointCount++;
        enemy.parent = this.node;
        this.enemyNodeList.push(enemy);
        let baseHealthNum = this.baseHealthTotalNum - num;
        this.baseHealth.string = "基地生命值：" + baseHealthNum;
    },
    update(dt) {
        if (this.currentWaveConfig) {
            if (this.addEnemyCurrentTime > this.currentWaveConfig.dt) {
                this.addEnemyCurrentTime = 0;
                this.currentEnemyCount++;
                this._addEnemy(this.currentWaveConfig.type);
                if (this.currentEnemyCount === this.currentWaveConfig.count) {
                    this.currentWaveConfig = undefined;
                    this.currentEnemyCount = 0;
                }
            }
            else {
                this.addEnemyCurrentTime += dt;
            }
        } else {
            if (this.addWaveCurrentTime > this.levelConfig.dt) {
                this.currentWaveConfig = this.levelConfig.waves[this.currentWaveCount];
                if (this.currentWaveCount < this.levelConfig.waves.length) {
                    this.currentWaveCount++;
                } else {
                    this.currentWaveConfig = undefined;
                }
                this.addWaveCurrentTime = 0;
            } else {
                this.addWaveCurrentTime += dt;
            }
        }
        for (let i = 0; i < this.towerPosNodes.length; i++) {
            let tower = this.towerPosNodes[i].tower;
            if (tower != undefined && tower.getComponent("tower").isFree()) {
                for (let j = 0; j < this.enemyNodeList.length; j++) {
                    let enemy = this.enemyNodeList[j];
                    if (enemy.getComponent("enemy").isLiving()) {
                        tower.getComponent("tower").setEnemy(enemy);
                    } else if (enemy.getComponent("enemy").isDead()) {
                        this.enemyNodeList.splice(j, 1);
                    }
                }
            }
        }

    }

});
