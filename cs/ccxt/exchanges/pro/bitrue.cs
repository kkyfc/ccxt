namespace ccxt.pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


public partial class bitrue { public bitrue(object args = null) : base(args) { } }
public partial class bitrue : ccxt.bitrue
{
    public override object describe()
    {
        return this.deepExtend(base.describe(), new Dictionary<string, object>() {
            { "has", new Dictionary<string, object>() {
                { "ws", true },
                { "watchBalance", true },
                { "watchTicker", false },
                { "watchTickers", false },
                { "watchTrades", false },
                { "watchMyTrades", false },
                { "watchOrders", true },
                { "watchOrderBook", true },
                { "watchOHLCV", false },
            } },
            { "urls", new Dictionary<string, object>() {
                { "api", new Dictionary<string, object>() {
                    { "open", "https://open.bitrue.com" },
                    { "ws", new Dictionary<string, object>() {
                        { "public", "wss://ws.bitrue.com/market/ws" },
                        { "private", "wss://wsapi.bitrue.com" },
                    } },
                } },
            } },
            { "api", new Dictionary<string, object>() {
                { "open", new Dictionary<string, object>() {
                    { "private", new Dictionary<string, object>() {
                        { "post", new Dictionary<string, object>() {
                            { "poseidon/api/v1/listenKey", 1 },
                        } },
                        { "put", new Dictionary<string, object>() {
                            { "poseidon/api/v1/listenKey/{listenKey}", 1 },
                        } },
                        { "delete", new Dictionary<string, object>() {
                            { "poseidon/api/v1/listenKey/{listenKey}", 1 },
                        } },
                    } },
                } },
            } },
            { "options", new Dictionary<string, object>() {
                { "listenKeyRefreshRate", 1800000 },
                { "ws", new Dictionary<string, object>() {
                    { "gunzip", true },
                } },
            } },
        });
    }

    public async override Task<object> watchBalance(object parameters = null)
    {
        /**
        * @method
        * @name bitrue#watchBalance
        * @description watch balance and get the amount of funds available for trading or funds locked in orders
        * @see https://github.com/Bitrue-exchange/Spot-official-api-docs#balance-update
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
        */
        parameters ??= new Dictionary<string, object>();
        object url = await this.authenticate();
        object messageHash = "balance";
        object message = new Dictionary<string, object>() {
            { "event", "sub" },
            { "params", new Dictionary<string, object>() {
                { "channel", "user_balance_update" },
            } },
        };
        object request = this.deepExtend(message, parameters);
        return await this.watch(url, messageHash, request, messageHash);
    }

    public virtual void handleBalance(WebSocketClient client, object message)
    {
        //
        //     {
        //         "e": "BALANCE",
        //         "x": "OutboundAccountPositionTradeEvent",
        //         "E": 1657799510175,
        //         "I": "302274978401288200",
        //         "i": 1657799510175,
        //         "B": [{
        //                 "a": "btc",
        //                 "F": "0.0006000000000000",
        //                 "T": 1657799510000,
        //                 "f": "0.0006000000000000",
        //                 "t": 0
        //             },
        //             {
        //                 "a": "usdt",
        //                 "T": 0,
        //                 "L": "0.0000000000000000",
        //                 "l": "-11.8705317318000000",
        //                 "t": 1657799510000
        //             }
        //         ],
        //         "u": 1814396
        //     }
        //
        //     {
        //      "e": "BALANCE",
        //      "x": "OutboundAccountPositionOrderEvent",
        //      "E": 1670051332478,
        //      "I": "353662845694083072",
        //      "i": 1670051332478,
        //      "B": [
        //        {
        //          "a": "eth",
        //          "F": "0.0400000000000000",
        //          "T": 1670051332000,
        //          "f": "-0.0100000000000000",
        //          "L": "0.0100000000000000",
        //          "l": "0.0100000000000000",
        //          "t": 1670051332000
        //        }
        //      ],
        //      "u": 2285311
        //    }
        //
        object balances = this.safeValue(message, "B", new List<object>() {});
        this.parseWSBalances(balances);
        object messageHash = "balance";
        callDynamically(client as WebSocketClient, "resolve", new object[] {this.balance, messageHash});
    }

