import DateFormatter from "./DateFormatter.js";
import Length from "./Length.js";
import Part from "./Part.js";
import Rhythm from "./Rhythm.js";
import RNG from "./RNG.js";
import Scale from "./Scale.js";

export default class Composer {
  constructor() {
    this.composition = {};
  }

  generate(time) {
    this._updateSeed(time);
    this.rhythm = new Rhythm(this._generateRhythmParams());
    this.scale = new Scale(this._generateScaleParams());
    this.composition.rhythm = this.rhythm.publicValues;
    this.composition.scale = this.scale.publicValues;

    const maxLength = Length.maxLength(this.rhythm.signature.beats);
    const lengths = Length.lengths.slice(0, maxLength);

    const melodyLengthWeights = lengths.map(() =>
      Math.ceil(this.rng.rand() * 8)
    );
    const melodyOctave = Math.floor(this.rng.rand() * 2 + 4);
    this.composition.melody = this._generatePart({
      id: `melody`,
      options: lengths,
      weights: melodyLengthWeights,
      restFreq: 0.2,
      noteWeights: [5, 3, 1],
      octave: melodyOctave
    });
    const bassLengthWeights = lengths.map(() => Math.ceil(this.rng.rand() * 8));
    const bassOctave = Math.floor(this.rng.rand() * 2 + 2);
    this.composition.bass = this._generatePart({
      id: `bass`,
      options: lengths,
      weights: bassLengthWeights,
      restFreq: 0.1,
      noteWeights: [5, 1],
      octave: bassOctave
    });

    this.hue = Math.round(this.rng.rand() * 360);
  }

  _generateScaleParams() {
    const dictionary = Scale.dictionary;
    const root = this.rng.choice(dictionary.roots);
    const mode = this.rng.choice(dictionary.modes);
    return { root, mode };
  }

  _generateRhythmParams() {
    const dictionary = Rhythm.dictionary;
    const signature = this.rng.choice(dictionary.signatureOptions);
    const bars = this.rng.choice(dictionary.barsOptions);
    const tempo = this.rng.choice(dictionary.tempoOptions);
    return { signature, bars, tempo };
  }

  _generatePart({ id, options, weights, restFreq, noteWeights, octave }) {
    const { signature, bars } = this.composition.rhythm;
    const { beats } = signature;
    const beatOptions = {
      beats,
      options,
      weights
    };
    const stepOptions = {
      noteWeights,
      options: [0, 1, 2, 3, 4, 5, 6],
      restFreq,
      weights: this.scale.scale.dominance
    };
    const part = new Part({
      id,
      octave,
      rng: this.rng,
      beatOptions,
      stepOptions
    });

    for (let i = 0; i < bars; i++) part.generate(i + 1);
    return part.complete(this.scale.notes, this.composition.rhythm);
  }

  // Updating the seed
  _updateSeed(epoch) {
    epoch = DateFormatter.validEpoch(epoch);
    this.compositionId = epoch;
    let safeId = epoch ? Math.round(Math.abs(this.compositionId) / 1000) : 0;
    this.rng = new RNG(safeId);
  }
}
