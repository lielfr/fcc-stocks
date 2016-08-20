'use strict';

$(document).ready(function () {
  $.getJSON('/api/AAPL,GOOGL', function (data) {
    var stocksChart = new Chart($('#stocksChart'), data);
  });
});