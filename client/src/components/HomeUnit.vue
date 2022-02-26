<template>
    <div :class="`mx-1 flex-1 wrapper ${hidden ? 'hidden' : ''}`">
        <div :class="`card ${owned ? (selected ? 'border-primary bg-primary selected' : '') : 'bg-light'}`">
            <div class="card-body shadow-sm p-1">
                <ul :class="`list-group ${selected ? 'bg-white' : ''}`">
                    <!-- Type and tier -->
                    <li :class="`list-group-item bg-transparent d-flex justify-content-between align-items-center flex-row ${owned ? (selected ? 'text-primary' : '') : ' text-muted'}`">
                        <font-awesome-icon class="ms-1" size="1x" icon="lock" v-if="!owned"/>
                        {{typeCapitalized}}
                        <small class="ms-2 text-muted" v-if="tier > 0">
                            <b>{{price}}</b>
                            <font-awesome-icon class="ms-1" size="1x" icon="coins"/>
                        </small>
                    </li>
                    <!-- Image & Attributes -->
                    <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center flex-row">
                        <!-- Image -->
                        <UnitImage :type="type" :tier="tier" />
                        <!-- Attributes -->
                        <div class="p-1 ps-3 border-start d-flex justify-content-center align-items-between flex-column">
                            <small>
                                <b>{{attackTreated}} <small class="text-muted" v-if="attackProgress != 0">(+{{attackEvolution}})</small></b>
                                <font-awesome-icon class="ms-2 text-muted" size="1x" icon="hand-fist" />
                            </small>
                            <small>
                                <b>{{deffenseTreated}} <small class="text-muted" v-if="deffenseProgress != 0">(+{{deffenseEvolution}})</small></b>
                                <font-awesome-icon class="ms-2 text-muted" size="1x" icon="shield" />
                            </small>
                        </div>
                    </li>
                    <li class="list-group-item bg-transparent text-start text-muted">
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
                    v-if="owned"
                    :class="`list-group-item list-group-item-action ${selected ? 'border-primary text-primary' : 'list-group-item-primary'}`"
                    v-on:click="handleSelectUnit">
                        <b>{{selected ? 'Remover' : 'Adicionar'}}</b>
                    </a>
                    <a
                    v-else
                    :class="`list-group-item list-group-item-action list-group-item-success text-success`"
                    v-on:click="handleUnlockUnit">
                        {{unlockPrice}}
                        <font-awesome-icon class="me-1" size="1x" icon="coins"/>
                        <b>Comprar</b>
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
      tier:         { type: Number, default: 1  },
      description:  { type: String, default: '' },

      healthCurr:       { type: Number, default: 0 },
      healthMax:        { type: Number, default: 0 },
      attack:           { type: Number, default: 0 },
      attackProgress:   { type: Number, default: 0 },
      deffense:         { type: Number, default: 0 },
      deffenseProgress: { type: Number, default: 0 },

      price:            { type: Number, default: 0 },
      unlockPrice:      { type: Number, default: 0 },
  },
  computed: {
      typeCapitalized() {
          return this.type.charAt(0).toUpperCase() + this.type.slice(1);
      },
      attackTreated() {
          return this.attack > 0 ? Math.round(this.attack*100)/100 : '-';
      },
      attackEvolution() {
          return this.attackProgress > 0 ? Math.round(this.attackProgress*100)/100 : '-';
      },
      deffenseTreated() {
          return this.deffense > 0 ? Math.round(this.deffense*100)/100 : '-';
      },
      deffenseEvolution() {
          return this.deffenseProgress > 0 ? Math.round(this.deffenseProgress*100)/100 : '-';
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
    handleUnlockUnit() {
        this.$emit('handleUnlockUnit', this.type);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
    transition: transform 125ms ease-in-out;
}

.card.selected {
    transform: translateY(-10px);
}

.progress-bar {
    font-weight: bold;
    font-style: italic;
    text-shadow: 1px 1px 1px black;
}

.wrapper {
    width: 200px;
    min-width: 200px;
}

.wrapper.hidden {
    opacity: 0;
}

.list-group-item-action {
    cursor: pointer;
}
</style>
