export default class DateFormatter {
  constructor(epoch) {
    this.date = new Date(parseInt(epoch));
    const [month, day, year] = [this.date.getMonth() + 1, this.date.getDate(), this.date.getFullYear()]
    this.month = month;
    this.day = day;
    this.formattedYear = year;
    this.year = year;
    this.adbc = epoch < 0 ? "B.C." : "A.D.";
    // delimit if high number.
    if (year.toString().length > 4)
      this.formattedYear = year.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    this.formattedYear += ` ${this.adbc}`;
    const [time, ampm] = this.date.toLocaleTimeString().split(" ");
    const [hours, minutes, seconds] = time.split(":");
    this.ampm = ampm.toLowerCase();
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  get asInputStrings() {
    const padDay = this.day.toString().padStart(2, "0");
    const padHours = this.hours.toString().padStart(2, "0");
    const padMinutes = this.minutes.toString().padStart(2, "0");
    return {
      adbc: this.adbc,
      day: padDay,
      month: this.month.toString(),
      time: `${padHours}:${padMinutes} ${this.ampm}`,
      year: this.year
    };
  }

  get epoch() {
    return this.date.getTime();
  }

  get fullDate() {
    return `${this.monthName} ${this.day}, ${this.formattedYear}`;
  }

  get fullTime() {
    return `${this.hours}:${this.minutes} ${this.ampm}`;
  }

  get fullDateTime() {
    return `${this.fullDate} @ ${this.fullTime}`;
  }

  get monthName() {
    return [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ][parseInt(this.month) - 1];
  }

  // rounded to five minutes
  static get maxEpoch() {
    return 8640000000000000;
  }

  // rounded to five minutes
  static get minEpoch() {
    return -8639999999964000;
  }

  static createValidDateTime({ adbc, day, month, time, year }) {
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);
    const [hoursMinutes, ampm] = time.split(" ");
    let [hours, minutes] = hoursMinutes.split(":");
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    if (adbc === "B.C.") year *= -1;
    if (hours === 12 && ampm === "am") hours = 0;
    else if (ampm === "pm" && hours < 12) hours += 12;
    month = month - 1;
    const epoch = new Date(year, month, day, hours, minutes).getTime();
    return Number.isNaN(epoch) ? null : DateFormatter._roundedEpoch(epoch);
  }

  static validEpoch(epoch) {
    const valid = DateFormatter.isValidEpoch(epoch);
    if (valid === true) return DateFormatter._roundedEpoch(parseInt(epoch));
    if (valid === "lo") return DateFormatter.minEpoch;
    if (valid === "hi") return DateFormatter.maxEpoch;
    return DateFormatter._roundedEpoch(new Date().getTime());
  }

  static isValidEpoch(epoch) {
    if (epoch === undefined) return false;
    if (!epoch.toString().match(/^-?\d+$/)) return false;
    const int = parseInt(epoch);
    if (int > DateFormatter.maxEpoch) return "hi";
    if (int < DateFormatter.minEpoch) return "lo";
    return true;
  }

  static randomEpoch() {
    const { maxEpoch, minEpoch } = DateFormatter;
    return Math.round(Math.random() * (maxEpoch - minEpoch) + minEpoch);
  }

  // https://stackoverflow.com/questions/27323791/round-a-timestamp-to-the-nearest-date
  // Rounding to nearest 5 minutes
  static _roundedEpoch(epoch) {
    const date = new Date(epoch);
    const minutes = Math.floor(date.getMinutes() / 5) * 5;
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date.getTime();
  }

  get _funDates() {
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
}
