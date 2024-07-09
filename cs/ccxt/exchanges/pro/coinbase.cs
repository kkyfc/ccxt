namespace ccxt.pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


public partial class coinbase { public coinbase(object args = null) : base(args) { } }
public partial class coinbase : ccxt.coinbase
{
    public override object describe()
    {
        return this.deepExtend(base.describe(), new Dictionary<string, object>() {
            { "has", new Dictionary<string, object>() {
                { "ws", true },
                { "cancelAllOrdersWs", false },
                { "cancelOrdersWs", false },
                { "cancelOrderWs", false },
                { "createOrderWs", false },
                { "editOrderWs", false },
                { "fetchBalanceWs", false },
                { "fetchOpenOrdersWs", false },
                { "fetchOrderWs", false },
                { "fetchTradesWs", false },
                { "watchBalance", false },
                { "watchMyTrades", false },
                { "watchOHLCV", false },
                { "watchOrderBook", true },
                { "watchOrderBookForSymbols", true },
                { "watchOrders", true },
                { "watchTicker", true },
                { "watchTickers", true },
                { "watchTrades", true },
                { "watchTradesForSymbols", true },
            } },
            { "urls", new Dictionary<string, object>() {
                { "api", new Dictionary<string, object>() {
                    { "ws", "wss://advanced-trade-ws.coinbase.com" },
                } },
            } },
            { "options", new Dictionary<string, object>() {
                { "tradesLimit", 1000 },
                { "ordersLimit", 1000 },
                { "myTradesLimit", 1000 },
                { "sides", new Dictionary<string, object>() {
                    { "bid", "bids" },
                    { "offer", "asks" },
                } },
            } },
        });
    }

    public async virtual Task<object> subscribe(object name, object isPrivate, object symbol = null, object parameters = null)
    {
        /**
        * @ignore
        * @method
        * @description subscribes to a websocket channel
        * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-overview#subscribe
        * @param {string} name the name of the channel
        * @param {string|string[]} [symbol] unified market symbol
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} subscription to a websocket channel
        */
        parameters ??= new Dictionary<string, object>();
        await this.loadMarkets();
        object market = null;
        object messageHash = name;
        object productIds = new List<object>() {};
        if (isTrue(((symbol is IList<object>) || (symbol.GetType().IsGenericType && symbol.GetType().GetGenericTypeDefinition().IsAssignableFrom(typeof(List<>))))))
        {
            object symbols = this.marketSymbols(symbol);
            object marketIds = this.marketIds(symbols);
            productIds = marketIds;
            messageHash = add(add(messageHash, "::"), String.Join(",", ((IList<object>)symbol).ToArray()));
        } else if (isTrue(!isEqual(symbol, null)))
        {
            market = this.market(symbol);
            messageHash = add(add(name, "::"), getValue(market, "id"));
            productIds = new List<object>() {getValue(market, "id")};
        }
        object url = getValue(getValue(this.urls, "api"), "ws");
        object subscribe = new Dictionary<string, object>() {
            { "type", "subscribe" },
            { "product_ids", productIds },
            { "channel", name },
        };
        if (isTrue(isPrivate))
        {
            subscribe = this.extend(subscribe, this.createWSAuth(name, productIds));
        }
        return await this.watch(url, messageHash, subscribe, messageHash);
    }

