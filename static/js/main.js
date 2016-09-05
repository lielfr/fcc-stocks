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
      stocks: ['AAPL', 'GOOGL']
    };
  },
  removeItem: function removeItem(event) {
    var targetBox = event.target.parentElement;
    var toRemove = targetBox.querySelector('span').innerHTML;
    var targetState = this.state;
    targetState.stocks = this.state.stocks.filter(function (item) {
      return item !== toRemove;
    });
    this.setState(targetState);
  },
  addItem: function addItem(event) {
    event.preventDefault();
    var nameHolder = event.target.querySelector('#newName');
    if (this.state.stocks.indexOf(nameHolder.value) < 0) {
      var targetState = this.state;
      targetState.stocks.push(nameHolder.value);
      nameHolder.value = '';
      this.setState(targetState);
    }
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
        { className: 'dropdown' },
        React.createElement(
          'button',
          { id: 'addButton', className: 'btn btn-success', 'aria-label': 'Add a new stock', 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'false' },
          React.createElement('i', { className: 'fa fa-plus', 'aria-hidden': 'true' })
        ),
        React.createElement(
          'div',
          { className: 'dropdown-menu', 'aria-labelledby': 'addButton' },
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
  ReactDOM.render(React.createElement(BoxesHolder, null), document.querySelector('#barHolder'));
});