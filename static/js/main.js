'use strict';

var updateStocksChart = function updateStocksChart(stockNames) {
  $.getJSON('/api/' + stockNames.join(','), function (data) {
    var stocksChart = new Chart($('#stocksChart'), data);
  });
};

var StockBox = React.createClass({
  displayName: 'StockBox',

  render: function render() {
    return React.createElement(
      'div',
      { 'class': 'stockBox' },
      this.props.name,
      ' ',
      React.createElement(
        'button',
        { className: 'btn btn-danger', 'aria-label': 'Remove this stock', onClick: this.props.removeItem },
        React.createElement('i', { className: 'fa fa-times', 'aria-hidden': 'true' })
      )
    );
  }
});

var BoxesHolder = React.createClass({
  displayName: 'BoxesHolder',

  getInitialState: function getInitialState() {
    return {
      stocks: ['AAPL', 'GOOGL']
    };
  },
  removeItem: function removeItem(event) {
    var targetBox = event.target.parentElement;
    targetBox.parentElement.removeChild(targetBox);
  },
  render: function render() {
    var _this = this;

    var blocks = this.state.stocks.map(function (item) {
      return React.createElement(StockBox, { name: item, removeItem: _this.removeItem });
    });
    return React.createElement(
      'div',
      { 'class': 'boxesHolder' },
      blocks
    );
  }
});

$(document).ready(function () {
  ReactDOM.render(React.createElement(BoxesHolder, null), document.querySelector('#barHolder'));
});