var updateStocksChart = (stockNames) => {
  $.getJSON('/api/' + stockNames.join(','), (data) => {
    var stocksChart = new Chart($('#stocksChart'), data);
  });
};

var StockBox = React.createClass({
  render: function() {
    return (
      <div class="stockBox">
        {this.props.name}
        &nbsp;
        <button className="btn btn-danger" aria-label="Remove this stock" onClick={this.props.removeItem}>
          <i className="fa fa-times" aria-hidden="true"></i>
        </button>
      </div>
    );
  }
});

var BoxesHolder = React.createClass({
  getInitialState: () => ({
    stocks: ['AAPL', 'GOOGL']
  }),
  removeItem: (event) => {
    let targetBox = event.target.parentElement;
    targetBox.parentElement.removeChild(targetBox);
  },
  render: function() {
    var blocks = this.state.stocks.map((item) => <StockBox name={item} removeItem={this.removeItem} />);
    return (
      <div class="boxesHolder">
        {blocks}
      </div>
    );
  }
});

$(document).ready(() => {
  ReactDOM.render(
    <BoxesHolder />,
    document.querySelector('#barHolder')
  );
});
