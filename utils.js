var utils = {};

utils.graphColors = [
  [13, 144, 248],
  [0, 234, 72],
  [254, 145, 54],
  [255, 42, 106],
  [254, 30, 22],
  [0, 230, 69],
  [77, 134, 29]
];

utils.randomChoice = (arr) => {
  return arr[Math.floor(Math.random()*(arr.length - 1))];
};

utils.randomGraphColor = () => {
  let arr = utils.randomChoice(utils.graphColors);
  let retStr = 'rgba(';
  retStr += arr.join(', ');
  retStr += ', 0.8)';
  return retStr;
};

utils.onError = (err) => console.error(err.stack);

module.exports = utils;
