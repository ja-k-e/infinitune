<template>
  <main :style="styles">
    <div class="container">
      <TimeTravel
        :date="date"
        :composition-id="compositionId"
        :playing="playing"
        :toggle-play="togglePlay"
        :travel="travel" />
    </div>

    <div class="container" v-if="composition">
      <ABC
        class="abc"
        v-if="abc"
        :abc="abc"
        :abc-width="abcWidth"
        :color="colorLight"
        :current-note-bass="currentNoteBass"
        :current-note-melody="currentNoteMelody"
        :playing="playing" />
      <h2>
        {{ composition.rhythm.tempo }} <small>BPM</small>
        &bull;
        {{ composition.scale.root.replace('#', '♯') }} <small>{{ composition.scale.scale.name.toUpperCase() }}</small>
      </h2>
      <div class="counter-wrapper" v-if="playing">
        <span class="counter" :class="{ number: typeof beat === 'number' }">
          <span v-if="beat" v-text="beat"></span>
          <span v-else>&nbsp;</span>
        </span>
      </div>
      <Animation class="animation" :color="colorLight" :waveforms="waveforms" />
    </div>
    <div class="footer">
      <a href="https://twitter.com/jake_albaugh" target="blank">@jake_albaugh</a>
      &bull;
      <a href="https://github.com/jakealbaugh/infinitune" target="blank">GitHub</a>
      <br>
      Having issues? Try desktop Chrome or Firefox
    </div>
  </main>
</template>

<script>
import { Waveform } from "tone";

import Composer from "@/classes/Composer.js";
import DateFormatter from "@/classes/DateFormatter.js";
import Part from "@/classes/Part.js";
import Performer from "@/classes/Performer.js";

import ABC from "./ABC.vue";
import Animation from "./Animation.vue";
import TimeTravel from "./TimeTravel.vue";

export default {
  name: "Controller",
  props: {},
  data() {
    const fftSize = 1024 * 0.25;
    const waveformBass = new Waveform(fftSize);
    const waveformDrum = new Waveform(fftSize);
    const waveformMelody = new Waveform(fftSize);
    return {
      abc: null,
      abcWidth: null,
      beat: 0,
      color: "black",
      colorLight: "#222",
      composition: null,
      compositionId: null,
      composer: new Composer(),
      currentNoteBass: null,
      currentNoteMelody: null,
      performer: new Performer(
        this.callbackNote.bind(this),
        this.callbackBeat.bind(this),
        waveformMelody,
        waveformBass,
        waveformDrum
      ),
      playing: false,
      waveforms: [waveformMelody, waveformDrum, waveformBass]
    };
  },
  computed: {
    date() {
      return new DateFormatter(this.compositionId);
    },
    styles() {
      return {
        "--color": this.color,
        "--color-light": this.colorLight
      };
    }
  },
  methods: {
    callbackBeat(beat) {
      const type = typeof beat;
      const formatted = type === "number" ? beat : { and: "•", uh: "◦" }[beat];
      this.beat = formatted;
      if (type === "number") this.updateFavicon();
      else if (beat === "and") this.updateFavicon(false);
    },
    callbackNote(key, { index }) {
      if (key === "bass") this.currentNoteBass = index;
      else this.currentNoteMelody = index;
    },
    generateComposition(time) {
      this.composer.generate(time);
      this.updateColor();
      this.compositionId = this.composer.compositionId;
      this.$router.push({ path: `/${this.compositionId}` });
      if (this.composition)
        Object.keys(this.composer.composition).forEach(
          k => (this.composition[k] = this.composer.composition[k])
        );
      else this.composition = this.composer.composition;
      this.performer.update({ composition: this.composition });
      this.updateAbc();
    },
    setCompositionId(epoch) {
      this.compositionId = Composer.validEpoch(epoch);
      this.generateComposition(this.compositionId);
    },
    start() {
      this.playing = true;
      this.performer.start();
    },
    stop() {
      this.playing = false;
      this.updateFavicon(false);
      this.currentNoteBass = null;
      this.currentNoteMelody = null;
      this.performer.stop();
    },
    togglePlay() {
      if (!this.playing) this.start();
      else this.stop();
    },
    travel(epoch) {
      if (epoch === undefined) epoch = Composer.randomEpoch();
      this.setCompositionId(epoch);
    },
    updateAbc() {
      const abcHeader = Part.abcHeader(
        this.composer.composition.scale,
        this.composer.composition.rhythm
      );
      const abcMelody = this.composer.composition.melody.abc;
      const abcBass = this.composer.composition.bass.abc;
      this.abcWidth =
        this.composer.composition.rhythm.bars *
        this.composer.composition.rhythm.signature.beats *
        40;
      this.abc = [abcHeader, "V:1", abcMelody, "V:2", abcBass].join("\n");
    },
    updateColor() {
      const { hue } = this.composer;
      const range = Math.round(hue / 360 * 12) % 12;
      // Roughly based on:
      // http://www.workwithcolor.com/color-luminance-2233.htm
      const lit = [45, 40, 30, 35, 35, 35, 38, 45, 50, 50, 40, 40][range];
      this.color = `hsl(${hue}, 100%, ${lit}%)`;
      this.colorLight = `hsl(${hue}, 100%, 80%)`;
    },
    updateFavicon(full = true) {
      const size = full ? 0.8 : 0.4;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const di = (canvas.width = canvas.height = 128);
      const rad = Math.round(di * 0.5);
      ctx.clearRect(0, 0, di, di);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(rad, rad, size * rad, 0, Math.PI * 2);
      ctx.fill();

      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = canvas.toDataURL("image/x-icon");
      document.getElementsByTagName("head")[0].appendChild(link);
    },
    _keydown(e) {
      if (e.keyCode !== 32) return;
      e.preventDefault();
      this.togglePlay();
    }
  },
  beforeDestroy() {
    if (this.performer) this.performer.stop();
    window.removeEventListener("keydown", this._keydown);
  },
  watch: {
    "$route.params.epoch"(epoch) {
      this.setCompositionId(epoch);
      if (this.playing) this.start();
    }
  },
  components: { ABC, Animation, TimeTravel },
  created() {
    this.updateFavicon(false);
    this.setCompositionId(this.$route.params.epoch);
    window.addEventListener("keydown", this._keydown.bind(this));
  }
};
</script>

<style lang="scss" scoped>
main {
  background: var(--color);
  transition: background 250ms ease-in-out;
  height: 100%;
  box-sizing: border-box;
  padding-top: 1rem;
  @media (min-width: 700px) {
    padding-top: 5rem;
  }
  @media (min-width: 1024px) {
    padding-top: 7rem;
  }
}
.abc {
  margin-bottom: -1rem;
  @media (min-width: 1024px) {
    margin-bottom: -2rem;
  }
}
.animations {
  display: flex;
  > .animation {
    display: block;
  }
}
.footer {
  font-size: 0.7rem;
  text-align: center;
  line-height: 1.4;
}
</style>
