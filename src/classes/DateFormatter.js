export default class DateFormatter {
  constructor(epoch) {
    this.date = new Date(parseInt(epoch));
    const [month, day, year] = this.date.toLocaleDateString().split("/");
    this.month = month;
    this.day = day;
    this.year = year;
    const [time, ampm] = this.date.toLocaleTimeString().split(" ");
    const [hour, minutes, seconds] = time.split(":");
    this.ampm = ampm.toLowerCase();
    this.hour = hour;
    this.minutes = minutes;
    this.seconds = seconds;
  }

  nextDate({ minutes = 0, hours = 0, days = 0, weeks = 0, years = 0 }) {
    let adjustment = 0;
    adjustment += years * 365 * 24 * 60 * 60 * 1000;
    adjustment += weeks * 7 * 24 * 60 * 60 * 1000;
    adjustment += days * 24 * 60 * 60 * 1000;
    adjustment += hours * 60 * 60 * 1000;
    adjustment += minutes * 60 * 1000;
    return new DateFormatter(this.epoch + adjustment);
  }

  get epoch() {
    return this.date.getTime();
  }

  get fullDate() {
    return `${this.monthName} ${this.day}, ${this.year}`;
  }

  get fullTime() {
    return `${this.hour}:${this.minutes} ${this.ampm}`;
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
}
