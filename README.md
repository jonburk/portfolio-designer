# Portfolio Designer
The portfolio designer uses the [IEX API](https://iextrading.com) to calculate covariance between stocks in a portfolio to calculate standard deviation and the [Sharpe Ratio](https://www.investopedia.com/terms/s/sharperatio.asp) for various combinations of stock weights.

Call the portfolio designer by passing in a list of symbols via the `--symbols` argument. For example, `npm start -- --symbols MSFT AAPL`.