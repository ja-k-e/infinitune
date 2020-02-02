import Tone from "tone";

// TODO
// TODO
// Add Sample instruments.
// https://github.com/nbrosowsky/tonejs-instruments
// TODO
// TODO

export default class Synth {
  constructor(type, waveform) {
    const { Panner, Gain } = Tone;
    const voices = type === "bass" ? 2 : 3;
    const pan = type === "bass" ? 0.25 : -0.25;
    this.type = type;
    this.voices = voices;
    this.pan = new Panner(pan);
    this.gain = new Gain(type === "bass" ? 0.3 : 0.1);
    this.gain.toMaster();
    this.pan.connect(this.gain);
    this.initializeSynth(waveform);
  }

  attack(note, length, time, velocity) {
    if (velocity !== 0) {
      this.synth.triggerAttackRelease(note, length, time, velocity);
    }
  }

  release(time) {
    if (this.voices === 1) this.synth.triggerRelease(time);
    else this.synth.releaseAll(time);
  }

  initializeSynth(waveform) {
    this.synth = new Tone.PolySynth(this.voices, Tone.Synth);
    this.synth.set({
      oscillator: { type: "sawtooth4" },
      envelope: { attack: 0.01 }
    });
    this.synth.connect(this.pan);
    this.synth.connect(waveform);
  }

