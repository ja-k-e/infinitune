<template>
  <div class="wrapper">
    <div v-if="!customForm">
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
        <button :class="{ small: mobile }" class="solid" @click="travel(newTime)" :disabled="!newTime || newTime === compositionId">Now</button>
        <button :class="{ small: mobile }" @click="travel()">Random</button>
        <button :class="{ small: mobile }" class="solid" @click="customForm = true">Custom</button>
      </div>
    </div>

    <div class="datetime-form" v-else>
      <select class="text" :class="{ small: mobile, large: !mobile }" v-model="rawMonth">
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <masked-input class="text" :class="{ small: mobile, large: !mobile }" size="2" v-model="rawDay" :mask="monthMask" placeholder="dd" />
      <input class="text" :class="{ small: mobile, large: !mobile }" size="6" v-model="rawYear" placeholder="YYYY" type="number" min="0" max="275760" />
      <select class="text" :class="{ small: mobile, large: !mobile }" v-model="rawAdbc">
        <option value="A.D.">A.D.</option>
        <option value="B.C.">B.C.</option>
      </select>
      <masked-input class="text" :class="{ small: mobile, large: !mobile }" size="8" v-model="rawTime" :mask="timeMask" :placeholder="timePlaceholder" />
      <button :class="{ small: mobile }" class="solid" :disabled="!validDate || !dirtyDate" @click="travelRaw">Load</button>
      <button :class="{ small: mobile }" @click="customForm = false">Cancel</button>
    </div>

    <div class="button-row">
      <button @click="togglePlay" :class="{ small: mobile, animate: !playing, solid: !playing }" class="block">
        <span v-if="playing">Pause</span>
        <span v-else>Play</span>
      </button>
    </div>
  </div>
</template>

<script>
import DateFormatter from "@/classes/DateFormatter.js";
import MaskedInput from "vue-masked-input";

export default {
  props: {
    compositionId: Number,
    date: Object,
    playing: Boolean,
    togglePlay: Function,
    travel: Function
  },
  data() {
    const inputStrings = this.date.asInputStrings;
    return {
      customForm: false,
      mobile: true,
      monthMask: {
        pattern: "X1",
        formatCharacters: {
          X: { validate: c => /[0123]/.test(c) }
        }
      },
      newTime: null,
      rawAdbc: inputStrings.adbc,
      rawDay: inputStrings.day,
      rawMonth: inputStrings.month,
      rawTime: inputStrings.time,
      rawYear: inputStrings.year,
      timeMask: {
        pattern: "X1:G1 YZ",
        formatCharacters: {
          G: {
            validate: c => /[012345]/.test(c)
          },
          X: {
            validate: c => /[01]/.test(c)
          },
          Y: {
            validate: c => /[apAP]/.test(c),
            transform: c => c.toLowerCase()
          },
          Z: {
            validate: c => /[mM]/.test(c),
            transform: c => c.toLowerCase()
          }
        }
      },
      timePlaceholder: "hh:mm am"
    };
  },
  computed: {
    customDateTime() {
      return DateFormatter.createValidDateTime(this.rawAsInputStrings());
    },
    dirtyDate() {
      return this.customDateTime !== this.compositionId;
    },
    validDate() {
      return this.customDateTime !== null;
    }
  },
  watch: {
    date(val) {
      const inputStrings = val.asInputStrings;
      this.rawAdbc = inputStrings.adbc;
      this.rawDay = inputStrings.day;
      this.rawMonth = inputStrings.month;
      this.rawTime = inputStrings.time;
      this.rawYear = inputStrings.year;
    }
  },
  methods: {
    rawAsInputStrings() {
      return {
        adbc: this.rawAdbc,
        day: this.rawDay,
        month: this.rawMonth,
        time: this.rawTime,
        year: this.rawYear
      };
    },
    travelRaw() {
      if (!this.validDate) return;
      this.travel(this.customDateTime);
      this.customForm = false;
    },
    _checkTime() {
      const epoch = DateFormatter.validEpoch(new Date().getTime());
      if (epoch === this.compositionId || epoch === this.newTime) return;
      this.newTime = epoch;
    },
    _onResize() {
      this.mobile = window.innerWidth < 700;
    }
  },
  components: { MaskedInput },
  beforeDestroy() {
    if (this.interval) clearInterval(this.interval);
    if (this.listenerResize)
      window.removeEventListener("resize", this.listenerResize);
  },
  mounted() {
    this._onResize();
    this.listenerResize = this._onResize.bind(this);
    window.addEventListener("resize", this.listenerResize);
    this.interval = setInterval(this._checkTime.bind(this), 5000);
    this._checkTime();
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
    > button + .datetime-form {
      margin-left: 0.5rem;
    }
    > button,
    .datetime-form {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
  }
}
</style>


