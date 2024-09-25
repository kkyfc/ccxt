namespace ccxt.pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


public partial class ndax { public ndax(object args = null) : base(args) { } }
public partial class ndax : ccxt.ndax
{
    public override object describe()
    {
        return this.deepExtend(base.describe(), new Dictionary<string, object>() {
            { "has", new Dictionary<string, object>() {
                { "ws", true },
                { "watchOrderBook", true },
                { "watchTrades", true },
                { "watchTradesForSymbols", false },
                { "watchTicker", true },
                { "watchOHLCV", true },
            } },
            { "urls", new Dictionary<string, object>() {
                { "test", new Dictionary<string, object>() {
                    { "ws", "wss://ndaxmarginstaging.cdnhop.net:10456/WSAdminGatewa/" },
                } },
                { "api", new Dictionary<string, object>() {
                    { "ws", "wss://api.ndax.io/WSGateway" },
                } },
            } },
        });
    }

    public virtual object requestId()
    {
        object requestId = this.sum(this.safeInteger(this.options, "requestId", 0), 1);
        ((IDictionary<string,object>)this.options)["requestId"] = requestId;
        return requestId;
    }

    public async override Task<object> watchTicker(object symbol, object parameters = null)
    {
        /**
        * @method
        * @name ndax#watchTicker
        * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        * @see https://apidoc.ndax.io/#subscribelevel1
        * @param {string} symbol unified symbol of the market to fetch the ticker for
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
        */
        parameters ??= new Dictionary<string, object>();
        object omsId = this.safeInteger(this.options, "omsId", 1);
        await this.loadMarkets();
        object market = this.market(symbol);
        object name = "SubscribeLevel1";
        object messageHash = add(add(name, ":"), getValue(market, "id"));
        object url = getValue(getValue(this.urls, "api"), "ws");
        object requestId = this.requestId();
        object payload = new Dictionary<string, object>() {
            { "OMSId", omsId },
            { "InstrumentId", parseInt(getValue(market, "id")) },
        };
        object request = new Dictionary<string, object>() {
            { "m", 0 },
            { "i", requestId },
            { "n", name },
            { "o", this.json(payload) },
        };
        object message = this.extend(request, parameters);
        return await this.watch(url, messageHash, message, messageHash);
    }

    public virtual void handleTicker(WebSocketClient client, object message)
    {
        object payload = this.safeValue(message, "o", new Dictionary<string, object>() {});
        //
        //     {
        //         "OMSId": 1,
        //         "InstrumentId": 1,
        //         "BestBid": 6423.57,
        //         "BestOffer": 6436.53,
        //         "LastTradedPx": 6423.57,
        //         "LastTradedQty": 0.96183964,
        //         "LastTradeTime": 1534862990343,
        //         "SessionOpen": 6249.64,
        //         "SessionHigh": 11111,
        //         "SessionLow": 4433,
        //         "SessionClose": 6249.64,
        //         "Volume": 0.96183964,
        //         "CurrentDayVolume": 3516.31668185,
        //         "CurrentDayNumTrades": 8529,
        //         "CurrentDayPxChange": 173.93,
        //         "CurrentNotional": 0.0,
        //         "Rolling24HrNotional": 0.0,
        //         "Rolling24HrVolume": 4319.63870783,
        //         "Rolling24NumTrades": 10585,
        //         "Rolling24HrPxChange": -0.4165607307408487,
        //         "TimeStamp": "1534862990358"
        //     }
        //
        object ticker = this.parseTicker(payload);
        object symbol = getValue(ticker, "symbol");
        object market = this.market(symbol);
        ((IDictionary<string,object>)this.tickers)[(string)symbol] = ticker;
        object name = "SubscribeLevel1";
        object messageHash = add(add(name, ":"), getValue(market, "id"));
        callDynamically(client as WebSocketClient, "resolve", new object[] {ticker, messageHash});
    }

