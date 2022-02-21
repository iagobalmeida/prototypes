<template>
    <div class="d-flex justify-content-center align-items-center flex-row" v-if="unitList && unitList.length > 0">
        <Unit
        v-for="(unit, unitIndex) in unitList" 
        :key="`table_${tableIndex}_unit_${unitIndex}`" 
        :unitIndex="unitIndex" 
        :owned="false"
        :attack="unit.attributes.attack.curr"
        :deffense="unit.attributes.deffense.curr"
        :healthCurr="unit.attributes.health.curr"
        :healthMax="unit.attributes.health.max"
        :price="unit.price"
        :tierCurr="unit.attributes.tier.curr"
        :type="unit.type"
        v-on:handleUpgradeUnit="handleUpgradeUnit"
        />
    </div>
    <div class="d-flex justify-content-center align-items-center flex-row" v-else>
        <Unit
        :key="`table_${tableIndex}_unit_empty`" 
        unitIndex="0" 
        :owned="false"
        attack="0"
        deffense="0"
        healthCurr="0"
        healthMax="0"
        price="0"
        tierCurr="0"
        type=""
        v-on:handleUpgradeUnit="() => {}"/>

    </div>
</template>

<script>
import Unit from './Unit.vue';

export default {
  name: 'Unit',
  components: {
      Unit
  },
  props: {
    tableIndex: Number,
    unitList: Array
  },
  methods: {
    handleUpgradeUnit(index) {
        this.$emit('handleUpgradeUnit', index);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.unit {
    background-size: 576px 384px;
    background-position: 0px 0px;
    width: 48px;
    height: 48px;
}
</style>