  get settingsSynth() {
    return [
      {
        portamento: 0,
        oscillator: { type: "fatsine4", spread: 60, count: 10 },
        envelope: {
          attack: 0.4,
          decay: 0.01,
          sustain: 1,
          attackCurve: "sine",
          releaseCurve: "sine",
          release: 0.4
        }
      },
      {
        portamento: 0,
        oscillator: { type: "square4" },
        envelope: { attack: 2, decay: 1, sustain: 0.2, release: 2 }
      },
      {
        portamento: 0,
        oscillator: { type: "pulse", width: 0.8 },
        envelope: {
          attack: 0.01,
          decay: 0.05,
          sustain: 0.2,
          releaseCurve: "bounce",
          release: 0.4
        }
      },
      {
        portamento: 0.2,
        oscillator: { type: "amsquare", harmonicity: 0.5 },
        envelope: { attack: 0.03, decay: 0.1, sustain: 0.2, release: 0.02 }
      },
      // {
      //   portamento: 0.2,
      //   oscillator: { type: "sawtooth" },
      //   envelope: { attack: 0.03, decay: 0.1, sustain: 0.2, release: 0.02 }
      // },
      {
        portamento: 0.2,
        oscillator: { partials: [1, 0, 2, 0, 3] },
        envelope: { attack: 0.001, decay: 1.2, sustain: 0, release: 1.2 }
      },
      {
        portamento: 0.2,
        oscillator: {
          type: "fatcustom",
          partials: [0.2, 1, 0, 0.5, 0.1],
          spread: 40,
          count: 3
        },
        envelope: { attack: 0.001, decay: 1.6, sustain: 0, release: 1.6 }
      },
      {
        portamento: 0,
        oscillator: { type: "fatsawtooth", count: 3, spread: 30 },
        envelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.5,
          release: 0.4,
          attackCurve: "exponential"
        }
      },
      {
        portamento: 0,
        oscillator: { type: "triangle" },
        envelope: { attack: 0.1 }
      },
      {
        portamento: 0,
        oscillator: { type: "triangle8" },
        envelope: { attack: 0.1 }
      }
    ];
  }

  get settingsAMSynth() {
    return [
      {
        harmonicity: 3.51,
        detune: 0,
        oscillator: {
          type: "sawtooth",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 0,
          volume: 0,
          mute: false
        },
        envelope: {
          attack: 0.01682843137254902,
          decay: 0.2,
          sustain: 0.3,
          release: 0.3,
          attackCurve: "linear",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        modulation: {
          type: "sine",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 0,
          volume: 0,
          mute: false
        },
        modulationEnvelope: {
          attack: 0.6661147058823529,
          decay: 1.1665411764705882,
          sustain: 1,
          release: 2.151691176470588,
          attackCurve: "linear",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        portamento: 0
      },
      {
        harmonicity: 2.88,
        detune: 0,
        oscillator: {
          frequency: 440,
          detune: 0,
          phase: 0,
          width: 0,
          volume: 0,
          mute: false,
          type: "pulse"
        },
        envelope: {
          attack: 0.20958529411764706,
          decay: 1.9219607843137254,
          sustain: 0.08,
          release: 1.5132911764705883,
          attackCurve: "exponential",
          decayCurve: "linear",
          releaseCurve: "exponential"
        },
        modulation: {
          type: "square",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 0,
          volume: 0,
          mute: false
        },
        modulationEnvelope: {
          attack: 0.01682843137254902,
          decay: 1.1665411764705882,
          sustain: 1,
          release: 2.151691176470588,
          attackCurve: "linear",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        portamento: 0
      },
      {
        harmonicity: 2.355,
        detune: 0,
        oscillator: {
          type: "sawtooth",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 0,
          volume: 0,
          mute: false
        },
        envelope: {
          attack: 0.19729411764705884,
          decay: 1.1072313725490197,
          sustain: 0.3,
          release: 2.8358588235294118,
          attackCurve: "linear",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        modulation: {
          type: "triangle",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 0,
          volume: 0,
          mute: false
        },
        modulationEnvelope: {
          attack: 0.09584313725490196,
          decay: 1.1665411764705882,
          sustain: 1,
          release: 2.151691176470588,
          attackCurve: "linear",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        portamento: 0
      }
    ];
  }

  get settingsFMSynth() {
    return [
      {
        harmonicity: 1,
        modulationIndex: 20.848,
        portamento: 0.024,
        oscillator: {
          type: "sawtooth9",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 9
        },
        envelope: {
          attack: 0.012926470588235294,
          decay: 0.05975,
          sustain: 0.16,
          release: 0.18211764705882355,
          attackCurve: "exponential",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        modulation: {
          type: "custom",
          frequency: 440,
          detune: 0,
          phase: 0,
          partials: [
            0.8105694691387023,
            0,
            0.0900632743487447,
            0,
            0.03242277876554809,
            0,
            0.016542234064055146,
            0,
            0.010007030483193857,
            0,
            0.00669892123255126,
            0,
            0.004796269048158,
            0,
            0.6,
            0,
            0.0028047386475387615,
            0.4727272727272728,
            0.002245344789857901,
            0,
            0.0018380260071172384,
            0,
            0.0015322674274833694,
            0,
            0.0012969111506219236,
            0.8727272727272728,
            0.0011118922759104286,
            0,
            0.0009638162534348421,
            0,
            0.0008434645880735718,
            0
          ],
          partialCount: 32
        },
        modulationEnvelope: {
          attack: 0.012926470588235294,
          decay: 0.08784411764705882,
          sustain: 0,
          release: 0.08627941176470588,
          attackCurve: "exponential",
          decayCurve: "exponential",
          releaseCurve: "cosine"
        }
      },
      {
        harmonicity: 1.515,
        modulationIndex: 6.483999999999999,
        detune: 0,
        oscillator: {
          type: "sawtooth3",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 3,
          volume: 0,
          mute: false
        },
        envelope: {
          attack: 0.010585294117647059,
          decay: 0.27689411764705885,
          sustain: 0,
          release: 0.7328941176470589,
          attackCurve: "linear",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        modulation: {
          type: "square",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 0,
          volume: 0,
          mute: false
        },
        modulationEnvelope: {
          attack: 0.01,
          decay: 0.05975,
          sustain: 0,
          release: 0.13635,
          attackCurve: "exponential",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        portamento: 0
      },
      {
        harmonicity: 1.655,
        modulationIndex: 40,
        detune: 0,
        oscillator: {
          type: "square",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 0,
          volume: 0,
          mute: false
        },
        envelope: {
          attack: 0.09584313725490196,
          decay: 0.13174117647058822,
          sustain: 0.25,
          release: 0.5,
          attackCurve: "exponential",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        modulation: {
          type: "triangle",
          frequency: 440,
          detune: 0,
          phase: 0,
          partialCount: 0,
          volume: 0,
          mute: false
        },
        modulationEnvelope: {
          attack: 0.0427764705882353,
          decay: 0.8596519607843138,
          sustain: 0.08,
          release: 3.392894117647059,
          attackCurve: "linear",
          decayCurve: "exponential",
          releaseCurve: "exponential"
        },
        portamento: 0.15899999999999997
      }
    ];
  }
}