    public async override Task<object> watchTrades(object symbol, object since = null, object limit = null, object parameters = null)
    {
        /**
        * @method
        * @name ndax#watchTrades
        * @description get the list of most recent trades for a particular symbol
        * @see https://apidoc.ndax.io/#subscribetrades
        * @param {string} symbol unified symbol of the market to fetch trades for
        * @param {int} [since] timestamp in ms of the earliest trade to fetch
        * @param {int} [limit] the maximum amount of trades to fetch
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
        */
        parameters ??= new Dictionary<string, object>();
        object omsId = this.safeInteger(this.options, "omsId", 1);
        await this.loadMarkets();
        object market = this.market(symbol);
        symbol = getValue(market, "symbol");
        object name = "SubscribeTrades";
        object messageHash = add(add(name, ":"), getValue(market, "id"));
        object url = getValue(getValue(this.urls, "api"), "ws");
        object requestId = this.requestId();
        object payload = new Dictionary<string, object>() {
            { "OMSId", omsId },
            { "InstrumentId", parseInt(getValue(market, "id")) },
            { "IncludeLastCount", 100 },
        };
        object request = new Dictionary<string, object>() {
            { "m", 0 },
            { "i", requestId },
            { "n", name },
            { "o", this.json(payload) },
        };
        object message = this.extend(request, parameters);
        object trades = await this.watch(url, messageHash, message, messageHash);
        if (isTrue(this.newUpdates))
        {
            limit = callDynamically(trades, "getLimit", new object[] {symbol, limit});
        }
        return this.filterBySinceLimit(trades, since, limit, "timestamp", true);
    }

    public virtual void handleTrades(WebSocketClient client, object message)
    {
        object payload = this.safeValue(message, "o", new List<object>() {});
        //
        // initial snapshot
        //
        //     [
        //         [
        //             6913253,       //  0 TradeId
        //             8,             //  1 ProductPairCode
        //             0.03340802,    //  2 Quantity
        //             19116.08,      //  3 Price
        //             2543425077,    //  4 Order1
        //             2543425482,    //  5 Order2
        //             1606935922416, //  6 Tradetime
        //             0,             //  7 Direction
        //             1,             //  8 TakerSide
        //             0,             //  9 BlockTrade
        //             0,             // 10 Either Order1ClientId or Order2ClientId
        //         ]
        //     ]
        //
        object name = "SubscribeTrades";
        object updates = new Dictionary<string, object>() {};
        for (object i = 0; isLessThan(i, getArrayLength(payload)); postFixIncrement(ref i))
        {
            object trade = this.parseTrade(getValue(payload, i));
            object symbol = getValue(trade, "symbol");
            object tradesArray = this.safeValue(this.trades, symbol);
            if (isTrue(isEqual(tradesArray, null)))
            {
                object limit = this.safeInteger(this.options, "tradesLimit", 1000);
                tradesArray = new ArrayCache(limit);
            }
            callDynamically(tradesArray, "append", new object[] {trade});
            ((IDictionary<string,object>)this.trades)[(string)symbol] = tradesArray;
            ((IDictionary<string,object>)updates)[(string)symbol] = true;
        }
        object symbols = new List<object>(((IDictionary<string,object>)updates).Keys);
        for (object i = 0; isLessThan(i, getArrayLength(symbols)); postFixIncrement(ref i))
        {
            object symbol = getValue(symbols, i);
            object market = this.market(symbol);
            object messageHash = add(add(name, ":"), getValue(market, "id"));
            object tradesArray = this.safeValue(this.trades, symbol);
            callDynamically(client as WebSocketClient, "resolve", new object[] {tradesArray, messageHash});
        }
    }

