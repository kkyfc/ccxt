namespace ccxt.pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

public class  Probit: probit { public Probit(object args = null) : base(args) { } }
public partial class probit
{
    /// <summary>
    /// watch balance and get the amount of funds available for trading or funds locked in orders
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs-en.probit.com/reference/balance-1"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}.</returns>
    public async Task<Balances> WatchBalance(Dictionary<string, object> parameters = null)
    {
        var res = await this.watchBalance(parameters);
        return new Balances(res);
    }
    /// <summary>
    /// watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs-en.probit.com/reference/marketdata"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.interval</term>
    /// <description>
    /// int : Unit time to synchronize market information (ms). Available units: 100, 500
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}.</returns>
    public async Task<Ticker> WatchTicker(string symbol, Dictionary<string, object> parameters = null)
    {
        var res = await this.watchTicker(symbol, parameters);
        return new Ticker(res);
    }
    /// <summary>
    /// get the list of most recent trades for a particular symbol
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs-en.probit.com/reference/trade_history"/>  <br/>
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
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.interval</term>
    /// <description>
    /// int : Unit time to synchronize market information (ms). Available units: 100, 500
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object[]</term> a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}.</returns>
    public async Task<List<Trade>> WatchTrades(string symbol, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.watchTrades(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Trade(item)).ToList<Trade>();
    }
    /// <summary>
    /// get the list of trades associated with the user
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs-en.probit.com/reference/trade_history"/>  <br/>
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
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object[]</term> a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}.</returns>
    public async Task<List<Trade>> WatchMyTrades(string symbol = null, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.watchMyTrades(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Trade(item)).ToList<Trade>();
    }
    /// <summary>
    /// watches information on an order made by the user
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs-en.probit.com/reference/open_order"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : timestamp in ms of the earliest order to watch
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : the maximum amount of orders to watch
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.channel</term>
    /// <description>
    /// string : choose what channel to use. Can open_order or order_history.
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}.</returns>
    public async Task<List<Order>> WatchOrders(string symbol = null, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.watchOrders(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Order(item)).ToList<Order>();
    }
    /// <summary>
    /// watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs-en.probit.com/reference/marketdata"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : the maximum amount of order book entries to return
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols.</returns>
    public async Task<ccxt.pro.IOrderBook> WatchOrderBook(string symbol, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.watchOrderBook(symbol, limit, parameters);
        return ((ccxt.pro.IOrderBook) res).Copy();
    }
}
