<template>
    <div :class="`mx-1 flex-1 wrapper ${hidden ? 'hidden' : ''}`">
        <div :class="`card ${selected ? 'border-primary bg-primary' : ''}`">
            <div class="card-body shadow-sm p-1">
                <ul :class="`list-group ${selected ? 'bg-white' : ''}`">
                    <!-- Type and tier -->
                    <li :class="`list-group-item bg-transparent d-flex justify-content-between align-items-center flex-row ${selected ? 'text-primary' : ''}`">
                        {{typeCapitalized}}
                        <small class="ms-2" v-if="tier > 0">Tier {{tier}}</small>
                    </li>
                    <!-- Image & Attributes -->
                    <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center flex-row">
                        <!-- Image -->
                        <UnitImage :type="type" :tier="tier" />
                        <!-- Attributes -->
                        <div class="p-1 ps-3 border-start d-flex justify-content-center align-items-between flex-column">
                            <small>
                                <b>{{attackTreated}}</b>
                                <font-awesome-icon class="ms-2 text-muted" size="1x" icon="hand-fist" />
                            </small>
                            <small>
                                <b>{{deffenseTreated}}</b>
                                <font-awesome-icon class="ms-2 text-muted" size="1x" icon="shield" />
                            </small>
                        </div>
                    </li>
                    <li class="list-group-item text-start text-muted">
                        {{description}}
                    </li>
                    <!-- Health bar -->
                    <li class="list-group-item p-0 bg-dark border-nonde">
                        <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated text-end pe-2" :style="`width:${healthWidth}%; height:20px;/`">
                            <span class="position-absolute end-0">{{healthTreated}}&nbsp;</span>                        
                        </div>
                    </li>
                    <!-- Upgrade button -->
                    <a
                    :class="`list-group-item list-group-item-action ${selected ? 'border-primary text-primary' : 'list-group-item-primary'}`"
                    v-on:click="handleSelectUnit">
                        <b>{{selected ? 'Remover' : 'Adicionar'}}</b>
                    </a>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import UnitImage from './UnitImage.vue'

export default {
  name: 'HomeUnit',
  components: {
      UnitImage
  },
  props: {
      index:        { type: Number,  default: 0          },
      owned:        { type: Boolean, default: false      },
      hidden:       { type: Boolean, default: false      },
      selected:     { type: Boolean, default: false      },
      
      type:         { type: String, default: '' },
      tier:         { type: String, default: '' },
      description:  { type: String, default: '' },

      healthCurr:   { type: Number, default: 0 },
      healthMax:    { type: Number, default: 0 },
      attack:       { type: Number, default: 0 },
      deffense:     { type: Number, default: 0 },

      price:        { type: Number, default: 0 },
  },
  computed: {
      typeCapitalized() {
          return this.type.charAt(0).toUpperCase() + this.type.slice(1);
      },
      attackTreated() {
          return this.attack > 0 ? Math.round(this.attack*100)/100 : '-';
      },
      deffenseTreated() {
          return this.deffense > 0 ? Math.round(this.deffense*100)/100 : '-';
      },
      healthWidth() {
          return this.healthCurr > 0 ? Math.round(this.healthCurr*100/this.healthMax) : 0;
      },
      healthTreated() {
          return this.healthCurr > 0 ? Math.round(this.healthCurr*100)/100 : '-';
      }
  },
  methods: {
    handleSelectUnit() {
        this.$emit('handleSelectUnit', this.type);
    },
  },
  watch: {
      healthCurr(newVal, oldVal) {
          if(!this.hideImage) {
            if(newVal > oldVal) {
                this.$refs['image'].style.transform = `scale(1.1)`;
            }else {
                this.$refs['image'].style.transform = this.owned ? `translateY(10px)` : `translateY(-10px)`;
            }
            setTimeout(() => {
                this.$refs['image'].style.transform = `translateY(0px) scale(1)`;
            }, 125);
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.progress-bar {
    font-weight: bold;
    font-style: italic;
    text-shadow: 1px 1px 1px black;
}

.wrapper {
    width: 190px;
    min-width: 190px;
}

.wrapper.hidden {
    opacity: 0;
}

.list-group-item-action {
    cursor: pointer;
}

.card.bg-dark .list-group-item {
    color: white !important;
}
</style>