    public async virtual Task<object> subscribeMultiple(object name, object isPrivate, object symbols = null, object parameters = null)
    {
        /**
        * @ignore
        * @method
        * @description subscribes to a websocket channel
        * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-overview#subscribe
        * @param {string} name the name of the channel
        * @param {string[]} [symbols] unified market symbol
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} subscription to a websocket channel
        */
        parameters ??= new Dictionary<string, object>();
        await this.loadMarkets();
        object productIds = new List<object>() {};
        object messageHashes = new List<object>() {};
        symbols = this.marketSymbols(symbols, null, false);
        for (object i = 0; isLessThan(i, getArrayLength(symbols)); postFixIncrement(ref i))
        {
            object symbol = getValue(symbols, i);
            object market = this.market(symbol);
            object marketId = getValue(market, "id");
            ((IList<object>)productIds).Add(marketId);
            ((IList<object>)messageHashes).Add(add(add(name, "::"), marketId));
        }
        object url = getValue(getValue(this.urls, "api"), "ws");
        object subscribe = new Dictionary<string, object>() {
            { "type", "subscribe" },
            { "product_ids", productIds },
            { "channel", name },
        };
        if (isTrue(isPrivate))
        {
            subscribe = this.extend(subscribe, this.createWSAuth(name, productIds));
        }
        return await this.watchMultiple(url, messageHashes, subscribe, messageHashes);
    }

    public virtual object createWSAuth(object name, object productIds)
    {
        object subscribe = new Dictionary<string, object>() {};
        object timestamp = this.numberToString(this.seconds());
        this.checkRequiredCredentials();
        object isCloudAPiKey = isTrue((isGreaterThanOrEqual(getIndexOf(this.apiKey, "organizations/"), 0))) || isTrue((((string)this.secret).StartsWith(((string)"-----BEGIN"))));
        object auth = add(add(timestamp, name), String.Join(",", ((IList<object>)productIds).ToArray()));
        if (!isTrue(isCloudAPiKey))
        {
            ((IDictionary<string,object>)subscribe)["api_key"] = this.apiKey;
            ((IDictionary<string,object>)subscribe)["timestamp"] = timestamp;
            ((IDictionary<string,object>)subscribe)["signature"] = this.hmac(this.encode(auth), this.encode(this.secret), sha256);
        } else
        {
            if (isTrue(((string)this.apiKey).StartsWith(((string)"-----BEGIN"))))
            {
                throw new ArgumentsRequired ((string)add(this.id, " apiKey should contain the name (eg: organizations/3b910e93....) and not the public key")) ;
            }
            object currentToken = this.safeString(this.options, "wsToken");
            object tokenTimestamp = this.safeInteger(this.options, "wsTokenTimestamp", 0);
            object seconds = this.seconds();
            if (isTrue(isTrue(isEqual(currentToken, null)) || isTrue(isLessThan(add(tokenTimestamp, 120), seconds))))
            {
                // we should generate new token
                object token = this.createAuthToken(seconds);
                ((IDictionary<string,object>)this.options)["wsToken"] = token;
                ((IDictionary<string,object>)this.options)["wsTokenTimestamp"] = seconds;
            }
            ((IDictionary<string,object>)subscribe)["jwt"] = this.safeString(this.options, "wsToken");
        }
        return subscribe;
    }

    public async override Task<object> watchTicker(object symbol, object parameters = null)
    {
        /**
        * @method
        * @name coinbase#watchTicker
        * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#ticker-channel
        * @param {string} [symbol] unified symbol of the market to fetch the ticker for
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
        */
        parameters ??= new Dictionary<string, object>();
        object name = "ticker";
        return await this.subscribe(name, false, symbol, parameters);
    }

    public async override Task<object> watchTickers(object symbols = null, object parameters = null)
    {
        /**
        * @method
        * @name coinbase#watchTickers
        * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#ticker-batch-channel
        * @param {string[]} [symbols] unified symbol of the market to fetch the ticker for
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
        */
        parameters ??= new Dictionary<string, object>();
        if (isTrue(isEqual(symbols, null)))
        {
            symbols = this.symbols;
        }
        object name = "ticker_batch";
        object tickers = await this.subscribe(name, false, symbols, parameters);
        if (isTrue(this.newUpdates))
        {
            return tickers;
        }
        return this.tickers;
    }