    public virtual void parseWSBalances(object balances)
    {
        //
        //    [{
        //         "a": "btc",
        //         "F": "0.0006000000000000",
        //         "T": 1657799510000,
        //         "f": "0.0006000000000000",
        //         "t": 0
        //     },
        //     {
        //         "a": "usdt",
        //         "T": 0,
        //         "L": "0.0000000000000000",
        //         "l": "-11.8705317318000000",
        //         "t": 1657799510000
        //     }]
        //
        ((IDictionary<string,object>)this.balance)["info"] = balances;
        for (object i = 0; isLessThan(i, getArrayLength(balances)); postFixIncrement(ref i))
        {
            object balance = getValue(balances, i);
            object currencyId = this.safeString(balance, "a");
            object code = this.safeCurrencyCode(currencyId);
            object account = this.account();
            object free = this.safeString(balance, "F");
            object used = this.safeString(balance, "L");
            object balanceUpdateTime = this.safeInteger(balance, "T", 0);
            object lockBalanceUpdateTime = this.safeInteger(balance, "t", 0);
            object updateFree = !isEqual(balanceUpdateTime, 0);
            object updateUsed = !isEqual(lockBalanceUpdateTime, 0);
            if (isTrue(isTrue(updateFree) || isTrue(updateUsed)))
            {
                if (isTrue(updateFree))
                {
                    ((IDictionary<string,object>)account)["free"] = free;
                }
                if (isTrue(updateUsed))
                {
                    ((IDictionary<string,object>)account)["used"] = used;
                }
                ((IDictionary<string,object>)this.balance)[(string)code] = account;
            }
        }
        this.balance = this.safeBalance(this.balance);
    }

    public async override Task<object> watchOrders(object symbol = null, object since = null, object limit = null, object parameters = null)
    {
        /**
        * @method
        * @name bitrue#watchOrders
        * @description watches information on user orders
        * @see https://github.com/Bitrue-exchange/Spot-official-api-docs#order-update
        * @param {string[]} symbols unified symbols of the market to watch the orders for
        * @param {int} [since] timestamp in ms of the earliest order
        * @param {int} [limit] the maximum amount of orders to return
        * @param {object} [params] extra parameters specific to the exchange API endpoint
        * @returns {object} A dictionary of [order structure]{@link https://docs.ccxt.com/#/?id=order-structure} indexed by market symbols
        */
        parameters ??= new Dictionary<string, object>();
        await this.loadMarkets();
        if (isTrue(!isEqual(symbol, null)))
        {
            object market = this.market(symbol);
            symbol = getValue(market, "symbol");
        }
        object url = await this.authenticate();
        object messageHash = "orders";
        object message = new Dictionary<string, object>() {
            { "event", "sub" },
            { "params", new Dictionary<string, object>() {
                { "channel", "user_order_update" },
            } },
        };
        object request = this.deepExtend(message, parameters);
        object orders = await this.watch(url, messageHash, request, messageHash);
        if (isTrue(this.newUpdates))
        {
            limit = callDynamically(orders, "getLimit", new object[] {symbol, limit});
        }
        return this.filterBySymbolSinceLimit(orders, symbol, since, limit, true);
    }

    public virtual void handleOrder(WebSocketClient client, object message)
    {
        //
        //    {
        //        "e": "ORDER",
        //        "i": 16122802798,
        //        "E": 1657882521876,
        //        "I": "302623154710888464",
        //        "u": 1814396,
        //        "s": "btcusdt",
        //        "S": 2,
        //        "o": 1,
        //        "q": "0.0005",
        //        "p": "60000",
        //        "X": 0,
        //        "x": 1,
        //        "z": "0",
        //        "n": "0",
        //        "N": "usdt",
        //        "O": 1657882521876,
        //        "L": "0",
        //        "l": "0",
        //        "Y": "0"
        //    }
        //
        object parsed = this.parseWsOrder(message);
        if (isTrue(isEqual(this.orders, null)))
        {
            object limit = this.safeInteger(this.options, "ordersLimit", 1000);
            this.orders = new ArrayCacheBySymbolById(limit);
        }
        object orders = this.orders;
        callDynamically(orders, "append", new object[] {parsed});
        object messageHash = "orders";
        callDynamically(client as WebSocketClient, "resolve", new object[] {this.orders, messageHash});
    }

