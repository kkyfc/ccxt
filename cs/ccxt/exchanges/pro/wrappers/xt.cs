namespace ccxt.pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

public class  Xt: xt { public Xt(object args = null) : base(args) { } }
public partial class xt
{
    /// <summary>
    /// watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
    /// </summary>
    /// <remarks>
    /// See <see href="https://doc.xt.com/#websocket_publicallTicker"/>  <br/>
    /// See <see href="https://doc.xt.com/#futures_market_websocket_v2allTicker"/>  <br/>
    /// See <see href="https://doc.xt.com/#futures_market_websocket_v2allAggTicker"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>symbols</term>
    /// <description>
    /// string : unified market symbols
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.method</term>
    /// <description>
    /// string : 'agg_tickers' (contract only) or 'tickers', default = 'tickers' - the endpoint that will be streamed
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> a [ticker structure]{@link https://docs.ccxt.com/en/latest/manual.html#ticker-structure}.</returns>
    public async Task<Ticker> WatchTicker(string symbol, Dictionary<string, object> parameters = null)
    {
        var res = await this.watchTicker(symbol, parameters);
        return new Ticker(res);
    }
    public async Task<Tickers> WatchTickers(List<String> symbols = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.watchTickers(symbols, parameters);
        return new Tickers(res);
    }
    public async Task<List<OHLCV>> WatchOHLCV(string symbol, string timeframe = "1m", Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.watchOHLCV(symbol, timeframe, since, limit, parameters);
        return ((IList<object>)res).Select(item => new OHLCV(item)).ToList<OHLCV>();
    }
    /// <summary>
    /// get the list of most recent trades for a particular symbol
    /// </summary>
    /// <remarks>
    /// See <see href="https://doc.xt.com/#websocket_publicdealRecord"/>  <br/>
    /// See <see href="https://doc.xt.com/#futures_market_websocket_v2dealRecord"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : timestamp in ms of the earliest trade to fetch
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : the maximum amount of trades to fetch
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object[]</term> a list of [trade structures]{@link https://docs.ccxt.com/en/latest/manual.html?#public-trades}.</returns>
    public async Task<List<Trade>> WatchTrades(string symbol, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.watchTrades(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Trade(item)).ToList<Trade>();
    }
    /// <summary>
    /// watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
    /// </summary>
    /// <remarks>
    /// See <see href="https://doc.xt.com/#websocket_publiclimitDepth"/>  <br/>
    /// See <see href="https://doc.xt.com/#websocket_publicincreDepth"/>  <br/>
    /// See <see href="https://doc.xt.com/#futures_market_websocket_v2limitDepth"/>  <br/>
    /// See <see href="https://doc.xt.com/#futures_market_websocket_v2increDepth"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : not used by xt watchOrderBook
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.levels</term>
    /// <description>
    /// int : 5, 10, 20, or 50
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> A dictionary of [order book structures]{@link https://docs.ccxt.com/en/latest/manual.html#order-book-structure} indexed by market symbols.</returns>
    public async Task<ccxt.pro.IOrderBook> WatchOrderBook(string symbol, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.watchOrderBook(symbol, limit, parameters);
        return ((ccxt.pro.IOrderBook) res).Copy();
    }
    /// <summary>
    /// watches information on multiple orders made by the user
    /// </summary>
    /// <remarks>
    /// See <see href="https://doc.xt.com/#websocket_privatebalanceChange"/>  <br/>
    /// See <see href="https://doc.xt.com/#futures_user_websocket_v2balance"/>  <br/>
    /// <list type="table">
    /// </list>
    /// </remarks>
    /// <returns> <term>object[]</term> a list of [balance structures]{@link https://docs.ccxt.com/#/?id=balance-structure}.</returns>
    public async Task<List<Order>> WatchOrders(string symbol = null, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.watchOrders(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Order(item)).ToList<Order>();
    }
    /// <summary>
    /// watches information on multiple trades made by the user
    /// </summary>
    /// <remarks>
    /// See <see href="https://doc.xt.com/#websocket_privateorderDeal"/>  <br/>
    /// See <see href="https://doc.xt.com/#futures_user_websocket_v2trade"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : the earliest time in ms to fetch orders for
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : the maximum number of  orde structures to retrieve
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object[]</term> a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}.</returns>
    public async Task<List<Trade>> WatchMyTrades(string symbol = null, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.watchMyTrades(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Trade(item)).ToList<Trade>();
    }
    public async Task<Balances> WatchBalance(Dictionary<string, object> parameters = null)
    {
        var res = await this.watchBalance(parameters);
        return new Balances(res);
    }
}