    public virtual object handleTickers(WebSocketClient client, object message)
    {
        //
        //    {
        //        "channel": "ticker",
        //        "client_id": "",
        //        "timestamp": "2023-02-09T20:30:37.167359596Z",
        //        "sequence_num": 0,
        //        "events": [
        //            {
        //                "type": "snapshot",
        //                "tickers": [
        //                    {
        //                        "type": "ticker",
        //                        "product_id": "BTC-USD",
        //                        "price": "21932.98",
        //                        "volume_24_h": "16038.28770938",
        //                        "low_24_h": "21835.29",
        //                        "high_24_h": "23011.18",
        //                        "low_52_w": "15460",
        //                        "high_52_w": "48240",
        //                        "price_percent_chg_24_h": "-4.15775596190603"
        // new as of 2024-04-12
        //                        "best_bid":"21835.29",
        //                        "best_bid_quantity": "0.02000000",
        //                        "best_ask":"23011.18",
        //                        "best_ask_quantity": "0.01500000"
        //                    }
        //                ]
        //            }
        //        ]
        //    }
        //
        //    {
        //        "channel": "ticker_batch",
        //        "client_id": "",
        //        "timestamp": "2023-03-01T12:15:18.382173051Z",
        //        "sequence_num": 0,
        //        "events": [
        //            {
        //                "type": "snapshot",
        //                "tickers": [
        //                    {
        //                        "type": "ticker",
        //                        "product_id": "DOGE-USD",
        //                        "price": "0.08212",
        //                        "volume_24_h": "242556423.3",
        //                        "low_24_h": "0.07989",
        //                        "high_24_h": "0.08308",
        //                        "low_52_w": "0.04908",
        //                        "high_52_w": "0.1801",
        //                        "price_percent_chg_24_h": "0.50177456859626"
        // new as of 2024-04-12
        //                        "best_bid":"0.07989",
        //                        "best_bid_quantity": "500.0",
        //                        "best_ask":"0.08308",
        //                        "best_ask_quantity": "300.0"
        //                    }
        //                ]
        //            }
        //        ]
        //    }
        //
        // note! seems coinbase might also send empty data like:
        //
        //    {
        //        "channel": "ticker_batch",
        //        "client_id": "",
        //        "timestamp": "2024-05-24T18:22:24.546809523Z",
        //        "sequence_num": 1,
        //        "events": [
        //            {
        //                "type": "snapshot",
        //                "tickers": [
        //                    {
        //                        "type": "ticker",
        //                        "product_id": "",
        //                        "price": "",
        //                        "volume_24_h": "",
        //                        "low_24_h": "",
        //                        "high_24_h": "",
        //                        "low_52_w": "",
        //                        "high_52_w": "",
        //                        "price_percent_chg_24_h": ""
        //                    }
        //                ]
        //            }
        //        ]
        //    }
        //
        //
        object channel = this.safeString(message, "channel");
        object events = this.safeValue(message, "events", new List<object>() {});
        object datetime = this.safeString(message, "timestamp");
        object timestamp = this.parse8601(datetime);
        object newTickers = new List<object>() {};
        for (object i = 0; isLessThan(i, getArrayLength(events)); postFixIncrement(ref i))
        {
            object tickersObj = getValue(events, i);
            object tickers = this.safeList(tickersObj, "tickers", new List<object>() {});
            for (object j = 0; isLessThan(j, getArrayLength(tickers)); postFixIncrement(ref j))
            {
                object ticker = getValue(tickers, j);
                object result = this.parseWsTicker(ticker);
                ((IDictionary<string,object>)result)["timestamp"] = timestamp;
                ((IDictionary<string,object>)result)["datetime"] = datetime;
                object symbol = getValue(result, "symbol");
                ((IDictionary<string,object>)this.tickers)[(string)symbol] = result;
                object wsMarketId = this.safeString(ticker, "product_id");
                if (isTrue(isEqual(wsMarketId, null)))
                {
                    continue;
                }
                object messageHash = add(add(channel, "::"), wsMarketId);
                ((IList<object>)newTickers).Add(result);
                callDynamically(client as WebSocketClient, "resolve", new object[] {result, messageHash});
                if (isTrue(((string)messageHash).EndsWith(((string)"USD"))))
                {
                    callDynamically(client as WebSocketClient, "resolve", new object[] {result, add(messageHash, "C")}); // sometimes we subscribe to BTC/USDC and coinbase returns BTC/USD
                }
            }
        }
        object messageHashes = this.findMessageHashes(client as WebSocketClient, "ticker_batch::");
        for (object i = 0; isLessThan(i, getArrayLength(messageHashes)); postFixIncrement(ref i))
        {
            object messageHash = getValue(messageHashes, i);
            object parts = ((string)messageHash).Split(new [] {((string)"::")}, StringSplitOptions.None).ToList<object>();
            object symbolsString = getValue(parts, 1);
            object symbols = ((string)symbolsString).Split(new [] {((string)",")}, StringSplitOptions.None).ToList<object>();
            object tickers = this.filterByArray(newTickers, "symbol", symbols);
            if (!isTrue(this.isEmpty(tickers)))
            {
                callDynamically(client as WebSocketClient, "resolve", new object[] {tickers, messageHash});
                if (isTrue(((string)messageHash).EndsWith(((string)"USD"))))
                {
                    callDynamically(client as WebSocketClient, "resolve", new object[] {tickers, add(messageHash, "C")}); // sometimes we subscribe to BTC/USDC and coinbase returns BTC/USD
                }
            }
        }
        return message;
    }

