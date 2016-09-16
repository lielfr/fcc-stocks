var stocksChart;
var currHolder;
var socket = io();

Chart.defaults.global.defaultFontColor = 'white';
Chart.defaults.global.legend.display = false;

var updateStocksChart = (stockNames) => {
  if (stocksChart)
    stocksChart.destroy();
  if (currHolder && currHolder.state.stocks !== stockNames)
  if (stockNames.length > 0) {
    $.getJSON('/api/' + stockNames.join(','), (data) => {
      stocksChart = new Chart($('#stocksChart'), data);
      currHolder.setState({
        stocks: stockNames,
        colors: data.data.datasets.map((item) => item.backgroundColor)
      });
    });
  }
};

socket.on('stocksUpdate', updateStocksChart);

var StockBox = React.createClass({
  render: function() {
    var colorBoxStyle = {backgroundColor: this.props.color};
    return (
      <div className="stockBox">
        <span className="colorBox" style={colorBoxStyle}></span>
        <span className="stockText">{this.props.name}</span>
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
    stocks: [],
    colors: []
  }),
  removeItem: function (event) {
    let targetBox = event.target.parentElement;
    let toRemove = targetBox.querySelector('.stockText').innerHTML;
    let targetStocks = this.state.stocks.filter((item) => item !== toRemove);
    targetBox.style.display = 'none';
    socket.emit('stocksUpdate', targetStocks);
  },
  addItem: function(event) {
    event.preventDefault();
    let nameHolder = event.target.querySelector('#newName');
    if (this.state.stocks.indexOf(nameHolder.value) < 0) {
      let targetStocks = this.state.stocks;
      targetStocks.push(nameHolder.value);
      socket.emit('stocksUpdate', targetStocks);
    }
    this.toggleForm();
    nameHolder.value = '';
  },
  toggleForm: function() {
    let stockForm = document.querySelector(".stockAdd-menu");
    let stockFormDisplay = stockForm.style.display;
    let isHidden = stockFormDisplay === '' || stockFormDisplay === 'none';
    stockForm.style.display = isHidden? 'inline-block':'none';
  },
  render: function() {
    var blocks;
    if (this.state.colors.length > 0)
      blocks = this.state.stocks.map((item, index) => <StockBox name={item} removeItem={this.removeItem} color={this.state.colors[index]} />);
    else
      blocks = this.state.stocks.map((item, index) => <StockBox name={item} removeItem={this.removeItem} color="black" />);
    return (
      <div className="boxesHolder">
        {blocks}
        <div className="stockAdd">
          <button id="addButton" className="btn btn-success" aria-label="Add a new stock" aria-haspopup="true" aria-expanded="false" onClick={this.toggleForm}>
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
          <div className="stockAdd-menu" aria-labelledby="addButton">
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
  currHolder = ReactDOM.render(
    <BoxesHolder />,
    document.querySelector('#barHolder')
  );
});
