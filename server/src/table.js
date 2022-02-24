const Unit = require('./unit.js');
const defaultUnitTypes = require('./defaultUnitTypes.json');

class Table {
    constructor(userId, userName, types, automaticBuy=false) {
        this.userId         = userId;
        this.userName       = userName;
        this.unitTypes      = types || defaultUnitTypes.unitTypes;
        this.unitPrice      = 20;
        this.unitList       = [];
        this.enemyList      = [];
        this.gold           = 50;
        this.life           = 500;
        this.cycle          = 0;
        this.cycleActions   = [];
        this.automaticBuy   = automaticBuy;
        this.maxTier        = 0;
    }
    surrender() {
        this.life = 0;
        this.gold = 0;
        this.unitList = [];
    }
    associateSocketEvents(socketInstance) {
        const that = this;
        if(this.userId != 'bot'){
            socketInstance.on('CLIENT_MATCH_UNIT_ADD', function() { that.addUnit() });
            socketInstance.on('CLIENT_MATCH_UNIT_UPGRADE', function(data) {
                const { index } = data;
                that.upgradeUnit(parseInt(index));
            });
            socketInstance.on('CLIENT_MATCH_SURRENDER', function() { that.surrender() });
        }
    }
    desassociateSocketEvents(socketInstance) {
        if(this.userId != 'bot'){
            socketInstance.off('CLIENT_MATCH_UNIT_ADD', () => {});
            socketInstance.off('CLIENT_MATCH_UNIT_UPGRADE', () => {});
            socketInstance.off('CLIENT_MATCH_SURRENDER', () => {});
        }
    }
    log() {
        const totalUnitHealth = this.unitList.reduce((acc, curr) => (acc + curr.attributes.health.curr), 0).toFixed(2);
        const totalEnemyHealth = this.enemyList.reduce((acc, curr) => (acc + curr.attributes.health.curr), 0).toFixed(2);
        const totalUnitTier = this.unitList.reduce((acc, curr) => (acc + curr.attributes.tier.curr), 0);
        this.maxTier = Math.max(this.maxTier, totalUnitTier);
        console.log(`${this.userId} / ${this.life} HP / ${this.gold} Gold\t ${this.unitList.length} Unidades (${(totalUnitHealth < 10 ? '0' : '')}${totalUnitHealth} HP total) (${this.maxTier} tier total) / ${this.enemyList.length} Inimigos (${(totalEnemyHealth < 10 ? '0' : '')}${totalEnemyHealth} HP total)`)
    }
    applyDamage(damage) {
        return { damage,  health: this.life = Math.max(0, (this.life - damage).toFixed(2)) };
    }
    addUnit(ignoreMoney = false) {
        if(this.gold >= this.unitPrice || ignoreMoney){
            const type = this.unitTypes[Math.floor(Math.random()*this.unitTypes.length)];
            const newUnit = new Unit(type.name, type.price, type.attributes, type.description, type.targeting);
            this.unitList.push(newUnit);
            this.gold -= this.unitPrice;
            this.unitPrice += Math.floor(this.unitPrice/2);
            this.cycleActions.push({
                type:           'addUnit',
                index:          this.unitList.length,
                targetIndex:    -1,
                data:           {
                    newUnit,
                    gold: this.gold,
                    unitPrice: this.unitPrice
                }
            });
        }
    }
    upgradeUnit(index, ignoreMoney = false) {
        if(this.unitList[index] && (this.gold >= this.unitList[index].price || ignoreMoney)) {
            this.gold -= this.unitList[index].price;
            this.unitList[index].executeUpgrade();
            this.cycleActions.push({
                type:           'upgradeUnit',
                index:          index,
                targetIndex:    -1,
                data:           {
                    newUnit: this.unitList[index],
                    gold: this.gold
                }     
            });
        }else {
            console.log('ERROR trying to upgrade unit!');
        }
    }
    addUnities(number) {
        for(var counter = 0; counter < number; counter += 1) {
            this.addUnit(true);
        }
    }
    addEnemy() {
        const tier = Math.sqrt(this.cycle/50);
        const newEnemy = new Unit('enemy', defaultUnitTypes.enemyTypes[0].price + Math.round(tier), defaultUnitTypes.enemyTypes[0].attributes);
        for(var i = 1; i < tier; i++) {
            newEnemy.executeUpgrade(true);
        }
        this.enemyList.push(newEnemy);
        this.cycleActions.push({
            type:           'addEnemy',
            index:          this.enemyList.length,
            targetIndex:    -1,
            data:           newEnemy
        });
    }
    addEnemies(number) {
        for(var counter = 0; counter < number; counter += 1) {
            this.addEnemy();
        }
    }
    executeCycle() {
        const ret = {
            enemiesKilled: 0,
            unititesKilled: 0
        };
        // Applying UnitList action
        this.unitList.forEach((unit, index) => {
            const targetIndex = unit.executeTargeting(this.enemyList);
            if(targetIndex != -1 && this.enemyList[targetIndex]) {
                const actionList = unit.executeAttack(this.enemyList[targetIndex]);
                if(actionList[actionList.length-1].health <= 0) {
                    this.gold += this.enemyList[targetIndex].price;
                    ret.enemiesKilled += 1;
                    this.enemyList.splice(targetIndex, 1);
                    this.cycleActions.push({
                        type:           'enemyDied',
                        index:          index,
                        targetIndex:    targetIndex,
                        data:           {
                            gold: this.gold
                        }
                    });
                }
                this.cycleActions.push({
                    type:           'unit',
                    index:          index,
                    targetIndex:    targetIndex,
                    data:           actionList
                });
            }
        });
        // Applying EnimyList action
        this.enemyList.forEach((unit, index) => {
            const targetIndex = unit.executeTargeting(this.unitList);
            if(targetIndex != -1 && this.unitList[targetIndex]) {
                const actionList = unit.executeAttack(this.unitList[targetIndex]);
                if(actionList[actionList.length-1].health <= 0) {
                    ret.unititesKilled += 1;
                    this.unitList.splice(targetIndex, 1);
                }
                this.cycleActions.push({
                    type:         'enemy',
                    index:        index,
                    targetIndex:  targetIndex,
                    data:         actionList
                });
            }else {
                const actionList = unit.executeAttack(this);
                this.cycleActions.push({
                    type:         'enemy',
                    index:        index,
                    targetIndex:  'user',
                    data:         actionList
                });
            }

        });
        // If should buy automatically
        if(this.automaticBuy) {
            this.addUnit();
            this.unitList.forEach((unit, index) => {
                if(unit.attributes.health.curr <= unit.attributes.health.max || this.gold > unit.price*10){
                    this.upgradeUnit(index);
                }
            });
        }
        this.cycle += 1;
        return ret;
    }
}

module.exports = Table;