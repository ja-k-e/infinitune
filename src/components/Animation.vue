<template>
  <div>
    <canvas v-if="waveforms.length" ref="canvas" :height="height" :width="width"></canvas>
  </div>
</template>

<script>
export default {
  props: { waveforms: Array, color: String },
  data() {
    return {
      height: 400,
      width: 2400,
      ctx: null
    };
  },
  methods: {
    update() {
      if (!this.ctx) this.ctx = this.$refs.canvas.getContext("2d");
      this.ctx.clearRect(0, 0, this.width, this.height);
      const count = this.waveforms.length;
      const formWidth = this.width / count;
      let x = 0;
      this.ctx.strokeStyle = "white" || this.color;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.waveforms.forEach((waveform, i) => {
        const value = waveform.getValue();
        const length = value.length;
        const middle = this.height * 0.5;
        const w = formWidth / length;
        for (let j = 0; j < length; j++) {
          const val = value[j];
          const mtd = i === 0 && j === 0 ? "moveTo" : "lineTo";
          this.ctx[mtd](x, middle + middle * val);
          x += w;
        }
      });
      this.ctx.stroke();
      this.animFrame = requestAnimationFrame(this.update.bind(this));
    }
  },
  beforeDestroy() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  },
  mounted() {
    this.update();
  }
};
</script>

<style lang="scss" scoped>
canvas {
  width: 100%;
  height: auto;
  display: block;
  image-rendering: pixelated;
}
</style>