    public override object parseWsOrder(object order, object market = null)
    {
        //
        //    {
        //        "e": "ORDER",
        //        "i": 16122802798,
        //        "E": 1657882521876,
        //        "I": "302623154710888464",
        //        "u": 1814396,
        //        "s": "btcusdt",
        //        "S": 2,
        //        "o": 1,
        //        "q": "0.0005",
        //        "p": "60000",
        //        "X": 0,
        //        "x": 1,
        //        "z": "0",
        //        "n": "0",
        //        "N": "usdt",
        //        "O": 1657882521876,
        //        "L": "0",
        //        "l": "0",
        //        "Y": "0"
        //    }
        //
        object timestamp = this.safeInteger(order, "E");
        object marketId = this.safeStringUpper(order, "s");
        object typeId = this.safeString(order, "o");
        object sideId = this.safeInteger(order, "S");
        // 1: buy
        // 2: sell
        object side = ((bool) isTrue((isEqual(sideId, 1)))) ? "buy" : "sell";
        object statusId = this.safeString(order, "X");
        object feeCurrencyId = this.safeString(order, "N");
        return this.safeOrder(new Dictionary<string, object>() {
            { "info", order },
            { "id", this.safeString(order, "i") },
            { "clientOrderId", this.safeString(order, "c") },
            { "timestamp", timestamp },
            { "datetime", this.iso8601(timestamp) },
            { "lastTradeTimestamp", this.safeInteger(order, "T") },
            { "symbol", this.safeSymbol(marketId, market) },
            { "type", this.parseWsOrderType(typeId) },
            { "timeInForce", null },
            { "postOnly", null },
            { "side", side },
            { "price", this.safeString(order, "p") },
            { "triggerPrice", null },
            { "amount", this.safeString(order, "q") },
            { "cost", this.safeString(order, "Y") },
            { "average", null },
            { "filled", this.safeString(order, "z") },
            { "remaining", null },
            { "status", this.parseWsOrderStatus(statusId) },
            { "fee", new Dictionary<string, object>() {
                { "currency", this.safeCurrencyCode(feeCurrencyId) },
                { "cost", this.safeNumber(order, "n") },
            } },
        }, market);
    }

    public async override Task<object> watchOrderBook(object symbol, object limit = null, object parameters = null)
    {
        parameters ??= new Dictionary<string, object>();
        await this.loadMarkets();
        object market = this.market(symbol);
        symbol = getValue(market, "symbol");
        object messageHash = add("orderbook:", symbol);
        object marketIdLowercase = ((string)getValue(market, "id")).ToLower();
        object channel = add(add("market_", marketIdLowercase), "_simple_depth_step0");
        object url = getValue(getValue(getValue(this.urls, "api"), "ws"), "public");
        object message = new Dictionary<string, object>() {
            { "event", "sub" },
            { "params", new Dictionary<string, object>() {
                { "cb_id", marketIdLowercase },
                { "channel", channel },
            } },
        };
        object request = this.deepExtend(message, parameters);
        return await this.watch(url, messageHash, request, messageHash);
    }

    public virtual void handleOrderBook(WebSocketClient client, object message)
    {
        //
        //     {
        //         "channel": "market_ethbtc_simple_depth_step0",
        //         "ts": 1670056708670,
        //         "tick": {
        //             "buys": [
        //                 [
        //                     "0.075170",
        //                     "67.153"
        //                 ],
        //                 [
        //                     "0.075169",
        //                     "17.195"
        //                 ],
        //                 [
        //                     "0.075166",
        //                     "29.788"
        //                 ],
        //             ]
        //              "asks": [
        //                 [
        //                     "0.075171",
        //                     "0.256"
        //                 ],
        //                 [
        //                     "0.075172",
        //                     "0.160"
        //                 ],
        //             ]
        //         }
        //     }
        //
        object channel = this.safeString(message, "channel");
        object parts = ((string)channel).Split(new [] {((string)"_")}, StringSplitOptions.None).ToList<object>();
        object marketId = this.safeStringUpper(parts, 1);
        object market = this.safeMarket(marketId);
        object symbol = getValue(market, "symbol");
        object timestamp = this.safeInteger(message, "ts");
        object tick = this.safeValue(message, "tick", new Dictionary<string, object>() {});
        if (!isTrue((inOp(this.orderbooks, symbol))))
        {
            ((IDictionary<string,object>)this.orderbooks)[(string)symbol] = this.orderBook();
        }
        object orderbook = getValue(this.orderbooks, symbol);
        object snapshot = this.parseOrderBook(tick, symbol, timestamp, "buys", "asks");
        (orderbook as IOrderBook).reset(snapshot);
        object messageHash = add("orderbook:", symbol);
        callDynamically(client as WebSocketClient, "resolve", new object[] {orderbook, messageHash});
    }

