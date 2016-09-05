var updateStocksChart = (stockNames) => {
  $.getJSON('/api/' + stockNames.join(','), (data) => {
    var stocksChart = new Chart($('#stocksChart'), data);
  });
};

var StockBox = React.createClass({
  render: function() {
    return (
      <div className="stockBox">
        <span>{this.props.name}</span>
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
  removeItem: function (event) {
    let targetBox = event.target.parentElement;
    let toRemove = targetBox.querySelector('span').innerHTML;
    let targetState = this.state;
    targetState.stocks = this.state.stocks.filter((item) => item !== toRemove);
    this.setState(targetState);
  },
  addItem: function(event) {
    event.preventDefault();
    let nameHolder = event.target.querySelector('#newName');
    if (this.state.stocks.indexOf(nameHolder.value) < 0) {
      let targetState = this.state;
      targetState.stocks.push(nameHolder.value);
      nameHolder.value = '';
      this.setState(targetState);
    }
  },
  render: function() {
    var blocks = this.state.stocks.map((item) => <StockBox name={item} removeItem={this.removeItem} />);
    return (
      <div className="boxesHolder">
        {blocks}
        <div className="dropdown">
          <button id="addButton" className="btn btn-success" aria-label="Add a new stock" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
          <div className="dropdown-menu" aria-labelledby="addButton">
            <form id="newStock" className="form-inline" onSubmit={this.addItem}>
              <input className="form-control" type="text" id="newName" />
              <button className="btn btn-success" type="submit">Add</button>
            </form>
          </div>
        </div>
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