    public async override Task<object> watchOHLCV(object symbol, object timeframe = null, object since = null, object limit = null, object parameters = null)
    {
        /**
        * @method
        * @name ndax#watchOHLCV
        * @description watches historical candlestick data containing the open, high, low, and close price, and the volume of a market
        * @see https://apidoc.ndax.io/#subscribeticker
        * @param {string} symbol unified symbol of the market to fetch OHLCV data for
        * @param {string} timeframe the length of time each candle represents
        * @param {int} [since] timestamp in ms of the earliest candle to fetch
        * @param {int} [limit] the maximum amount of candles to fetch
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
        */
        timeframe ??= "1m";
        parameters ??= new Dictionary<string, object>();
        object omsId = this.safeInteger(this.options, "omsId", 1);
        await this.loadMarkets();
        object market = this.market(symbol);
        symbol = getValue(market, "symbol");
        object name = "SubscribeTicker";
        object messageHash = add(add(add(add(name, ":"), timeframe), ":"), getValue(market, "id"));
        object url = getValue(getValue(this.urls, "api"), "ws");
        object requestId = this.requestId();
        object payload = new Dictionary<string, object>() {
            { "OMSId", omsId },
            { "InstrumentId", parseInt(getValue(market, "id")) },
            { "Interval", parseInt(this.safeString(this.timeframes, timeframe, timeframe)) },
            { "IncludeLastCount", 100 },
        };
        object request = new Dictionary<string, object>() {
            { "m", 0 },
            { "i", requestId },
            { "n", name },
            { "o", this.json(payload) },
        };
        object message = this.extend(request, parameters);
        object ohlcv = await this.watch(url, messageHash, message, messageHash);
        if (isTrue(this.newUpdates))
        {
            limit = callDynamically(ohlcv, "getLimit", new object[] {symbol, limit});
        }
        return this.filterBySinceLimit(ohlcv, since, limit, 0, true);
    }

    public virtual void handleOHLCV(WebSocketClient client, object message)
    {
        //
        //     {
        //         "m": 1,
        //         "i": 1,
        //         "n": "SubscribeTicker",
        //         "o": [[1608284160000,23113.52,23070.88,23075.76,23075.39,162.44964300,23075.38,23075.39,8,1608284100000]],
        //     }
        //
        object payload = this.safeValue(message, "o", new List<object>() {});
        //
        //     [
        //         [
        //             1501603632000,      // 0 DateTime
        //             2700.33,            // 1 High
        //             2687.01,            // 2 Low
        //             2687.01,            // 3 Open
        //             2687.01,            // 4 Close
        //             24.86100992,        // 5 Volume
        //             0,                  // 6 Inside Bid Price
        //             2870.95,            // 7 Inside Ask Price
        //             1                   // 8 InstrumentId
        //             1608290188062.7678, // 9 candle timestamp
        //         ]
        //     ]
        //
        object updates = new Dictionary<string, object>() {};
        for (object i = 0; isLessThan(i, getArrayLength(payload)); postFixIncrement(ref i))
        {
            object ohlcv = getValue(payload, i);
            object marketId = this.safeString(ohlcv, 8);
            object market = this.safeMarket(marketId);
            object symbol = getValue(market, "symbol");
            ((IDictionary<string,object>)updates)[(string)marketId] = new Dictionary<string, object>() {};
            ((IDictionary<string,object>)this.ohlcvs)[(string)symbol] = this.safeValue(this.ohlcvs, symbol, new Dictionary<string, object>() {});
            object keys = new List<object>(((IDictionary<string,object>)this.timeframes).Keys);
            for (object j = 0; isLessThan(j, getArrayLength(keys)); postFixIncrement(ref j))
            {
                object timeframe = getValue(keys, j);
                object interval = this.safeString(this.timeframes, timeframe, timeframe);
                object duration = multiply(parseInt(interval), 1000);
                object timestamp = this.safeInteger(ohlcv, 0);
                object parsed = new List<object> {this.parseToInt(multiply((divide(timestamp, duration)), duration)), this.safeFloat(ohlcv, 3), this.safeFloat(ohlcv, 1), this.safeFloat(ohlcv, 2), this.safeFloat(ohlcv, 4), this.safeFloat(ohlcv, 5)};
                object stored = this.safeValue(getValue(this.ohlcvs, symbol), timeframe, new List<object>() {});
                object length = getArrayLength(stored);
                if (isTrue(isTrue(length) && isTrue((isEqual(getValue(parsed, 0), getValue(getValue(stored, subtract(length, 1)), 0))))))
                {
                    object previous = getValue(stored, subtract(length, 1));
                    ((List<object>)stored)[Convert.ToInt32(subtract(length, 1))] = new List<object>() {getValue(parsed, 0), getValue(previous, 1), mathMax(getValue(parsed, 1), getValue(previous, 1)), mathMin(getValue(parsed, 2), getValue(previous, 2)), getValue(parsed, 4), this.sum(getValue(parsed, 5), getValue(previous, 5))};
                    ((IDictionary<string,object>)getValue(updates, marketId))[(string)timeframe] = true;
                } else
                {
                    if (isTrue(isTrue(length) && isTrue((isLessThan(getValue(parsed, 0), getValue(getValue(stored, subtract(length, 1)), 0))))))
                    {
                        continue;
                    } else
                    {
                        ((IList<object>)stored).Add(parsed);
                        object limit = this.safeInteger(this.options, "OHLCVLimit", 1000);
                        if (isTrue(isGreaterThanOrEqual(length, limit)))
                        {
                            ((IList<object>)stored).First();
                        }
                        ((IDictionary<string,object>)getValue(updates, marketId))[(string)timeframe] = true;
                    }
                }
                ((IDictionary<string,object>)getValue(this.ohlcvs, symbol))[(string)timeframe] = stored;
            }
        }
        object name = "SubscribeTicker";
        object marketIds = new List<object>(((IDictionary<string,object>)updates).Keys);
        for (object i = 0; isLessThan(i, getArrayLength(marketIds)); postFixIncrement(ref i))
        {
            object marketId = getValue(marketIds, i);
            object timeframes = new List<object>(((IDictionary<string,object>)getValue(updates, marketId)).Keys);
            for (object j = 0; isLessThan(j, getArrayLength(timeframes)); postFixIncrement(ref j))
            {
                object timeframe = getValue(timeframes, j);
                object messageHash = add(add(add(add(name, ":"), timeframe), ":"), marketId);
                object market = this.safeMarket(marketId);
                object symbol = getValue(market, "symbol");
                object stored = this.safeValue(getValue(this.ohlcvs, symbol), timeframe, new List<object>() {});
                callDynamically(client as WebSocketClient, "resolve", new object[] {stored, messageHash});
            }
        }
    }