    public virtual object parseWsTicker(object ticker, object market = null)
    {
        //
        //     {
        //         "type": "ticker",
        //         "product_id": "DOGE-USD",
        //         "price": "0.08212",
        //         "volume_24_h": "242556423.3",
        //         "low_24_h": "0.07989",
        //         "high_24_h": "0.08308",
        //         "low_52_w": "0.04908",
        //         "high_52_w": "0.1801",
        //         "price_percent_chg_24_h": "0.50177456859626"
        // new as of 2024-04-12
        //         "best_bid":"0.07989",
        //         "best_bid_quantity": "500.0",
        //         "best_ask":"0.08308",
        //         "best_ask_quantity": "300.0"
        //     }
        //
        object marketId = this.safeString(ticker, "product_id");
        object timestamp = null;
        object last = this.safeNumber(ticker, "price");
        return this.safeTicker(new Dictionary<string, object>() {
            { "info", ticker },
            { "symbol", this.safeSymbol(marketId, market, "-") },
            { "timestamp", timestamp },
            { "datetime", this.iso8601(timestamp) },
            { "high", this.safeString(ticker, "high_24_h") },
            { "low", this.safeString(ticker, "low_24_h") },
            { "bid", this.safeString(ticker, "best_bid") },
            { "bidVolume", this.safeString(ticker, "best_bid_quantity") },
            { "ask", this.safeString(ticker, "best_ask") },
            { "askVolume", this.safeString(ticker, "best_ask_quantity") },
            { "vwap", null },
            { "open", null },
            { "close", last },
            { "last", last },
            { "previousClose", null },
            { "change", null },
            { "percentage", this.safeString(ticker, "price_percent_chg_24_h") },
            { "average", null },
            { "baseVolume", this.safeString(ticker, "volume_24_h") },
            { "quoteVolume", null },
        });
    }

    public async override Task<object> watchTrades(object symbol, object since = null, object limit = null, object parameters = null)
    {
        /**
        * @method
        * @name coinbase#watchTrades
        * @description get the list of most recent trades for a particular symbol
        * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#market-trades-channel
        * @param {string} symbol unified symbol of the market to fetch trades for
        * @param {int} [since] timestamp in ms of the earliest trade to fetch
        * @param {int} [limit] the maximum amount of trades to fetch
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
        */
        parameters ??= new Dictionary<string, object>();
        await this.loadMarkets();
        symbol = this.symbol(symbol);
        object name = "market_trades";
        object trades = await this.subscribe(name, false, symbol, parameters);
        if (isTrue(this.newUpdates))
        {
            limit = callDynamically(trades, "getLimit", new object[] {symbol, limit});
        }
        return this.filterBySinceLimit(trades, since, limit, "timestamp", true);
    }

