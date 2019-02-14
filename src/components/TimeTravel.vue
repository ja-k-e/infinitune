<template>
  <div class="wrapper">
    <h1>
      {{ date.fullDateTime }}
      <router-link :to="`/${compositionId}`">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 482.8 482.8" style="enable-background:new 0 0 482.8 482.8;" xml:space="preserve">
          <path d="M255.2,209.3c-5.3,5.3-5.3,13.8,0,19.1c21.9,21.9,21.9,57.5,0,79.4l-115,115c-21.9,21.9-57.5,21.9-79.4,0l-17.3-17.3    c-21.9-21.9-21.9-57.5,0-79.4l115-115c5.3-5.3,5.3-13.8,0-19.1s-13.8-5.3-19.1,0l-115,115C8.7,322.7,0,343.6,0,365.8    c0,22.2,8.6,43.1,24.4,58.8l17.3,17.3c16.2,16.2,37.5,24.3,58.8,24.3s42.6-8.1,58.8-24.3l115-115c32.4-32.4,32.4-85.2,0-117.6    C269.1,204,260.5,204,255.2,209.3z"/>
          <path d="M458.5,58.2l-17.3-17.3c-32.4-32.4-85.2-32.4-117.6,0l-115,115c-32.4,32.4-32.4,85.2,0,117.6c5.3,5.3,13.8,5.3,19.1,0    s5.3-13.8,0-19.1c-21.9-21.9-21.9-57.5,0-79.4l115-115c21.9-21.9,57.5-21.9,79.4,0l17.3,17.3c21.9,21.9,21.9,57.5,0,79.4l-115,115    c-5.3,5.3-5.3,13.8,0,19.1c2.6,2.6,6.1,4,9.5,4s6.9-1.3,9.5-4l115-115c15.7-15.7,24.4-36.6,24.4-58.8    C482.8,94.8,474.2,73.9,458.5,58.2z"/>
        </svg>
      </router-link>
    </h1>

    <div class="button-row">
      <button @click="travel(newTime)" class="solid" :disabled="!newTime || newTime === compositionId">Now</button>
      <button @click="travel()">Random</button>

      <div class="button-list">
        <button
          class="addon solid"
          :disabled="compositionId === -2147483400000"
          @click="travel(date.nextDate({ [modifierType]: -1 * modifierAmount }).epoch)"
        >-</button>
        <button
          class="option"
          :class="{ solid: modifierType === type && modifierAmount === amount }"
          v-for="[amount, type] in modifierOptions"
          :key="type + amount"
          @click="modifierType = type; modifierAmount = amount"
        >{{ amount }}{{ type.charAt(0) }}</button>
        <button
          class="addon solid"
          :disabled="compositionId === 2147483400000"
          @click="travel(date.nextDate({ [modifierType]: modifierAmount }).epoch)"
        >+</button>
      </div>
    </div>

    <div class="button-row">
      <button @click="togglePlay" :class="{ animate: !playing, solid: !playing }" class="block">
        <span v-if="playing">Pause</span>
        <span v-else>Play</span>
      </button>
    </div>
  </div>
</template>

<script>
import Composer from "@/classes/Composer.js";

export default {
  props: {
    compositionId: Number,
    date: Object,
    playing: Boolean,
    togglePlay: Function,
    travel: Function
  },
  data() {
    return {
      newTime: null,
      modifierType: "minutes",
      modifierAmount: 5,
      modifierOptions: [
        [5, "minutes"],
        [1, "hours"],
        [1, "days"],
        [1, "weeks"],
        [1, "years"]
      ]
    };
  },
  methods: {
    _checkTime() {
      const epoch = Composer.generateEpoch(new Date());
      if (epoch === this.compositionId || epoch === this.newTime) return;
      this.newTime = epoch;
    }
  },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
  },
  mounted() {
    this.interval = this._checkTime.bind(this);
    setInterval(this.interval, 5000);
    this.interval();
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  text-align: center;
  h1 {
    margin-bottom: 0.5rem;
  }
  .button-row + .button-row {
    margin-top: 1rem;
  }
  button.block {
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
  .button-row {
    > button + button,
    > button + .button-list {
      margin-left: 0.5rem;
    }
    > button,
    .button-list {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }
}
</style>


