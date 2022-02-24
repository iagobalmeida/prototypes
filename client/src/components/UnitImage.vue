<template>
  <div
    ref="image"
    class="mx-auto"
    :style="`background-image: url(${assets[type]});`"
    :class="`unit tier-${Math.min(tier, maxTier)}`"
  />
</template>

<script>
export default {
  name: "UnitImage",
  props: {
    type: { type: String, default: '' },
    tier: { type: Number, default: 0 }
  },
  data: () => ({
      maxTier: 8
  })
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
