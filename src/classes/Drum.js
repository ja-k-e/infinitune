import { Sampler, Filter, Gain } from "tone";

export default class Drum {
  constructor(waveform) {
    this.synth = new Sampler(
      {
        E3: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/111863/oh-808.wav",
        D3: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/111863/ch-808.wav",
        C3: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/111863/sd-808.wav",
        C2: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/111863/kd-808.wav"
      },
      () => (this.ready = true)
    );
    this.gain = new Gain(0.8);
    this.gain.toMaster();
    const filter = new Filter(1700, "lowpass");
    filter.connect(this.gain);
    this.synth.connect(filter);
    this.synth.connect(waveform);
  }
}