    public async override Task<object> watchTradesForSymbols(object symbols, object since = null, object limit = null, object parameters = null)
    {
        /**
        * @method
        * @name coinbase#watchTradesForSymbols
        * @description get the list of most recent trades for a particular symbol
        * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#market-trades-channel
        * @param {string[]} symbols unified symbol of the market to fetch trades for
        * @param {int} [since] timestamp in ms of the earliest trade to fetch
        * @param {int} [limit] the maximum amount of trades to fetch
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
        */
        parameters ??= new Dictionary<string, object>();
        await this.loadMarkets();
        object name = "market_trades";
        object trades = await this.subscribeMultiple(name, false, symbols, parameters);
        if (isTrue(this.newUpdates))
        {
            object first = this.safeDict(trades, 0);
            object tradeSymbol = this.safeString(first, "symbol");
            limit = callDynamically(trades, "getLimit", new object[] {tradeSymbol, limit});
        }
        return this.filterBySinceLimit(trades, since, limit, "timestamp", true);
    }

    public async override Task<object> watchOrders(object symbol = null, object since = null, object limit = null, object parameters = null)
    {
        /**
        * @method
        * @name coinbase#watchOrders
        * @description watches information on multiple orders made by the user
        * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#user-channel
        * @param {string} [symbol] unified market symbol of the market orders were made in
        * @param {int} [since] the earliest time in ms to fetch orders for
        * @param {int} [limit] the maximum number of order structures to retrieve
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
        */
        parameters ??= new Dictionary<string, object>();
        await this.loadMarkets();
        object name = "user";
        object orders = await this.subscribe(name, true, symbol, parameters);
        if (isTrue(this.newUpdates))
        {
            limit = callDynamically(orders, "getLimit", new object[] {symbol, limit});
        }
        return this.filterBySinceLimit(orders, since, limit, "timestamp", true);
    }

    public async override Task<object> watchOrderBook(object symbol, object limit = null, object parameters = null)
    {
        /**
        * @method
        * @name coinbase#watchOrderBook
        * @description watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
        * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#level2-channel
        * @param {string} symbol unified symbol of the market to fetch the order book for
        * @param {int} [limit] the maximum amount of order book entries to return
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
        */
        parameters ??= new Dictionary<string, object>();
        await this.loadMarkets();
        object name = "level2";
        object market = this.market(symbol);
        symbol = getValue(market, "symbol");
        object orderbook = await this.subscribe(name, false, symbol, parameters);
        return (orderbook as IOrderBook).limit();
    }

    public async override Task<object> watchOrderBookForSymbols(object symbols, object limit = null, object parameters = null)
    {
        /**
        * @method
        * @name coinbase#watchOrderBookForSymbols
        * @description watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
        * @see https://docs.cloud.coinbase.com/advanced-trade-api/docs/ws-channels#level2-channel
        * @param {string[]} symbols unified array of symbols
        * @param {int} [limit] the maximum amount of order book entries to return
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
        */
        parameters ??= new Dictionary<string, object>();
        await this.loadMarkets();
        object name = "level2";
        object orderbook = await this.subscribeMultiple(name, false, symbols, parameters);
        return (orderbook as IOrderBook).limit();
    }