    public async override Task<object> watchOrderBook(object symbol, object limit = null, object parameters = null)
    {
        /**
        * @method
        * @name ndax#watchOrderBook
        * @description watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
        * @see https://apidoc.ndax.io/#subscribelevel2
        * @param {string} symbol unified symbol of the market to fetch the order book for
        * @param {int} [limit] the maximum amount of order book entries to return
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
        */
        parameters ??= new Dictionary<string, object>();
        object omsId = this.safeInteger(this.options, "omsId", 1);
        await this.loadMarkets();
        object market = this.market(symbol);
        symbol = getValue(market, "symbol");
        object name = "SubscribeLevel2";
        object messageHash = add(add(name, ":"), getValue(market, "id"));
        object url = getValue(getValue(this.urls, "api"), "ws");
        object requestId = this.requestId();
        limit = ((bool) isTrue((isEqual(limit, null)))) ? 100 : limit;
        object payload = new Dictionary<string, object>() {
            { "OMSId", omsId },
            { "InstrumentId", parseInt(getValue(market, "id")) },
            { "Depth", limit },
        };
        object request = new Dictionary<string, object>() {
            { "m", 0 },
            { "i", requestId },
            { "n", name },
            { "o", this.json(payload) },
        };
        object subscription = new Dictionary<string, object>() {
            { "id", requestId },
            { "messageHash", messageHash },
            { "name", name },
            { "symbol", symbol },
            { "marketId", getValue(market, "id") },
            { "method", this.handleOrderBookSubscription },
            { "limit", limit },
            { "params", parameters },
        };
        object message = this.extend(request, parameters);
        object orderbook = await this.watch(url, messageHash, message, messageHash, subscription);
        return (orderbook as IOrderBook).limit();
    }

