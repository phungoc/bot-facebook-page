const common = {
  randomArrayIndex: (min, max) => {
    return min + Math.trunc(Math.random() * (max - min));
  },

  randomIntFromInterval: (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  numberWithCommas: (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  filterSpaceTabNewLine: (text) => {
    return text
      .trim()
      .replace(/\t/g, '') // remove tab
      .replace(/\r?\n|\r/g, ' ') // remove new line
      .replace(/  +/g, ' '); // remove multiple spaces to single space
  },

  isEmpty: (obj) => {
    return Object.keys(obj).length === 0;
  },

  capitalize: (string) => {
    return string[0].toUpperCase() + string.slice(1);
  },
};

export default common;