    public virtual object handleTrade(WebSocketClient client, object message)
    {
        //
        //    {
        //        "channel": "market_trades",
        //        "client_id": "",
        //        "timestamp": "2023-02-09T20:19:35.39625135Z",
        //        "sequence_num": 0,
        //        "events": [
        //            {
        //                "type": "snapshot",
        //                "trades": [
        //                    {
        //                        "trade_id": "000000000",
        //                        "product_id": "ETH-USD",
        //                        "price": "1260.01",
        //                        "size": "0.3",
        //                        "side": "BUY",
        //                        "time": "2019-08-14T20:42:27.265Z",
        //                    }
        //                ]
        //            }
        //        ]
        //    }
        //
        object events = this.safeValue(message, "events");
        object eventVar = this.safeValue(events, 0);
        object trades = this.safeValue(eventVar, "trades");
        object trade = this.safeValue(trades, 0);
        object marketId = this.safeString(trade, "product_id");
        object messageHash = add("market_trades::", marketId);
        object symbol = this.safeSymbol(marketId);
        object tradesArray = this.safeValue(this.trades, symbol);
        if (isTrue(isEqual(tradesArray, null)))
        {
            object tradesLimit = this.safeInteger(this.options, "tradesLimit", 1000);
            tradesArray = new ArrayCacheBySymbolById(tradesLimit);
            ((IDictionary<string,object>)this.trades)[(string)symbol] = tradesArray;
        }
        for (object i = 0; isLessThan(i, getArrayLength(events)); postFixIncrement(ref i))
        {
            object currentEvent = getValue(events, i);
            object currentTrades = this.safeValue(currentEvent, "trades");
            for (object j = 0; isLessThan(j, getArrayLength(currentTrades)); postFixIncrement(ref j))
            {
                object item = getValue(currentTrades, i);
                callDynamically(tradesArray, "append", new object[] {this.parseTrade(item)});
            }
        }
        callDynamically(client as WebSocketClient, "resolve", new object[] {tradesArray, messageHash});
        if (isTrue(((string)marketId).EndsWith(((string)"USD"))))
        {
            callDynamically(client as WebSocketClient, "resolve", new object[] {tradesArray, add(messageHash, "C")}); // sometimes we subscribe to BTC/USDC and coinbase returns BTC/USD
        }
        return message;
    }

    public virtual object handleOrder(WebSocketClient client, object message)
    {
        //
        //    {
        //        "channel": "user",
        //        "client_id": "",
        //        "timestamp": "2023-02-09T20:33:57.609931463Z",
        //        "sequence_num": 0,
        //        "events": [
        //            {
        //                "type": "snapshot",
        //                "orders": [
        //                    {
        //                        "order_id": "XXX",
        //                        "client_order_id": "YYY",
        //                        "cumulative_quantity": "0",
        //                        "leaves_quantity": "0.000994",
        //                        "avg_price": "0",
        //                        "total_fees": "0",
        //                        "status": "OPEN",
        //                        "product_id": "BTC-USD",
        //                        "creation_time": "2022-12-07T19:42:18.719312Z",
        //                        "order_side": "BUY",
        //                        "order_type": "Limit"
        //                    },
        //                ]
        //            }
        //        ]
        //    }
        //
        object events = this.safeValue(message, "events");
        object marketIds = new List<object>() {};
        if (isTrue(isEqual(this.orders, null)))
        {
            object limit = this.safeInteger(this.options, "ordersLimit", 1000);
            this.orders = new ArrayCacheBySymbolById(limit);
        }
        for (object i = 0; isLessThan(i, getArrayLength(events)); postFixIncrement(ref i))
        {
            object eventVar = getValue(events, i);
            object responseOrders = this.safeValue(eventVar, "orders");
            for (object j = 0; isLessThan(j, getArrayLength(responseOrders)); postFixIncrement(ref j))
            {
                object responseOrder = getValue(responseOrders, j);
                object parsed = this.parseWsOrder(responseOrder);
                object cachedOrders = this.orders;
                object marketId = this.safeString(responseOrder, "product_id");
                if (!isTrue((inOp(marketIds, marketId))))
                {
                    ((IList<object>)marketIds).Add(marketId);
                }
                callDynamically(cachedOrders, "append", new object[] {parsed});
            }
        }
        for (object i = 0; isLessThan(i, getArrayLength(marketIds)); postFixIncrement(ref i))
        {
            object marketId = getValue(marketIds, i);
            object messageHash = add("user::", marketId);
            callDynamically(client as WebSocketClient, "resolve", new object[] {this.orders, messageHash});
            if (isTrue(((string)messageHash).EndsWith(((string)"USD"))))
            {
                callDynamically(client as WebSocketClient, "resolve", new object[] {this.orders, add(messageHash, "C")}); // sometimes we subscribe to BTC/USDC and coinbase returns BTC/USD
            }
        }
        callDynamically(client as WebSocketClient, "resolve", new object[] {this.orders, "user"});
        return message;
    }

