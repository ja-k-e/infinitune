class ScaleError extends Error {}

/**
 * Scale
 * generate a scale of music
 *
 * @param root String
     the root of the key. flats will be converted to sharps.
       C, C#, D, D#, E, F, F#, G, G#, A, A#, B
 * @param mode String
     desired mode.
       ionian, dorian, phrygian, lydian, mixolydian, aeolian, locrian,
     can also pass in:
       major, minor, melodic, harmonic
 *
 * @return Object
     scale: scale info
     root: the scale root
     mode: the scale mode id
     notes: an array of notes
       step: index of note in key
       note: the actual note
       relOctave: 0 || 1, in root octave or next
       triad: major, minor, diminished, or augmented triad for this note
         interval: I, ii, etc
         type: min, maj, dim, aug
         notes: array of notes in the triad
           note: the note
           relOctave: 0 || 1 || 2, relative to key root octave
 */

export default class Scale {
  constructor(params) {
    this.dict = Scale.dictionary;
    this.updateScale(params);
  }

  get publicValues() {
    return {
      root: this.root,
      mode: this.mode,
      modeKey: this.modeKey,
      notes: this.notes,
      scale: this.scale
    };
  }

  paramValidator({ root, mode }) {
    const e = [];
    const { roots, modes, flatSharp } = this.dict;
    if (!root)
      e.push(new ScaleError(`Must provide a valid root. ${roots.join(", ")}`));
    else if (!roots.includes(root) && !Object.keys(flatSharp).includes(root))
      e.push(new ScaleError(`${root} is an invalid root. ${roots.join(", ")}`));

    if (!modes.includes(mode))
      e.push(new ScaleError(`${mode} is an invalid mode. ${modes.join(", ")}`));

    return e.length ? e : false;
  }

  updateScale(params) {
    this.errors = this.paramValidator(params);
    if (!this.errors) return this._loadScale(params);
    this.errors.forEach(e => {
      throw e;
    });
  }

  _loadScale({ root, mode }) {
    // clean up the root param
    this.root = this._paramRoot(root);
    // set the mode
    this.mode = mode;
    this.modeKey = this._paramMode(this.mode);
    this.notes = [];
    this.scale = this.dict.scales[this.modeKey];

    // notes to cycle through
    const roots = this.dict.roots;
    const rootsCount = roots.length;
    // starting index for root loop
    const offset = roots.indexOf(this.root);
    for (let step = 0; step < this.scale.steps.length; step++) {
      const adjustedStep = this.scale.steps[step] + offset;
      const idx = adjustedStep % rootsCount;
      // relative octave. 0 = same as root, 1 = next octave up
      const relOctave = adjustedStep > rootsCount - 1 ? 1 : 0;
      // triad type
      const type = this.scale.triads[step];
      // generate the relative triads
      const triad = this._genTriad(step, idx, relOctave, type);
      // define the note
      const note = {
        step,
        note: roots[idx],
        relOctave,
        triad
      };
      // add the note
      this.notes.push(note);
    }
  }

  // create a chord of notes based on chord type
  _genTriad(step, offset, octave, type) {
    // get the steps for this chord type
    const steps = this.dict.triads[type];
    const stepsCount = steps.length;
    // get the interval from the type
    const interval = this._intervalFromType(step, type);
    // instantiate the chord
    const chord = { type, interval, notes: [] };
    // load the notes
    const roots = this.dict.roots;
    const rootsCount = roots.length;
    for (let i = 0; i < stepsCount; i++) {
      const adjustedStep = steps[i] + offset;
      const rootIdx = adjustedStep % rootsCount;
      // relative octave to base
      const relOctave = adjustedStep > rootsCount - 1 ? octave + 1 : octave;
      // define the note
      chord.notes.push({ note: roots[rootIdx], relOctave });
    }
    return chord;
  }

  // proper interval notation from the step and type
  _intervalFromType(step, type) {
    const interval = ["i", "ii", "iii", "iv", "v", "vi", "vii"][step];
    const upper = interval.toUpperCase();
    return {
      maj: upper,
      min: interval,
      aug: `${upper}+`,
      dim: `${interval}°`
    }[type];
  }

