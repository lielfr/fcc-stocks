'use strict';

var stocksChart;
var currHolder;
var socket = io();

Chart.defaults.global.defaultFontColor = 'white';

var updateStocksChart = function updateStocksChart(stockNames) {
  if (stocksChart) stocksChart.destroy();
  if (currHolder && currHolder.state.stocks !== stockNames) currHolder.setState({ stocks: stockNames });
  if (stockNames.length > 0) {
    $.getJSON('/api/' + stockNames.join(','), function (data) {
      stocksChart = new Chart($('#stocksChart'), data);
    });
  }
};

socket.on('stocksUpdate', updateStocksChart);

var StockBox = React.createClass({
  displayName: 'StockBox',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'stockBox' },
      React.createElement(
        'span',
        null,
        this.props.name
      ),
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
      stocks: []
    };
  },
  removeItem: function removeItem(event) {
    var targetBox = event.target.parentElement;
    var toRemove = targetBox.querySelector('span').innerHTML;
    var targetStocks = this.state.stocks.filter(function (item) {
      return item !== toRemove;
    });
    socket.emit('stocksUpdate', targetStocks);
  },
  addItem: function addItem(event) {
    event.preventDefault();
    var nameHolder = event.target.querySelector('#newName');
    if (this.state.stocks.indexOf(nameHolder.value) < 0) {
      var targetStocks = this.state.stocks;
      targetStocks.push(nameHolder.value);
      socket.emit('stocksUpdate', targetStocks);
    }
    this.toggleForm();
    nameHolder.value = '';
  },
  toggleForm: function toggleForm() {
    var stockForm = document.querySelector(".stockAdd-menu");
    var stockFormDisplay = stockForm.style.display;
    var isHidden = stockFormDisplay === '' || stockFormDisplay === 'none';
    stockForm.style.display = isHidden ? 'inline-block' : 'none';
  },
  render: function render() {
    var _this = this;

    var blocks = this.state.stocks.map(function (item) {
      return React.createElement(StockBox, { name: item, removeItem: _this.removeItem });
    });
    return React.createElement(
      'div',
      { className: 'boxesHolder' },
      blocks,
      React.createElement(
        'div',
        { className: 'stockAdd' },
        React.createElement(
          'button',
          { id: 'addButton', className: 'btn btn-success', 'aria-label': 'Add a new stock', 'aria-haspopup': 'true', 'aria-expanded': 'false', onClick: this.toggleForm },
          React.createElement('i', { className: 'fa fa-plus', 'aria-hidden': 'true' })
        ),
        React.createElement(
          'div',
          { className: 'stockAdd-menu', 'aria-labelledby': 'addButton' },
          React.createElement(
            'form',
            { id: 'newStock', className: 'form-inline', onSubmit: this.addItem },
            React.createElement('input', { className: 'form-control', type: 'text', id: 'newName' }),
            React.createElement(
              'button',
              { className: 'btn btn-success', type: 'submit' },
              'Add'
            )
          )
        )
      )
    );
  }
});

$(document).ready(function () {
  currHolder = ReactDOM.render(React.createElement(BoxesHolder, null), document.querySelector('#barHolder'));
});