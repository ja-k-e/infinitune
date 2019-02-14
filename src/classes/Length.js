export default class Length {
  constructor({ integer, bar, dotted = false }) {
    this.bar = bar;
    this.dotted = dotted;
    this.integer = integer;
  }

  get integer() {
    return this._integer;
  }

  set integer(integer) {
    this._integer = integer;
    this.notation = `${integer}n`;
    this.length = 1 / (integer / 4);
    if (!this.dotted) return;
    this.notation += ".";
    this.length += 1 / ((integer * 2) / 4);
  }

  static get lengths() {
    return Object.values(Length.lengthMap);
  }

  static maxLength(beats) {
    if (beats === 3) return 5;
    return 6;
    // if (beats === 3) return 7;
    // return 8;
    // if (beats < 6) return 8;
    // return 9;
  }

  static get notations() {
    return ["8n", "4n", "4n.", "2n", "2n.", "1n", "1n."];
    // return ["16n", "8n", "8n.", "4n", "4n.", "2n", "2n.", "1n", "1n."];
  }

  static get lengthMap() {
    return {
      // "0.25": { integer: 16, dotted: false },
      "0.5": { integer: 8, dotted: false },
      // "0.75": { integer: 8, dotted: true },
      "1": { integer: 4, dotted: false },
      "1.5": { integer: 4, dotted: true },
      "2": { integer: 2, dotted: false },
      "3": { integer: 2, dotted: true },
      "4": { integer: 1, dotted: false },
      "6": { integer: 1, dotted: true }
    };
  }

  static remainingLength(float) {
    const vals = Length.lengthMap;
    const floored = Math.floor(float);
    const remaining = float - floored;

    const item1 = vals[floored.toString()];
    const item2 = vals[remaining.toString()];

    const res = [];
    if (item1) res.push(item1);
    if (item2) res.push(item2);
    return res;
  }
}
