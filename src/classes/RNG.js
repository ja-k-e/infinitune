// https://stackoverflow.com/a/424445
export default class RNG {
  constructor(seed) {
    // LCG using GCC's constants
    this.m = 0x80000000; // 2**31;
    this.a = 1103515245;
    this.c = 12345;

    this.state =
      seed !== undefined ? seed : Math.floor(Math.random() * (this.m - 1));
  }
  int() {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }
  // returns in range [0,1]
  rand() {
    return this.int() / (this.m - 1);
  }
  // returns in range [start, end): including start, excluding end
  // can't modulu int because of weak randomness in lower bits
  range(start, end) {
    let rangeSize = end - start;
    let randomUnder1 = this.int() / this.m;
    return start + Math.floor(randomUnder1 * rangeSize);
  }
  choice(array) {
    return array[this.range(0, array.length)];
  }
}
