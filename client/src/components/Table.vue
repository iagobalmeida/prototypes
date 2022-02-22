<template>
    <div class="`col-12 ${owned ? 'order-1' : 'order-0'}`">
        <!-- <UnitList :tableIndex="tableIndex" :unitList="enemyList" v-on:handleUpgradeUnit="() => {}"/>
        <UnitList :tableIndex="tableIndex" :unitList="unitList" v-on:handleUpgradeUnit="() => {}"/> -->
        <!-- <h5 class="my-2">Inimigos</h5> -->
        <div class="d-flex justify-content-start align-items-center flex-row mb-3 overflow-auto">
            <Unit
            v-for="(enemy, enemyIndex) in enemyList" 
            :key="`table_${tableIndex}_enemy_${enemyIndex}`" 
            :unitIndex="enemyIndex" 
            :owned="false"
            :attack="enemy.attributes.attack.curr"
            :deffense="enemy.attributes.deffense.curr"
            :healthCurr="enemy.attributes.health.curr"
            :healthMax="enemy.attributes.health.max"
            :price="enemy.price"
            :tierCurr="enemy.attributes.tier.curr"
            :type="enemy.type"
            :addClass="owned ? `border-danger` : `bg-dark border-danger`"
            :description="enemy.description"
            :hideImage="hideUnitImages"
            v-on:handleUpgradeUnit="() => {}"/>
            <Unit
            v-if="enemyList.length == 0"
            :key="`table_${tableIndex}_enemy_empty`" 
            :unitIndex="0" 
            :owned="false"
            :attack="0"
            :deffense="0"
            :healthCurr="0"
            :healthMax="0"
            :price="0"
            :tierCurr="0"
            type=""
            description="Sem descrição"
            :addClass="owned ? `border-danger` : `bg-dark border-danger`"
            :hideImage="hideUnitImages"
            v-on:handleUpgradeUnit="() => {}"/>
        </div>
        <div class="d-flex justify-content-start align-items-center flex-row mb-3 overflow-auto">
            <Unit
            v-for="(unit, unitIndex) in unitList" 
            :key="`table_${tableIndex}_unit_${unitIndex}`" 
            :unitIndex="unitIndex" 
            :owned="owned"
            :attack="unit.attributes.attack.curr"
            :deffense="unit.attributes.deffense.curr"
            :healthCurr="unit.attributes.health.curr"
            :healthMax="unit.attributes.health.max"
            :price="unit.price"
            :tierCurr="unit.attributes.tier.curr"
            :type="unit.type"
            :hideImage="hideUnitImages"
            :addClass="owned ? `` : `bg-dark`"
            :description="unit.description"
            v-on:handleUpgradeUnit="handleUpgradeUnit"/>
            <Unit
            v-if="unitList.length == 0"
            :key="`table_${tableIndex}_unit_empty`" 
            :unitIndex="0" 
            :owned="true"
            :attack="0"
            :deffense="0"
            :healthCurr="0"
            :healthMax="0"
            :price="-1"
            :tierCurr="0"
            type=""
            :addClass="owned ? `bg-light` : `bg-dark`"
            description="Sem descrição"
            :hideImage="hideUnitImages"
            v-on:handleUpgradeUnit="() => {}"/>
        </div>
        <div class="row mb-3" v-if="owned">
          <div class="col-12">
            <div class="card">
                <div class="card-body shadow-sm">
                    <div class=" d-flex justify-content-between align-items-center flex-row">
                        <div>
                            <h3 class="mb-2 text-muted text-start" >{{gold}} <font-awesome-icon class="ms-2" size="1x" icon="coins" /></h3>
                            <button class="btn btn-success w-100 mb-3" v-on:click="handleUnitAddClick">Comprar Unidade {{unitPrice}} <font-awesome-icon class="ms-2" size="1x" icon="coins" /></button>
                        </div>
                        <div class="ms-3">
                            <h2 class="mb-0 text-dark text-end" >{{userName || 'Sem nome'}}</h2>
                            <h3 class="mb-0 text-dark text-end" >{{life}}<small class="text-muted">/500 HP</small></h3>
                        </div>
                    </div>
                    <div class="progress">
                        <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" :style="`width:${Math.round(100*life/500)}%;`"></div>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import Unit from './Unit.vue'
// import UnitList from './UnitList.vue'

export default {
  name: 'Table',
  components: {
    Unit,
    // UnitList
  },
  data: () => ({
  }),
  props: {
    owned:      Boolean,
    tableIndex: Number,
    enemyList:  Array,
    unitList:   Array,
    gold:       Number,
    life:       Number,
    userName:   String,
    unitPrice:  Number,
    hideUnitImages: { type: Boolean, default: false }
  },
  methods: {
    handleUnitAddClick() {
        this.$emit('handleUnitAddClick');
    },
    handleUpgradeUnit(index) {
        this.$emit('handleUpgradeUnit', index)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
