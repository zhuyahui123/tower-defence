let Tips = require('Tips');
// 添加敌人状态机
const EnemyState = {
    Invalid: -1,
    Running: 1,
    EndPath: 2,
    Dead: 3
};
cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames: {displayName: "敌人精灵资源", default: [], type: cc.SpriteFrame},
        spriteNode: {displayName: "精灵节点", default: null, type: cc.Sprite},
        healthProgressBar: {displayName: "生命值进度条", default: null, type: cc.ProgressBar},
        baseHealth: {displayName: "基地生命值", default: null, type: cc.Label},
        baseHealthTotalNum: 6,// 基地血值总数
        rescoreEnemyDeadedNum: 0 // 记录敌人死亡人数
    },

    onLoad() {
        this.state = EnemyState.Invalid; //申请一个状态机设置不可用
        this.node.opacity = 0; // 设置节点透明度为0
        this.direction = cc.p(0, 0); // 方向
        this.currentPathPointCount = 0; // 当前走过点的个数
        this.currentHealthCount = 0; // 当前敌人血值
        this.totalHealthCount = 1; // 总血值
    },
    // 初始化
    initWithData(type, pathPoints) {
        //0 - 6
        this.spriteNode.spriteFrame = this.spriteFrames[type];
        this.pathPoints = pathPoints;
        this.node.position = pathPoints[0].position; //设置节点在0的位置
        cc.loader.loadRes("./config/monster_config", (err, result) => {
            if (err) {
                cc.log(err);
            } else {
                cc.log("enemy result = " + JSON.stringify(result));
                let config = result["enemy_" + type];
                this.speed = config.speed;
                this.currentHealthCount = config.health;
                this.totalHealthCount = config.health;
                this._setState(EnemyState.Running);
            }
        });
    },
    // 设置状态
    _setState(state) {
        /*重复设置状态返回null*/
        if (this.state === state) {
            return;
        }
        switch (state) {
            case EnemyState.Running:
                this.node.opacity = 255; //设置节点透明度255
                break;
            case EnemyState.Dead:
                let action = cc.fadeOut(1);
                let sequence = cc.sequence(action, cc.callFunc(() => {
                    cc.log("死了");
                    this.node.destroy();
                }));
                this.node.runAction(sequence);
                break;
            case EnemyState.EndPath:
                break;
            default:
                break;
        }
        this.state = state;
    },
    // 存活
    isLiving() {
        if (this.state === EnemyState.Running) {
            return true;
        }
        return false;
    },
    rescorEnemyDeaded(num) {
        this.beAttacked(num);            
        this.rescoreEnemyDeadedNum++;
        this.rescoreEnemyDeadedNum = num;
        cc.log("敌人已死亡人数：" + this.rescoreEnemyDeadedNum);
    },
    // 攻击
    beAttacked(damage) {
        this.currentHealthCount -= damage;
        if (this.currentHealthCount < 0) {
            this.currentHealthCount = 0;
            this._setState(EnemyState.Dead);
        }
    },
    // 死亡
    isDead() {
        if (this.state === EnemyState.Dead) {
            return true;
        }
        return false;
    },
    // 经过节点个数
    _currentPathPoint(num) {
        this.currentPathPointCount = num;
        // cc.log("currentPathPointCount1---------------------"+this.currentPathPointCount);
        let baseHealthNum = this.baseHealthTotalNum - num;
        this.baseHealth.string = "基地生命值：" + baseHealthNum;
        if (baseHealthNum === 0) {
            Tips.show("游戏结束！");
            cc.director.pause();
        }
    },
    update(dt) {
        if (this.state === EnemyState.Running) {
            let distance = cc.pDistance(this.node.position, this.pathPoints[this.currentPathPointCount].position);
            if (distance < 10) {
                this.currentPathPointCount++;
                let points = this.currentPathPointCount;
                this._currentPathPoint(points);
                // cc.log("currentPathPointCount2---------------------"+this.currentPathPointCount);
                if (this.currentPathPointCount === this.pathPoints.length) {
                    this._setState(EnemyState.EndPath);//走到头状态
                    return
                }
                this.direction = cc.pNormalize(cc.pSub(this.pathPoints[this.currentPathPointCount].position, this.node.position));
            } else {
                this.node.position = cc.pAdd(this.node.position, cc.pMult(this.direction, this.speed * dt));
            }
        }
        this.healthProgressBar.progress = this.currentHealthCount / this.totalHealthCount;
    },
});
