<template>
  <div ref="abc"></div>
</template>

<script>
import abcjs from "abcjs";
export default {
  props: {
    abc: String,
    abcWidth: Number,
    color: String,
    currentNoteBass: [String, Number],
    currentNoteMelody: [String, Number],
    playing: Boolean
  },
  data() {
    return {
      colorActive: "#FFF",
      notes: {
        bass: [],
        melody: []
      }
    };
  },
  watch: {
    abc(val) {
      if (val) this.render();
    },
    currentNoteBass(val) {
      this.updateNote("bass", val);
    },
    currentNoteMelody(val) {
      this.updateNote("melody", val);
    },
    playing(val) {
      if (!val) this.resetElems();
    }
  },
  methods: {
    render() {
      const ref = this.$refs.abc;

      abcjs.renderAbc(ref, this.abc, {
        add_classes: true,
        staffwidth: this.abcWidth
      });

      ref.style.height = "auto";

      const svg = ref.querySelector("svg");
      svg.setAttribute(
        "viewBox",
        `0 0 ${svg.getAttribute("width")} ${svg.getAttribute("height")}`
      );
      // svg.style.width = "auto";
      // svg.style.maxWidth = "100%";
      svg.style.width = "100%";
      svg.style.maxHeight = "300px";
      svg.style.height = "auto";
      svg
        .querySelectorAll('[fill="#000000"]')
        .forEach(a => (a.style.fill = this.color));

      const width = svg.getAttribute("width");
      const height = svg.getAttribute("height");

      const newMelody = Array.from(
        svg.querySelectorAll(`.abcjs-note.abcjs-v0, .abcjs-rest.abcjs-v0`)
      ).map(e => this.originedElem(e, width, height));
      this.notes.melody.splice(0, this.notes.melody.length, ...newMelody);

      const newBass = Array.from(
        svg.querySelectorAll(`.abcjs-note.abcjs-v1, .abcjs-rest.abcjs-v1`)
      ).map(e => this.originedElem(e, width, height));
      this.notes.bass.splice(0, this.notes.bass.length, ...newBass);
    },
    originedElem(elem, width, height) {
      const bbox = elem.getBBox();
      const x = (bbox.x + bbox.width * 0.5) / width * 100;
      const y = (bbox.y + bbox.height * 0.5) / height * 100;
      const origin = `${x}% ${y}%`;
      elem.style.webkitTransformOrigin = origin;
      elem.style.transformOrigin = origin;
      const transition = "fill 200ms ease-in-out, transform 200ms ease-in-out";
      elem.style.webkitTransition = transition;
      elem.style.transition = transition;
      return elem;
    },
    resetElems() {
      this.$refs.abc
        .querySelectorAll('svg [style*="scale(1.1)"]')
        .forEach(this.resetElem.bind(this));
    },
    resetElem(elem) {
      elem.style.fill = this.color;
      elem.style.webkitTransform = "scale(1)";
      elem.style.transform = "scale(1)";
    },
    styleElem(elem) {
      elem.style.fill = this.colorActive;
      elem.style.webkitTransform = `scale(1.1)`;
      elem.style.transform = `scale(1.1)`;
    },
    updateNote(key, index) {
      if (!this.playing) return;
      const prevIndex = index ? index - 1 : this.notes[key].length - 1;
      if (this.notes[key][prevIndex])
        this.resetElem(this.notes[key][prevIndex]);
      if (this.notes[key][index]) this.styleElem(this.notes[key][index]);
    }
  },
  mounted() {
    this.render();
  }
};
</script>

<style lang="scss" scoped>
div {
  display: block;
  text-align: center;
}
</style>


