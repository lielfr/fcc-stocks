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

utils.getArrayAverage = (arr) => {
  if (arr.length === 0)
    return 0;
  var sum = arr.reduce((prevValue, currValue) => prevValue + currValue, 0);
  return sum / arr.length;
}

utils.fillColors = (labels, objArray) => {
  objArray.sort((a, b) => {
    var avgA = utils.getArrayAverage(a.data);
    var avgB = utils.getArrayAverage(b.data);

    if (avgA < avgB)
      return -1;
    else if (avgB > avgA)
      return 1;
    return 0;
  });
  objArray.forEach((item, index, arr) => {
    let chosenColor = 'rgb(';
    let r, g, b;
    if (index < utils.graphColors.length) {
      let currColor = utils.graphColors[index];
      r = currColor[0];
      g = currColor[1];
      b = currColor[2];
    }
    else {

      r = Math.round(255 / (arr.length - index));
      g = Math.round((255 - r) / 2);
      b = Math.floor(Math.random() * 255);

    }
    chosenColor += r + ', ' + g + ', ' + b + ')';
    item.borderColor = chosenColor;
    item.backgroundColor = chosenColor;
  });
};

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
