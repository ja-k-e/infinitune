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
  // https://stackoverflow.com/questions/27323791/round-a-timestamp-to-the-nearest-date
  // Rounding to nearest 5 minutes
  _updateSeed(time) {
    if (time)
      time = Math.min(
        Composer.maxEpoch,
        Math.max(Composer.minEpoch, parseInt(time))
      );

    this.date =
      time !== undefined && typeof time === "number"
        ? new Date(time)
        : new Date();

    this.compositionId = Composer.generateEpoch(this.date);
    let safeId =
      this.compositionId < 0
        ? Math.abs(this.compositionId) + 9999999990000
        : this.compositionId;
    this.rng = new RNG(safeId);
  }

  static get maxEpoch() {
    return 2147483646000;
  }

  static get minEpoch() {
    return Composer.maxEpoch * -1;
  }

  static validEpoch(epoch) {
    const valid = Composer.isValidEpoch(epoch);
    if (valid === true) return parseInt(epoch);
    if (valid === "lo") return Composer.minEpoch;
    if (valid === "hi") return Composer.maxEpoch;
    return new Date().getTime();
  }

  static isValidEpoch(epoch) {
    if (epoch === undefined) return false;
    if (!epoch.toString().match(/^-?\d+$/)) return false;
    const int = parseInt(epoch);
    if (int > Composer.maxEpoch) return "hi";
    if (int < Composer.minEpoch) return "lo";
    return true;
  }

  get funDates() {
    return [
      [-1230923466],
      [0, "The Epoch!"],
      [1234509876],
      [1549935000000],
      [1549951800000],
      [1549952700000],
      [1000212300000, "9/11 First Crash"],
      [582757200000, "ashley bday"],
      [538437600000, "jake bday"],
      [1550011200000, "AMAZING"],
      [959769600000, "eerie"]
    ];
  }

  static randomEpoch() {
    return Math.round(
      Math.random() * (Composer.maxEpoch - Composer.minEpoch) +
        Composer.minEpoch
    );
  }

  static generateEpoch(date) {
    // this.date.setHours(0);
    const minutes = Math.floor(date.getMinutes() / 5) * 5;
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.getTime();
  }
}
