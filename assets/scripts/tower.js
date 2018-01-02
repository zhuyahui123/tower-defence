let global = require('global');
let Tips = require('Tips');
cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames: {displayName: "塔精灵资源", default: [], type: cc.SpriteFrame},
        spriteNode: {displayName: "精灵节点", default: null, type: cc.Sprite},
        towerType: ""
    },

    onLoad() {
        this.levelCount = 0; //当前等级
        this.currentDamage = 0;// 当前伤害
        this.lookRange = 0; // 识别范围
        this.currentAttackRange = 0; //当前攻击范围
        this.shootBulletDt = 0; // 射击子弹变量赋予射击时间间隔
        this.currentShootTime = 0; //当前的射击时间
        cc.loader.loadRes("./config/tower_config", (err, result) => {
            if (err) {
                cc.log("load config = " + err);
            } else {
                cc.log("load config = " + JSON.stringify(result));
                this.towerConfig = result[this.towerType];
                this.currentDamage = this.towerConfig.damages[this.levelCount]; // 当前伤害
                this.currentAttackRange = this.towerConfig.attack_ranges[this.levelCount]; // 当前攻击范围
                this.lookRange = this.towerConfig.look_range; // 当前识别范围
                this.shootBulletDt = this.towerConfig.shoot_dts[this.levelCount]; //当前射击间隔
                this.buildCost = this.towerConfig.build_cost; // 建塔消耗G币
                this.updateCost = this.towerConfig.update_cost; // 升级塔消耗G币
            }
        });
    },
    // 升级塔
    updateTower() {
        cc.log("update tower");
        if (this.levelCount < this.spriteFrames.length - 1) {
            this.levelCount++;
            this.spriteNode.spriteFrame = this.spriteFrames[this.levelCount];
            this.currentDamage = this.towerConfig.damages[this.levelCount];
            this.currentAttackRange = this.towerConfig.attack_ranges[this.levelCount];
            this.lookRange = this.towerConfig.look_range;
            this.shootBulletDt = this.towerConfig.shoot_dts[this.levelCount];
            this.buildCost = this.towerConfig.build_cost;
            this.updateCost = this.towerConfig.update_cost;
        } else {
            Tips.show("满级");
            cc.log("满级");
        }
    },
    // 销毁塔
    sellTower() {
        cc.log("sell tower");
        this.node.destroy();
    },
    // 是空闲状态
    isFree() {
        if (this.enemy === undefined) {
            return true;
        }
        return false;
    },
    // 设置敌人
    setEnemy(enemy) {
        let distance = cc.pDistance(enemy.position, this.node.position);
        if (distance < this.lookRange) {
            this.enemy = enemy;
        }
    },
    // 获取伤害
    getDamage() {
        return this.currentDamage;
    },
    // 发射子弹
    _shootBullet() {
        global.event.fire("shoot_bullet", this.node, this.enemy.position); // 发送消息，发送至敌人位置
    },
    update(dt) {
        if (this.enemy !== undefined) {
            let direction = cc.pSub(this.node.position, this.enemy.position);
            let angle = cc.pAngleSigned(direction, cc.p(0, -1));
            this.node.rotation = (180 / Math.PI) * angle; // 塔做旋转
            if (this.currentShootTime > this.shootBulletDt) { // 当前射击时间大于射击时间间隔
                this.currentShootTime = 0;
                this._shootBullet();
            } else {
                this.currentShootTime += dt;
            }

            let distance = cc.pDistance(this.enemy.position, this.node.position);
            if (distance > this.currentAttackRange || this.enemy.getComponent("enemy").isLiving() === false) {
                this.enemy = undefined;
            }
        }
    },

});