  _paramMode(mode) {
    return {
      minor: "aeo",
      major: "ion",
      ionian: "ion",
      dorian: "dor",
      phrygian: "phr",
      lydian: "lyd",
      mixolydian: "mix",
      aeolian: "aeo",
      locrian: "loc",
      melodic: "mel",
      harmonic: "har"
    }[mode];
  }

  _paramRoot(root) {
    return this.dict.flatSharp[root] || root;
  }

  static get dictionary() {
    return {
      roots: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
      scales: {
        ion: {
          name: "Ionian",
          steps: Scale.generateSteps([2, 2, 1, 2, 2, 2, 1]),
          dominance: [3, 0, 1, 0, 2, 0, 1],
          triads: Scale.generateTriads(0)
        },
        dor: {
          name: "Dorian",
          steps: Scale.generateSteps([2, 1, 2, 2, 2, 1, 2]),
          dominance: [3, 0, 1, 0, 2, 2, 1],
          triads: Scale.generateTriads(1)
        },
        phr: {
          name: "Phrygian",
          steps: Scale.generateSteps([1, 2, 2, 2, 1, 2, 2]),
          dominance: [3, 2, 1, 0, 2, 0, 1],
          triads: Scale.generateTriads(2)
        },
        lyd: {
          name: "Lydian",
          steps: Scale.generateSteps([2, 2, 2, 1, 2, 2, 1]),
          dominance: [3, 0, 1, 2, 2, 0, 1],
          triads: Scale.generateTriads(3)
        },
        mix: {
          name: "Mixolydian",
          steps: Scale.generateSteps([2, 2, 1, 2, 2, 1, 2]),
          dominance: [3, 0, 1, 0, 2, 0, 2],
          triads: Scale.generateTriads(4)
        },
        aeo: {
          name: "Aeolian",
          steps: Scale.generateSteps([2, 1, 2, 2, 1, 2, 2]),
          dominance: [3, 0, 1, 0, 2, 0, 1],
          triads: Scale.generateTriads(5)
        },
        loc: {
          name: "Locrian",
          steps: Scale.generateSteps([1, 2, 2, 1, 2, 2, 2]),
          dominance: [3, 0, 1, 0, 3, 0, 0],
          triads: Scale.generateTriads(6)
        },
        mel: {
          name: "Melodic Minor",
          steps: Scale.generateSteps([2, 1, 2, 2, 2, 2, 1]),
          dominance: [3, 0, 1, 0, 3, 0, 0],
          triads: ["min", "min", "aug", "maj", "maj", "dim", "dim"]
        },
        har: {
          name: "Harmonic Minor",
          steps: Scale.generateSteps([2, 1, 2, 2, 1, 3, 1]),
          dominance: [3, 0, 1, 0, 3, 0, 0],
          triads: ["min", "dim", "aug", "min", "maj", "maj", "dim"]
        }
      },
      modes: [
        "ionian",
        "dorian",
        "phrygian",
        "lydian",
        "mixolydian",
        "aeolian",
        "locrian"
        // "major",
        // "minor",
        // "melodic",
        // "harmonic"
      ],
      flatSharp: {
        Cb: "B",
        Db: "C#",
        Eb: "D#",
        Fb: "E",
        Gb: "F#",
        Ab: "G#",
        Bb: "A#"
      },
      triads: {
        maj: [0, 4, 7],
        min: [0, 3, 7],
        dim: [0, 3, 6],
        aug: [0, 4, 8]
      }
    };
  }

  static generateTriads(offset) {
    // this is ionian, each mode bumps up one offset.
    let base = ["maj", "min", "min", "maj", "maj", "min", "dim"];
    let triads = [];
    for (let i = 0; i < base.length; i++)
      triads.push(base[(i + offset) % base.length]);
    return triads;
  }

  static generateSteps(arr) {
    const steps = [0];
    let step = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      step += arr[i];
      steps.push(step);
    }
    return steps;
  }
}