    public override object parseWsOrder(object order, object market = null)
    {
        //
        //    {
        //        "order_id": "XXX",
        //        "client_order_id": "YYY",
        //        "cumulative_quantity": "0",
        //        "leaves_quantity": "0.000994",
        //        "avg_price": "0",
        //        "total_fees": "0",
        //        "status": "OPEN",
        //        "product_id": "BTC-USD",
        //        "creation_time": "2022-12-07T19:42:18.719312Z",
        //        "order_side": "BUY",
        //        "order_type": "Limit"
        //    }
        //
        object id = this.safeString(order, "order_id");
        object clientOrderId = this.safeString(order, "client_order_id");
        object marketId = this.safeString(order, "product_id");
        object datetime = this.safeString(order, "time");
        market = this.safeMarket(marketId, market);
        return this.safeOrder(new Dictionary<string, object>() {
            { "info", order },
            { "symbol", this.safeString(market, "symbol") },
            { "id", id },
            { "clientOrderId", clientOrderId },
            { "timestamp", this.parse8601(datetime) },
            { "datetime", datetime },
            { "lastTradeTimestamp", null },
            { "type", this.safeString(order, "order_type") },
            { "timeInForce", null },
            { "postOnly", null },
            { "side", this.safeString(order, "side") },
            { "price", null },
            { "stopPrice", null },
            { "triggerPrice", null },
            { "amount", null },
            { "cost", null },
            { "average", this.safeString(order, "avg_price") },
            { "filled", this.safeString(order, "cumulative_quantity") },
            { "remaining", this.safeString(order, "leaves_quantity") },
            { "status", this.safeStringLower(order, "status") },
            { "fee", new Dictionary<string, object>() {
                { "amount", this.safeString(order, "total_fees") },
                { "currency", this.safeString(market, "quote") },
            } },
            { "trades", null },
        });
    }

    public virtual void handleOrderBookHelper(object orderbook, object updates)
    {
        for (object i = 0; isLessThan(i, getArrayLength(updates)); postFixIncrement(ref i))
        {
            object trade = getValue(updates, i);
            object sideId = this.safeString(trade, "side");
            object side = this.safeString(getValue(this.options, "sides"), sideId);
            object price = this.safeNumber(trade, "price_level");
            object amount = this.safeNumber(trade, "new_quantity");
            object orderbookSide = getValue(orderbook, side);
            (orderbookSide as IOrderBookSide).store(price, amount);
        }
    }

