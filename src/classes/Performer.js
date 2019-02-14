import { Draw, Transport, Part } from "tone";
import Drum from "./Drum.js";
import Synth from "./Synth.js";

export default class Performer {
  constructor(
    noteCallback,
    beatCallback,
    waveformMelody,
    waveformBass,
    waveformDrum
  ) {
    this.synths = {
      melody: new Synth("melody", waveformMelody),
      bass: new Synth("bass", waveformBass)
    };
    this.noteCallback = noteCallback;
    this.beatCallback = beatCallback;
    this.drum = new Drum(waveformDrum);
    this.parts = {};
  }

  randomize(rng) {
    for (let key in this.synths) this.synths[key].randomize(rng);
  }

  start() {
    Transport.start();
    Object.values(this.parts).forEach(part => part.start(0));
  }

  stop() {
    Transport.stop();
    Object.values(this.parts).forEach(part => part.stop());
    Object.values(this.synths).forEach(synth => synth.release());
  }

  update({ composition }) {
    if (!composition) return;
    this.composition = composition;
    const { tempo, signature } = composition.rhythm;
    const { beats, value } = signature;
    Transport.bpm.value = tempo;
    Transport.timeSignature = [beats, value];
    this.stop();
    this.setupPart("melody");
    this.setupPart("bass");
    this.setupDrumPart();
  }

  setupDrumPart() {
    const notes = [
      { time: "0:0:0", note: "C2", length: "8n", beat: 1 },
      { time: "0:0:2", note: "E3", length: "8n", beat: "and" },
      { time: "0:1:0", note: "C3", length: "8n", beat: 2 },
      { time: "0:1:2", note: "E3", length: "8n", beat: "and" },
      { time: "0:2:0", note: "C2", length: "8n", beat: 3 },
      { time: "0:2:2", note: "E3", length: "8n", beat: "and" },
      { time: "0:2:3", note: "E3", length: "8n", beat: "uh" },
      { time: "0:3:0", note: "C3", length: "8n", beat: 4 },
      { time: "0:3:2", note: "E3", length: "8n", beat: "and" },
      { time: "0:4:0", note: "C2", length: "8n", beat: 5 },
      { time: "0:4:2", note: "E3", length: "8n", beat: "and" },
      { time: "0:5:0", note: "C3", length: "8n", beat: 6 },
      { time: "0:5:2", note: "E3", length: "8n", beat: "and" },
      { time: "0:5:3", note: "E3", length: "8n", beat: "uh" },
      { time: "0:6:0", note: "C2", length: "8n", beat: 7 },
      { time: "0:6:2", note: "E3", length: "8n", beat: "and" },
      { time: "0:7:0", note: "C3", length: "8n", beat: 8 },
      { time: "0:7:2", note: "E3", length: "8n", beat: "and" }
    ];
    this.parts.drum = new Part((time, val) => {
      if (this.beatCallback && val.beat) this.beatCallback(val.beat);
      // Draw.schedule(() => this.beatCallback(val.beat));
      if (!this.drum.ready) return;
      this.drum.synth.triggerAttackRelease(val.note, val.length, time);
    }, notes);
    this.parts.drum.loop = Infinity;
    this.parts.drum.loopEnd = "1:0:0";
  }

  setupPart(type) {
    const { notes, loopEnd } = this.composition[type].params;
    this.parts[type] = new Part((time, val) => {
      Draw.schedule(() => {
        if (this.noteCallback) this.noteCallback(type, val);
      });
      this.synths[type].attack(val.note, val.length, time, val.velocity);
    }, notes);
    this.parts[type].loop = Infinity;
    this.parts[type].loopEnd = loopEnd;
  }
}
