
$(document).ready(() => {
  $.getJSON('/api/AAPL,GOOGL', (data) => {
    var stocksChart = new Chart($('#stocksChart'), data);
  });
});