    public virtual void handleOrderBook(WebSocketClient client, object message)
    {
        //
        //    {
        //        "channel": "l2_data",
        //        "client_id": "",
        //        "timestamp": "2023-02-09T20:32:50.714964855Z",
        //        "sequence_num": 0,
        //        "events": [
        //            {
        //                "type": "snapshot",
        //                "product_id": "BTC-USD",
        //                "updates": [
        //                    {
        //                        "side": "bid",
        //                        "event_time": "1970-01-01T00:00:00Z",
        //                        "price_level": "21921.73",
        //                        "new_quantity": "0.06317902"
        //                    },
        //                    {
        //                        "side": "bid",
        //                        "event_time": "1970-01-01T00:00:00Z",
        //                        "price_level": "21921.3",
        //                        "new_quantity": "0.02"
        //                    },
        //                ]
        //            }
        //        ]
        //    }
        //
        object events = this.safeValue(message, "events");
        object datetime = this.safeString(message, "timestamp");
        for (object i = 0; isLessThan(i, getArrayLength(events)); postFixIncrement(ref i))
        {
            object eventVar = getValue(events, i);
            object updates = this.safeValue(eventVar, "updates", new List<object>() {});
            object marketId = this.safeString(eventVar, "product_id");
            object messageHash = add("level2::", marketId);
            object subscription = this.safeValue(((WebSocketClient)client).subscriptions, messageHash, new Dictionary<string, object>() {});
            object limit = this.safeInteger(subscription, "limit");
            object symbol = this.safeSymbol(marketId);
            object type = this.safeString(eventVar, "type");
            if (isTrue(isEqual(type, "snapshot")))
            {
                ((IDictionary<string,object>)this.orderbooks)[(string)symbol] = this.orderBook(new Dictionary<string, object>() {}, limit);
                object orderbook = getValue(this.orderbooks, symbol);
                this.handleOrderBookHelper(orderbook, updates);
                ((IDictionary<string,object>)orderbook)["timestamp"] = this.parse8601(datetime);
                ((IDictionary<string,object>)orderbook)["datetime"] = datetime;
                ((IDictionary<string,object>)orderbook)["symbol"] = symbol;
                callDynamically(client as WebSocketClient, "resolve", new object[] {orderbook, messageHash});
                if (isTrue(((string)messageHash).EndsWith(((string)"USD"))))
                {
                    callDynamically(client as WebSocketClient, "resolve", new object[] {orderbook, add(messageHash, "C")}); // sometimes we subscribe to BTC/USDC and coinbase returns BTC/USD
                }
            } else if (isTrue(isEqual(type, "update")))
            {
                object orderbook = getValue(this.orderbooks, symbol);
                this.handleOrderBookHelper(orderbook, updates);
                ((IDictionary<string,object>)orderbook)["datetime"] = datetime;
                ((IDictionary<string,object>)orderbook)["timestamp"] = this.parse8601(datetime);
                ((IDictionary<string,object>)orderbook)["symbol"] = symbol;
                callDynamically(client as WebSocketClient, "resolve", new object[] {orderbook, messageHash});
                if (isTrue(((string)messageHash).EndsWith(((string)"USD"))))
                {
                    callDynamically(client as WebSocketClient, "resolve", new object[] {orderbook, add(messageHash, "C")}); // sometimes we subscribe to BTC/USDC and coinbase returns BTC/USD
                }
            }
        }
    }

    public virtual object handleSubscriptionStatus(WebSocketClient client, object message)
    {
        //
        //     {
        //         "type": "subscriptions",
        //         "channels": [
        //             {
        //                 "name": "level2",
        //                 "product_ids": [ "ETH-BTC" ]
        //             }
        //         ]
        //     }
        //
        return message;
    }

    public virtual object handleHeartbeats(WebSocketClient client, object message)
    {
        // although the subscription takes a product_ids parameter (i.e. symbol),
        // there is no (clear) way of mapping the message back to the symbol.
        //
        //     {
        //         "channel": "heartbeats",
        //         "client_id": "",
        //         "timestamp": "2023-06-23T20:31:26.122969572Z",
        //         "sequence_num": 0,
        //         "events": [
        //           {
        //               "current_time": "2023-06-23 20:31:56.121961769 +0000 UTC m=+91717.525857105",
        //               "heartbeat_counter": "3049"
        //           }
        //         ]
        //     }
        //
        return message;
    }

    public override void handleMessage(WebSocketClient client, object message)
    {
        object channel = this.safeString(message, "channel");
        object methods = new Dictionary<string, object>() {
            { "subscriptions", this.handleSubscriptionStatus },
            { "ticker", this.handleTickers },
            { "ticker_batch", this.handleTickers },
            { "market_trades", this.handleTrade },
            { "user", this.handleOrder },
            { "l2_data", this.handleOrderBook },
            { "heartbeats", this.handleHeartbeats },
        };
        object type = this.safeString(message, "type");
        if (isTrue(isEqual(type, "error")))
        {
            object errorMessage = this.safeString(message, "message");
            throw new ExchangeError ((string)errorMessage) ;
        }
        object method = this.safeValue(methods, channel);
        if (isTrue(method))
        {
            DynamicInvoker.InvokeMethod(method, new object[] { client, message});
        }
    }
}