    public virtual void handleOrderBook(WebSocketClient client, object message)
    {
        //
        //     {
        //         "m": 3,
        //         "i": 2,
        //         "n": "Level2UpdateEvent",
        //         "o": [[2,1,1608208308265,0,20782.49,1,25000,8,1,1]]
        //     }
        //
        object payload = this.safeValue(message, "o", new List<object>() {});
        //
        //     [
        //         0,   // 0 MDUpdateId
        //         1,   // 1 Number of Unique Accounts
        //         123, // 2 ActionDateTime in Posix format X 1000
        //         0,   // 3 ActionType 0 (New), 1 (Update), 2(Delete)
        //         0.0, // 4 LastTradePrice
        //         0,   // 5 Number of Orders
        //         0.0, // 6 Price
        //         0,   // 7 ProductPairCode
        //         0.0, // 8 Quantity
        //         0,   // 9 Side
        //     ],
        //
        object firstBidAsk = this.safeValue(payload, 0, new List<object>() {});
        object marketId = this.safeString(firstBidAsk, 7);
        if (isTrue(isEqual(marketId, null)))
        {
            return;
        }
        object market = this.safeMarket(marketId);
        object symbol = getValue(market, "symbol");
        object orderbook = this.safeValue(this.orderbooks, symbol);
        if (isTrue(isEqual(orderbook, null)))
        {
            return;
        }
        object timestamp = null;
        object nonce = null;
        for (object i = 0; isLessThan(i, getArrayLength(payload)); postFixIncrement(ref i))
        {
            object bidask = getValue(payload, i);
            if (isTrue(isEqual(timestamp, null)))
            {
                timestamp = this.safeInteger(bidask, 2);
            } else
            {
                object newTimestamp = this.safeInteger(bidask, 2);
                timestamp = mathMax(timestamp, newTimestamp);
            }
            if (isTrue(isEqual(nonce, null)))
            {
                nonce = this.safeInteger(bidask, 0);
            } else
            {
                object newNonce = this.safeInteger(bidask, 0);
                nonce = mathMax(nonce, newNonce);
            }
            // 0 new, 1 update, 2 remove
            object type = this.safeInteger(bidask, 3);
            object price = this.safeFloat(bidask, 6);
            object amount = this.safeFloat(bidask, 8);
            object side = this.safeInteger(bidask, 9);
            // 0 buy, 1 sell, 2 short reserved for future use, 3 unknown
            object orderbookSide = ((bool) isTrue((isEqual(side, 0)))) ? getValue(orderbook, "bids") : getValue(orderbook, "asks");
            // 0 new, 1 update, 2 remove
            if (isTrue(isEqual(type, 0)))
            {
                (orderbookSide as IOrderBookSide).store(price, amount);
            } else if (isTrue(isEqual(type, 1)))
            {
                (orderbookSide as IOrderBookSide).store(price, amount);
            } else if (isTrue(isEqual(type, 2)))
            {
                (orderbookSide as IOrderBookSide).store(price, 0);
            }
        }
        ((IDictionary<string,object>)orderbook)["nonce"] = nonce;
        ((IDictionary<string,object>)orderbook)["timestamp"] = timestamp;
        ((IDictionary<string,object>)orderbook)["datetime"] = this.iso8601(timestamp);
        object name = "SubscribeLevel2";
        object messageHash = add(add(name, ":"), marketId);
        ((IDictionary<string,object>)this.orderbooks)[(string)symbol] = orderbook;
        callDynamically(client as WebSocketClient, "resolve", new object[] {orderbook, messageHash});
    }

