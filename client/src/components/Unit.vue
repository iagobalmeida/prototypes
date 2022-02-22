<template>
    <div :style="`width:190px;opacity:${type?'1':'0'};`" class="mx-1 flex-1">
        <div :class="`card ${addClass || 'bg-light'}`">
            <div class="card-body shadow-sm p-1">
            <ul class="list-group bg-transparent">
                <li class="list-group-item bg-transparent">
                    <p class="mb-0 d-flex justify-content-between align-items-center flex-row">
                        {{type ? type.toUpperCase() : '-'}}
                        <small class="ms-2" v-if="tierCurr > 0">Tier {{tierCurr}}</small>
                    </p>
                    
                </li>
                <li class="list-group-item bg-light d-flex justify-content-between align-items-center flex-row" v-if="!hideImage">
                    <div ref="image" class="mx-auto" :style="`background-image: url(${assets[type]}); ${tierCurr > 8 ? `filter: hue-rotate(${tierCurr}5deg);` : ''}`" :class="`unit tier-${Math.min(tierCurr, 8)}`" />
                    <div class="p-1 ps-3 border-start d-flex justify-content-center align-items-between flex-column">
                        <small v-if="attack">
                            <b>{{(Math.round(attack*100)/100).toFixed(2)}}&nbsp;</b>
                            <small class="text-muted">
                                <font-awesome-icon class="ms-2" size="1x" icon="hand-fist" />
                            </small>
                        </small>
                        <small v-else>-</small>
                        <small v-if="deffense">
                            <b>{{(Math.round(deffense*100)/100).toFixed(2)}}&nbsp;</b>
                            <small class="text-muted">
                                <font-awesome-icon class="ms-2" size="1x" icon="shield" />
                            </small>
                        </small>
                        <small v-else>-</small>
                    </div>
                </li>
                <li class="list-group-item text-start text-muted" v-if="showDescription">
                    {{description}}
                </li>
                <li class="list-group-item p-0 bg-dark border-nonde">
                    <div class="progress-bar bg-danger progress-bar-striped progress-bar-animated text-end pe-2" :style="`width:${healthCurr > 0 ? Math.floor(100*healthCurr/healthMax) : 0}%; height:20px;/`">
                        <span class="position-absolute end-0">{{Math.round(healthCurr*100)/100}}&nbsp;</span>                        
                    </div>
                </li>
                <a v-if="owned" :class="`list-group-item list-group-item-action list-group-item-${price || !owned == -1 ? 'secondary': 'success'} `" v-on:click="handleUpgradeUnit(unitIndex)">
                    <b>{{price && owned > 0 ? price : '-'}}</b>&nbsp;
                    <font-awesome-icon class="ms-2" size="1x" icon="coins"/>&nbsp;
                    <i v-if="price && owned > 0">Upgrade</i>
                </a>
            </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Unit',
  props: {
        owned: Boolean,
        unitIndex: Number,
        type: String,
        tierCurr: Number,
        healthCurr: Number,
        healthMax: Number,
        attack: Number,
        deffense: Number,
        price: Number,
        description: String,
        addClass: { type: String, default: '' },
        hideImage: { type: Boolean, default: false },
        showDescription: { type: Boolean, default: false }
  },
  methods: {
    handleUpgradeUnit(index) {
        this.$emit('handleUpgradeUnit', index);
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

.list-group-item-action {
    cursor: pointer;
}

.card.bg-dark .list-group-item {
    color: white !important;
}

.unit {
    background-size: 576px 384px;
    background-position: 0px 0px;
    width: 48px;
    height: 48px;
    transition: all 125ms ease-in-out;
}

.tier-1 {
    animation: tier-1 500ms steps(1, end) infinite;
}

.tier-2 {
    animation: tier-2 500ms steps(1, end) infinite;
}

.tier-3 {
    animation: tier-3 500ms steps(1, end) infinite;
}

.tier-4 {
    animation: tier-4 500ms steps(1, end) infinite;
}

.tier-5 {
    animation: tier-5 500ms steps(1, end) infinite;
}

.tier-6 {
    animation: tier-6 500ms steps(1, end) infinite;
}

.tier-7 {
    animation: tier-7 500ms steps(1, end) infinite;
}

.tier-8 {
    animation: tier-8 500ms steps(1, end) infinite;
}

@keyframes tier-1 {
    0% {
        background-position: 0px 0px;
    }
    25% {
        background-position: -48px 0px;
    }
    50% {
        background-position: -96px 0px;
    }
    75% {
        background-position: -48px 0px;
    }
    100% {        
        background-position: 0px 0px;
    }
}

@keyframes tier-2 {
    0% {
        background-position: calc(0px - 144px) 0px;
    }
    25% {
        background-position: calc(-48px - 144px) 0px;
    }
    50% {
        background-position: calc(-96px - 144px) 0px;
    }
    75% {
        background-position: calc(-48px - 144px) 0px;
    }
    100% {        
        background-position: calc(0px - 144px) 0px;
    }
}

@keyframes tier-3 {
    0% {
        background-position: calc(0px - 288px) 0px;
    }
    25% {
        background-position: calc(-48px - 288px) 0px;
    }
    50% {
        background-position: calc(-96px - 288px) 0px;
    }
    75% {
        background-position: calc(-48px - 288px) 0px;
    }
    100% {        
        background-position: calc(0px - 288px) 0px;
    }
}

@keyframes tier-4 {
    0% {
        background-position: calc(0px - 432px) 0px;
    }
    25% {
        background-position: calc(-48px - 432px) 0px;
    }
    50% {
        background-position: calc(-96px - 432px) 0px;
    }
    75% {
        background-position: calc(-48px - 432px) 0px;
    }
    100% {        
        background-position: calc(0px - 432px) 0px;
    }
}

@keyframes tier-5 {
    0% {
        background-position: 0px -192px;
    }
    25% {
        background-position: -48px -192px;
    }
    50% {
        background-position: -96px -192px;
    }
    75% {
        background-position: -48px -192px;
    }
    100% {        
        background-position: 0px -192px;
    }
}

@keyframes tier-6 {
    0% {
        background-position: calc(0px - 144px) -192px;
    }
    25% {
        background-position: calc(-48px - 144px) -192px;
    }
    50% {
        background-position: calc(-96px - 144px) -192px;
    }
    75% {
        background-position: calc(-48px - 144px) -192px;
    }
    100% {        
        background-position: calc(0px - 144px) -192px;
    }
}

@keyframes tier-7 {
    0% {
        background-position: calc(0px - 288px) -192px;
    }
    25% {
        background-position: calc(-48px - 288px) -192px;
    }
    50% {
        background-position: calc(-96px - 288px) -192px;
    }
    75% {
        background-position: calc(-48px - 288px) -192px;
    }
    100% {        
        background-position: calc(0px - 288px) -192px;
    }
}

@keyframes tier-8 {
    0% {
        background-position: calc(0px - 432px) -192px;
    }
    25% {
        background-position: calc(-48px - 432px) -192px;
    }
    50% {
        background-position: calc(-96px - 432px) -192px;
    }
    75% {
        background-position: calc(-48px - 432px) -192px;
    }
    100% {        
        background-position: calc(0px - 432px) -192px;
    }
}
</style>