    public virtual object parseWsOrderType(object typeId)
    {
        object types = new Dictionary<string, object>() {
            { "1", "limit" },
            { "2", "market" },
            { "3", "limit" },
        };
        return this.safeString(types, typeId, typeId);
    }

    public virtual object parseWsOrderStatus(object status)
    {
        object statuses = new Dictionary<string, object>() {
            { "0", "open" },
            { "1", "open" },
            { "2", "closed" },
            { "3", "open" },
            { "4", "canceled" },
            { "7", "open" },
        };
        return this.safeString(statuses, status, status);
    }

    public virtual void handlePing(WebSocketClient client, object message)
    {
        this.spawn(this.pong, new object[] { client, message});
    }

    public async virtual Task pong(WebSocketClient client, object message)
    {
        //
        //     {
        //         "ping": 1670057540627
        //     }
        //
        object time = this.safeInteger(message, "ping");
        object pong = new Dictionary<string, object>() {
            { "pong", time },
        };
        await client.send(pong);
    }

    public override void handleMessage(WebSocketClient client, object message)
    {
        if (isTrue(inOp(message, "channel")))
        {
            this.handleOrderBook(client as WebSocketClient, message);
        } else if (isTrue(inOp(message, "ping")))
        {
            this.handlePing(client as WebSocketClient, message);
        } else
        {
            object eventVar = this.safeString(message, "e");
            object handlers = new Dictionary<string, object>() {
                { "BALANCE", this.handleBalance },
                { "ORDER", this.handleOrder },
            };
            object handler = this.safeValue(handlers, eventVar);
            if (isTrue(!isEqual(handler, null)))
            {
                DynamicInvoker.InvokeMethod(handler, new object[] { client, message});
            }
        }
    }

    public async virtual Task<object> authenticate(object parameters = null)
    {
        parameters ??= new Dictionary<string, object>();
        object listenKey = this.safeValue(this.options, "listenKey");
        if (isTrue(isEqual(listenKey, null)))
        {
            object response = await this.openPrivatePostPoseidonApiV1ListenKey(parameters);
            //
            //     {
            //         "msg": "succ",
            //         "code": 200,
            //         "data": {
            //             "listenKey": "7d1ec51340f499d85bb33b00a96ef680bda28869d5c3374a444c5ca4847d1bf0"
            //         }
            //     }
            //
            object data = this.safeValue(response, "data", new Dictionary<string, object>() {});
            object key = this.safeString(data, "listenKey");
            ((IDictionary<string,object>)this.options)["listenKey"] = key;
            ((IDictionary<string,object>)this.options)["listenKeyUrl"] = add(add(getValue(getValue(getValue(this.urls, "api"), "ws"), "private"), "/stream?listenKey="), key);
            object refreshTimeout = this.safeInteger(this.options, "listenKeyRefreshRate", 1800000);
            this.delay(refreshTimeout,  this.keepAliveListenKey);
        }
        return getValue(this.options, new object[] { "listenKeyUrl"});
    }

    public async virtual Task keepAliveListenKey(object parameters = null)
    {
        parameters ??= new Dictionary<string, object>();
        object listenKey = this.safeString(this.options, "listenKey");
        object request = new Dictionary<string, object>() {
            { "listenKey", listenKey },
        };
        try
        {
            await this.openPrivatePutPoseidonApiV1ListenKeyListenKey(this.extend(request, parameters));
        } catch(Exception error)
        {
            ((IDictionary<string,object>)this.options)["listenKey"] = null;
            ((IDictionary<string,object>)this.options)["listenKeyUrl"] = null;
            return;
        }
        object refreshTimeout = this.safeInteger(this.options, "listenKeyRefreshRate", 1800000);
        this.delay(refreshTimeout, this.keepAliveListenKey);
    }
}
