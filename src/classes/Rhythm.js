class RhythmError extends Error {}

class Signature {
  constructor(notation) {
    const [beats, value] = notation.split("/").map(a => parseInt(a));
    this.notation = notation;
    this.beats = beats;
    this.value = value;
  }

  static get signatures() {
    return ["3/4", "4/4", "5/4", "7/4"];
  }
}

export default class Rhythm {
  constructor(params) {
    this.dict = Rhythm.dictionary;
    this.updateRhythm(params);
  }

  get publicValues() {
    return {
      bars: this.bars,
      signature: this.signature,
      tempo: this.tempo
    };
  }

  paramValidator({ signature, bars, tempo }) {
    const e = [];
    const { signatureOptions, barsOptions, tempoOptions } = this.dict;
    if (!signature || !signatureOptions.includes(signature))
      e.push(
        new RhythmError(
          `${signature} is an invalid signature. ${signatureOptions.join(",")}`
        )
      );
    if (!bars || !barsOptions.includes(bars))
      e.push(
        new RhythmError(
          `${bars} is an invalid bars value. ${barsOptions.join(",")}`
        )
      );
    if (!tempo || !tempoOptions.includes(tempo))
      e.push(
        new RhythmError(
          `${tempo} is an invalid tempo value. ${tempoOptions.join(",")}`
        )
      );
    return e.length ? e : false;
  }

  updateRhythm(params) {
    this.errors = this.paramValidator(params);
    if (!this.errors) return this._loadRhythm(params);
    this.errors.forEach(e => {
      throw e;
    });
  }

  _loadRhythm({ signature, bars, tempo }) {
    this.signature = new Signature(signature);
    this.bars = bars;
    this.tempo = tempo;
  }

  static get dictionary() {
    return {
      barsOptions: Rhythm.generateRange(2, 6),
      signatureOptions: Signature.signatures,
      tempoOptions: Rhythm.generateRange(70, 140)
    };
  }

  static generateRange(min, max) {
    const range = [];
    for (let i = min; i <= max; i++) range.push(i);
    return range;
  }
}
