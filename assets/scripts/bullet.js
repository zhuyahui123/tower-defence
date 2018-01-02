cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad() {
        this.direction = cc.p(0,0); // 发射方向
        this.speed = 600; // 发射速度
    },
    // 初始化
    initWithData(tower, position, enemyNodeList) {
        this.direction = cc.pNormalize(cc.pSub(position, tower.position)); // 初始化子弹发射方向
        this.node.position = cc.pAdd(tower.position, cc.pMult(this.direction, 100));

        let angle = cc.pAngleSigned(this.direction, cc.p(0, 1));
        this.node.rotation = (180 / Math.PI) * angle;
        this.enemyNodeList = enemyNodeList; // 在敌人列表中储存子弹
        this.damage = tower.getComponent("tower").getDamage();
    },

    update(dt) {
        // cc.log("direction " + JSON.stringify(this.direction));
        this.node.position = cc.pAdd(this.node.position , cc.pMult(this.direction , this.speed * dt));

        for (let i = 0 ; i < this.enemyNodeList.length ; i ++){
            let enemy = this.enemyNodeList[i]; // 取出敌人
            if (enemy.getComponent("enemy").isLiving()){
                let distance = cc.pDistance(enemy.position, this.node.position); // 计算敌人与子弹之间的距离
                if (distance < (enemy.width * 0.5  + this.node.width * 0.5)){
                    enemy.getComponent("enemy").beAttacked(this.damage);
                    this.node.destroy();
                }
            }
        }
        // 超出屏幕范围删除子弹
        if (this.node.position.x < - 1920 * 0.5 || this.node.position.x > 1920 * 0.5
        || this.node.position.y > 1080 * 0.5 || this.node.position.y < - 1080 * 0.5){
            this.node.destroy();
            cc.log("删掉子弹");
        }

    },
});