    public virtual void handleOrderBookSubscription(WebSocketClient client, object message, object subscription)
    {
        //
        //     {
        //         "m": 1,
        //         "i": 1,
        //         "n": "SubscribeLevel2",
        //         "o": [[1,1,1608204295901,0,20782.49,1,18200,8,1,0]]
        //     }
        //
        object payload = this.safeValue(message, "o", new List<object>() {});
        //
        //     [
        //         [
        //             0,   // 0 MDUpdateId
        //             1,   // 1 Number of Unique Accounts
        //             123, // 2 ActionDateTime in Posix format X 1000
        //             0,   // 3 ActionType 0 (New), 1 (Update), 2(Delete)
        //             0.0, // 4 LastTradePrice
        //             0,   // 5 Number of Orders
        //             0.0, // 6 Price
        //             0,   // 7 ProductPairCode
        //             0.0, // 8 Quantity
        //             0,   // 9 Side
        //         ],
        //     ]
        //
        object symbol = this.safeString(subscription, "symbol");
        object snapshot = this.parseOrderBook(payload, symbol);
        object limit = this.safeInteger(subscription, "limit");
        object orderbook = this.orderBook(snapshot, limit);
        ((IDictionary<string,object>)this.orderbooks)[(string)symbol] = orderbook;
        object messageHash = this.safeString(subscription, "messageHash");
        callDynamically(client as WebSocketClient, "resolve", new object[] {orderbook, messageHash});
    }

    public virtual void handleSubscriptionStatus(WebSocketClient client, object message)
    {
        //
        //     {
        //         "m": 1,
        //         "i": 1,
        //         "n": "SubscribeLevel2",
        //         "o": "[[1,1,1608204295901,0,20782.49,1,18200,8,1,0]]"
        //     }
        //
        object subscriptionsById = this.indexBy(((WebSocketClient)client).subscriptions, "id");
        object id = this.safeInteger(message, "i");
        object subscription = this.safeValue(subscriptionsById, id);
        if (isTrue(!isEqual(subscription, null)))
        {
            object method = this.safeValue(subscription, "method");
            if (isTrue(!isEqual(method, null)))
            {
                DynamicInvoker.InvokeMethod(method, new object[] { client, message, subscription});
            }
        }
    }

    public override void handleMessage(WebSocketClient client, object message)
    {
        //
        //     {
        //         "m": 0, // message type, 0 request, 1 reply, 2 subscribe, 3 event, unsubscribe, 5 error
        //         "i": 0, // sequence number identifies an individual request or request-and-response pair, to your application
        //         "n":"function name", // function name is the name of the function being called or that the server is responding to, the server echoes your call
        //         "o":"payload", // JSON-formatted string containing the data being sent with the message
        //     }
        //
        //     {
        //         "m": 1,
        //         "i": 1,
        //         "n": "SubscribeLevel2",
        //         "o": "[[1,1,1608204295901,0,20782.49,1,18200,8,1,0]]"
        //     }
        //
        //     {
        //         "m": 3,
        //         "i": 2,
        //         "n": "Level2UpdateEvent",
        //         "o": "[[2,1,1608208308265,0,20782.49,1,25000,8,1,1]]"
        //     }
        //
        object payload = this.safeString(message, "o");
        if (isTrue(isEqual(payload, null)))
        {
            return;
        }
        ((IDictionary<string,object>)message)["o"] = parseJson(payload);
        object methods = new Dictionary<string, object>() {
            { "SubscribeLevel2", this.handleSubscriptionStatus },
            { "SubscribeLevel1", this.handleTicker },
            { "Level2UpdateEvent", this.handleOrderBook },
            { "Level1UpdateEvent", this.handleTicker },
            { "SubscribeTrades", this.handleTrades },
            { "TradeDataUpdateEvent", this.handleTrades },
            { "SubscribeTicker", this.handleOHLCV },
            { "TickerDataUpdateEvent", this.handleOHLCV },
        };
        object eventVar = this.safeString(message, "n");
        object method = this.safeValue(methods, eventVar);
        if (isTrue(!isEqual(method, null)))
        {
            DynamicInvoker.InvokeMethod(method, new object[] { client, message});
        }
    }
}
