import Length from "./Length.js";

export default class Part {
  constructor({ id, beatOptions, stepOptions, octave, rng }) {
    this.id = id;
    this.beatOptions = beatOptions;
    this.stepOptions = stepOptions;
    this.octave = octave;
    this.rng = rng;
    this.part = [];
  }

  generate(bar) {
    const part = this.generateLengths(bar);
    this.part = this.part.concat(this.generateSteps(part));
  }

  complete(notes, rhythm) {
    const params = this.tonePartParams(notes, rhythm.signature);
    return {
      abc: this.abcNotation(params),
      octave: this.octave,
      part: this.part,
      params
    };
  }

  // static abcHeader({ root, modeKey }, { tempo, signature }) {
  static abcHeader(_, { signature }) {
    const { beats, value } = signature;
    const abc = [];
    abc.push(`X:Performance`);
    // abc.push(`T:Performance`);
    abc.push(`M:${beats}/${value}`);
    abc.push("L:1/16");
    // abc.push(`Q:1/4=${tempo}`);
    // abc.push(`K:${root}${modeKey}`);
    return abc.join("\n");
  }

  abcNotation({ notes }) {
    const abc = [];
    const clef = this.octave < 4 ? "bass" : "treble";
    abc.push(`K:${clef}`);
    let lastBar = 1;
    let string = "|:";
    notes.forEach((note, i) => {
      const pNote = this.part[i];
      const nextPNote = this.part[i + 1];
      const len = pNote.length * 4;
      let notes;
      if (pNote.rest) notes = `z${len}`;
      else {
        let series = note.note
          .map(n => {
            const [letter, octave] = n.replace("#", "").split("");
            let notation;
            if (octave === "2") notation = `${letter.toUpperCase()},,`;
            else if (octave === "3") notation = `${letter.toUpperCase()},`;
            else if (octave === "4") notation = letter.toUpperCase();
            else if (octave === "5") notation = letter.toLowerCase();
            else if (octave === "6") notation = `${letter.toLowerCase()}'`;
            else if (octave === "7") notation = `${letter.toLowerCase()}''`;
            if (n.match("#")) notation = `^${notation}`;
            notation += len;
            return notation;
          })
          .join("");
        notes = `[${series}]`;
      }
      if (pNote.bar !== lastBar) string += "|";
      string += notes;
      let bar =
        nextPNote && nextPNote.length === pNote.length && pNote.length <= 0.75;
      if (!bar && nextPNote && nextPNote.bar === pNote.bar) string += " ";
      lastBar = pNote.bar;
    });
    string += ":|";
    abc.push(string);
    return abc.join("\n");
  }

  tonePartParams(notes, signature) {
    const { beats } = signature;

    const result = { notes: [], loopEnd: null };
    let timeBars = 0;
    let timeBeats = 0;
    let timeSixteens = 0;
    let totalSixteens = 0;

    this.part.forEach((note, index) => {
      const time = [timeBars, timeBeats, timeSixteens].join(":");
      const realNote = notes[note.step];
      const notesArray = [];
      const idxPriority = [0, 2, 1];
      for (let i = 0; i < note.chord; i++) {
        const n = realNote.triad.notes[idxPriority[i]];
        const notation = n.note;
        const octave = n.relOctave + this.octave;
        notesArray.push(`${notation}${octave}`);
      }

      result.notes.push({
        index,
        time,
        length: note.notation,
        note: notesArray,
        velocity: note.rest ? 0 : 1
      });

      const noteSixteens = note.length * 4;
      totalSixteens += noteSixteens;
      timeSixteens = totalSixteens % 4;
      let totalBeats = Math.floor(totalSixteens / 4);
      timeBeats = totalBeats % beats;
      timeBars = Math.floor(totalBeats / beats);
    });
    result.loopEnd = [timeBars, timeBeats, timeSixteens].join(":");
    return result;
  }

  generateLengths(bar) {
    const { beats, weights, options } = this.beatOptions;
    let remaining = beats;
    const res = [];
    const weighted = this.weightedOptions(weights, options);
    while (remaining > 0) {
      const result = this.generateLength(remaining, weighted, bar);
      result.forEach(l => {
        res.push(l);
        remaining -= l.length;
      });
    }
    return res;
  }

  generateLength(remaining, options, bar) {
    let { integer, dotted } = this.rng.choice(options);
    const length = new Length({ integer, bar, dotted });
    if (remaining < length.length)
      return Length.remainingLength(remaining).map(
        ({ integer, dotted }) => new Length({ integer, dotted, bar })
      );
    else return [length];
  }

  generateSteps(part) {
    const { weights, restFreq, noteWeights, options } = this.stepOptions;
    const weighted = this.weightedOptions(weights, options);
    return part.map(step => {
      step.step = this.rng.choice(weighted);
      step.rest = this.rng.rand() < restFreq;
      const weightedNotes = this.weightedOptions(noteWeights, [1, 2, 3]);
      step.chord = this.rng.choice(weightedNotes);
      delete step._integer;
      return step;
    });
  }

  weightedOptions(weights, options) {
    const arr = [];
    for (let i = 0; i < weights.length; i++)
      for (let j = 0; j < weights[i]; j++) arr.push(options[i]);
    return arr;
  }
}
