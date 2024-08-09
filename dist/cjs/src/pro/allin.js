'use strict';

var allin$1 = require('../allin.js');
var errors = require('../base/errors.js');
var Cache = require('../base/ws/Cache.js');
var sha256 = require('../static_dependencies/noble-hashes/sha256.js');

// ----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
class allin extends allin$1 {
    describe() {
        return this.deepExtend(super.describe(), {
            'has': {
                'ws': true,
                'watchBalance': true,
                'watchLiquidations': false,
                'watchLiquidationsForSymbols': false,
                'watchMyLiquidations': false,
                'watchMyLiquidationsForSymbols': false,
                'watchBidsAsks': false,
                'watchMyTrades': false,
                'watchOHLCV': true,
                'watchOHLCVForSymbols': false,
                'watchOrderBook': true,
                'watchOrderBookForSymbols': false,
                'watchOrders': true,
                'watchOrdersForSymbols': false,
                'watchPositions': false,
                'watchTicker': true,
                'watchTickers': false,
                'watchTrades': true,
                'watchTradesForSymbols': false,
            },
            'urls': {
                'test': {
                    'ws': {
                        'spot': 'wss://ws.allintest.pro/ws',
                        'future': 'wss://api.allintest.pro/futures/wsf',
                        'swap': 'wss://api.allintest.pro/futures/wsf',
                    },
                },
                'api': {
                    'ws': {
                        'spot': 'wss://ws.allintest.pro/ws',
                        'future': 'wss://api.allintest.pro/futures/wsf',
                        'swap': 'wss://api.allintest.pro/futures/wsf',
                    },
                },
                'doc': 'https://allinexchange.github.io/spot-docs/v1/en/#verified-api',
            },
            'streaming': {
                'ping': this.ping,
                'keepAlive': 27000,
            },
            'options': {
                'returnRateLimits': false,
            },
        });
    }
    async watchOrderBook(symbol, limit = 50, params = {}) {
        /**
         * @method
         * @name alkin#watchOrderBook
         * @description watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int} [limit] the maximum amount of order book entries to return
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @see https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
         */
        // const response = { 'id': 100,
        //     'method': 'update.depth',
        //     'result': { 'data':
        //         { 'asks': [ { 'price': '68000.0', 'quantity': '0.357100' },
        //             { 'price': '68123.5', 'quantity': '0.230000' } ],
        //         'bids': [ { 'price': '67890.9', 'quantity': '0.002000' },
        //             { 'price': '67890.4', 'quantity': '0.001000' },
        //             { 'price': '65000.2', 'quantity': '0.300000' },
        //             { 'price': '62000.0', 'quantity': '1.999000' },
        //             { 'price': '60000.0', 'quantity': '1.100000' },
        //             { 'price': '8850.2', 'quantity': '0.200000' } ],
        //         'symbol': 'BTC-USDT',
        //         'timestamp': 1720856594882,
        //         'topic': 'depth:step1:BTC-USDT',
        //         'tpp': 7 },
        //     'merge': 'step1' },
        //     'error': null };
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' watchOrderBook() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const marketId = market['id'];
        let type_ = undefined;
        let request = undefined;
        let merge = undefined;
        if (market['spot']) {
            type_ = 'spot';
            merge = 'step0';
            request = {
                'method': 'subscribe.depth',
                'params': {
                    'market': marketId,
                    'merge': merge,
                },
            };
        }
        else {
            merge = '0';
            type_ = 'future';
            request = {
                'method': 'subscribe.depth',
                'params': {
                    'market': marketId,
                    'merge': merge,
                },
            };
        }
        const url = this.urls['api']['ws'][type_];
        const reqId = this.requestId();
        const messageHash = 'depth:' + ':' + marketId; // 'topic': 'depth:step1:BTC-USDT'
        request['id'] = reqId;
        const orderbook = await this.watch(url, messageHash, request, messageHash, true);
        return orderbook.limit();
    }
    async watchTicker(symbol, params = {}) {
        /**
         * @method
         * @name allin#watchTicker
         * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://allinexchange.github.io/spot-docs/v1/en/#websocket-guide
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        // const response = {
        //     'id': 1,
        //     'method': 'update.quote',
        //     'error': null, // 错误响应
        //     'result': {
        //         'data': {
        //             'symbol': 'BTC-USDT',
        //             'timestamp': 1673417148,
        //             'topic': 'quotes',
        //             'price': '100.21', // 价格
        //             'volume': '0',
        //             'amount': '0',
        //             'high': '100.21',
        //             'low': '100.21',
        //             'change': '0',
        //             'tpp': 1,
        //             'l_price': '100.21',
        //         }, // 返回数据
        //         'market': 'BTC-USDT',
        //     }, // 结果集
        // };
        await this.loadMarkets();
        const market = this.market(symbol);
        const symbolId = market['id'];
        const messageHash = 'update.quote:' + symbolId;
        const type_ = 'spot';
        const url = this.urls['api']['ws'][type_];
        const request = {
            'method': 'subscribe.quote',
            'params': {
                'market': symbolId,
            },
            'id': this.requestId(),
        };
        const ticker = await this.watch(url, messageHash, request, messageHash, true);
        return ticker;
    }
    async watchTickers(symbols = undefined, params = {}) {
        /**
         * @method
         * @name allin#watchTickers
         * @description watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for all markets of a specific list
         * @see https://allinexchange.github.io/spot-docs/v1/en/#websocket-guide
         * @param {string[]} symbols unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        const messageHash = 'update.quotes';
        const type_ = 'spot';
        const url = this.urls['api']['ws'][type_];
        const request = {
            'method': 'subscribe.quotes',
            'params': {},
            'id': this.requestId(),
        };
        const tickers = await this.watch(url, messageHash, request, messageHash, true);
        return this.filterByArray(tickers, 'symbol', symbols);
    }
    async watchBalance(params = {}) {
        /**
         * @method
         * @name allin#watchBalance
         * @description watch balance and get the amount of funds available for trading or funds locked in orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {boolean} [params.portfolioMargin] set to true if you would like to watch the balance of a portfolio margin account
         * @see https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
         */
        await this.loadMarkets();
        let currentType = this.safeString(params, 'defaultType', undefined);
        if (!currentType) {
            currentType = this.options['defaultType'];
        }
        const url = this.urls['api']['ws'][currentType];
        await this.authenticate(url);
        const messageHash = 'update.asset';
        const request = {
            'method': 'subscribe.asset',
            'params': {},
            'id': this.requestId(),
        };
        const balances = await this.watch(url, messageHash, request, messageHash);
        return balances;
    }
    async watchPositions(symbols = undefined, since = undefined, limit = undefined, params = {}) {
        let currentType = this.safeString(params, 'defaultType', undefined);
        if (!currentType) {
            currentType = this.options['defaultType'];
        }
        await this.loadMarkets();
        if (currentType === 'future' || currentType === 'swap') {
            const messageHash = 'update.position';
            const url = this.urls['api']['ws'][currentType];
            await this.authenticate(url);
            const request = {
                'method': 'subscribe.position',
                'id': this.requestId(),
                'params': {},
            };
            const positions = await this.watch(url, messageHash, request, messageHash);
            return positions;
        }
        else {
            throw new errors.BaseError(currentType + 'market type no position');
        }
    }
    async watchOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name allin#watchOrders
         * @description watches information on multiple orders made by the user
         * @see https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of order structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure
         */
        const currentType = this.safeString(params, 'defaultType', undefined);
        let type_ = undefined;
        let marketId = undefined;
        let messageHash = undefined;
        if (symbol === undefined && currentType === 'spot') {
            throw new errors.ArgumentsRequired(this.id + ' watchOrderBook() requires a symbol argument');
        }
        else if (symbol !== undefined) {
            await this.loadMarkets();
            const market = this.market(symbol);
            marketId = market['id'];
            type_ = market['type'];
            messageHash = 'orders:' + marketId;
        }
        else {
            type_ = currentType;
            messageHash = 'orders:__ALL__';
        }
        const url = this.urls['api']['ws'][type_];
        await this.authenticate(url);
        let request = undefined;
        if (type_ === 'spot') {
            request = {
                'method': 'subscribe.orders',
                'params': {},
                'id': this.requestId(),
            };
        }
        else {
            request = {
                'method': 'subscribe.order',
                'params': {},
                'id': this.requestId(),
            };
        }
        if (marketId !== undefined) {
            request['params']['market'] = marketId;
        }
        const orders = await this.watch(url, messageHash, request, messageHash, true);
        return orders;
    }
    async watchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        /**
         * @method
         * @name allin#watchOHLCV
         * @description watches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         * @see https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
         */
        await this.loadMarkets();
        const market = this.market(symbol);
        const marketId = market['id'];
        const type_ = market['type'];
        let interval = this.safeString(this.timeframes, timeframe, timeframe);
        const url = this.urls['api']['ws'][type_];
        const reqId = this.requestId();
        if (!market['spot']) {
            interval = String(interval).toLowerCase();
        }
        const messageHash = 'kline:' + interval + ':' + marketId;
        const request = {
            'method': 'subscribe.kline',
            'params': {
                'period': interval,
                'market': marketId,
            },
            'id': reqId,
        };
        const ohlcv = await this.watch(url, messageHash, request, messageHash, true);
        return this.filterBySinceLimit(ohlcv, since, limit, 0, true);
    }
    async authenticate(url, params = {}) {
        this.checkRequiredCredentials();
        const messageHash = 'sign';
        let currentType = this.safeString(params, 'defaultType', undefined);
        if (!currentType) {
            currentType = this.options['defaultType'];
        }
        const client = this.client(url);
        const future = client.future(messageHash);
        const authenticated = this.safeValue(client.subscriptions, messageHash);
        let request = {};
        if (authenticated === undefined) {
            const nonce = this.nonce().toString();
            const ts = nonce;
            const client_id = this.apiKey;
            const s = 'client_id=' + client_id + '&nonce=' + nonce + '&ts=' + ts;
            const v = this.hmac(this.encode(s), this.encode(this.secret), sha256.sha256);
            request = { 'method': 'sign',
                'id': this.requestId(),
                'params': { 'client_id': client_id,
                    'ts': ts,
                    'nonce': nonce,
                    'sign': v } };
            this.watch(url, messageHash, request, messageHash);
        }
        return await future;
    }
    handleOrderBook(client, message) {
        // const response = { 'id': 100,
        //     'method': 'update.depth',
        //     'result': { 'data':
        //         { 'asks': [ { 'price': '68000.0', 'quantity': '0.357100' },
        //             { 'price': '68123.5', 'quantity': '0.230000' } ],
        //            'bids': [ { 'price': '67890.9', 'quantity': '0.002000' },
        //             { 'price': '67890.4', 'quantity': '0.001000' },
        //             { 'price': '65000.2', 'quantity': '0.300000' },
        //             { 'price': '62000.0', 'quantity': '1.999000' },
        //             { 'price': '60000.0', 'quantity': '1.100000' },
        //             { 'price': '8850.2', 'quantity': '0.200000' } ],
        //              'symbol': 'BTC-USDT',
        //              'timestamp': 1721550307627,
        //              'topic': 'depth:step1:BTC-USDT',
        //              'tpp': 7 },
        //          'merge': 'step1' },
        //     'error': null };
        // future
        // {
        //     "id":0,
        //     "method":"update.depth",
        //     "result":{
        //       "asks":[
        //         [
        //           "36341.6",
        //           "0.0444"
        //         ]
        //       ],
        //       "bids":[
        //         [
        //           "36341.25",
        //           "0.0511"
        //         ]
        //       ],
        //       "index_price":"36612.36",
        //       "last":"36341.59",
        //       "market":"BTCUSDT",
        //       "sign_price":"36589.76",
        //       "time":1699944061967
        //     },
        //     "error":null
        //   }
        const result = this.safeDict(message, 'result');
        let marketId = this.safeString(result, 'market', undefined);
        let timestamp = undefined;
        let abData = undefined;
        if (marketId === undefined) {
            // spot
            abData = this.safeDict(result, 'data');
            marketId = this.safeString(abData, 'symbol');
            timestamp = this.safeInteger(abData, 'timestamp');
        }
        else {
            // future
            abData = result;
            marketId = this.safeString(abData, 'market');
            timestamp = this.safeInteger(abData, 'time');
        }
        const market = this.safeMarket(marketId, undefined, undefined);
        const messageHash = 'depth:' + ':' + marketId;
        const symbol = market['symbol'];
        if (!(symbol in this.orderbooks)) {
            this.orderbooks[symbol] = this.orderBook();
            this.orderbooks[symbol]['symbol'] = symbol;
        }
        const orderbook = this.orderbooks[symbol];
        let snapshot = undefined;
        if (market['spot']) {
            snapshot = this.parseOrderBook(abData, symbol, timestamp, 'bids', 'asks', 'price', 'quantity');
        }
        else {
            snapshot = this.parseOrderBook(abData, symbol, timestamp, 'bids', 'asks', 0, 1);
        }
        orderbook.reset(snapshot);
        this.orderbooks[symbol] = orderbook;
        client.resolve(orderbook, messageHash);
    }
    handleFulls(datas) {
        const bookside = [];
        for (let i = 0; i < datas.length; i++) {
            bookside.push(this.safeFloat(datas, 'price'), this.safeFloat(datas, 'quantity'));
        }
    }
    handleDelta(bookside, delta) {
        const price = this.safeFloat(delta, 'price');
        const amount = this.safeFloat(delta, 'quantity');
        bookside.store(price, amount);
    }
    handleDeltas(bookside, deltas) {
        for (let i = 0; i < deltas.length; i++) {
            this.handleDelta(bookside, deltas[i]);
        }
    }
    handleTicker(client, message) {
        // const ticker = {
        //     'id': 1,
        //     'method': 'update.quote',
        //     'error': null,
        //     'result': {
        //         'data': {
        //             'symbol': 'BTC-USDT',
        //             'timestamp': 1673417148,
        //             'topic': 'quotes',
        //             'price': '100.21',
        //             'volume': '0',
        //             'amount': '0',
        //             'high': '100.21',
        //             'low': '100.21',
        //             'change': '0',
        //             'tpp': 1,
        //             'l_price': '100.21',
        //         },
        //         'market': 'BTC-USDT',
        //     },
        // };
        // future
        // {
        //     "id":0,
        //     "method":"update.state",
        //     "result": {
        //       "1000SHIBUSDT": {
        //         "market": "1000SHIBUSDT",
        //         "amount": "35226256.573504",
        //         "high":"0.009001",
        //         "last": "0.008607",
        //         "low": "0.008324",
        //         "open": "0.008864",
        //         "period": 86400,
        //         "volume":"4036517772",
        //         "change": "-0.0289936823104693",
        //         "funding_time": 79,
        //         "position_amount": "0",
        //         "funding_rate_last": "0.00092889",
        //         "funding_rate_next":"0.00078062",
        //         "funding_rate_predict": "0.00059084",
        //         "insurance": "12920.37897885999447286856",
        //         "sign_price": "0.008607",
        //         "index_price": "0.008606",
        //         "sell_total":"46470921",
        //         "buy_total": "43420303"
        //       }
        //     },
        //     "error":null
        //   }
        const result = this.safeDict(message, 'result');
        const tickerData = this.safeDict(result, 'data');
        if (tickerData === undefined) {
            // future
            const keys = Object.keys(result);
            for (let i = 0; i < keys.length; i++) {
                const symbolId = keys[i];
                const messageHash = 'update.quote:' + symbolId;
                const market = this.safeMarket(symbolId);
                const symbol = market['symbol'];
                const data = result[symbolId];
                const ticker = this.parseTicker(data, market);
                this.tickers[symbol] = ticker;
                client.resolve(ticker, messageHash);
            }
        }
        else {
            // spot
            const symbolId = this.safeString(tickerData, 'symbol');
            const market = this.safeMarket(symbolId, undefined, undefined);
            tickerData['timestamp'] = this.safeTimestamp(tickerData, 'timestamp');
            const symbol = market['symbol'];
            const messageHash = 'update.quote:' + symbolId;
            const ticker = this.parseTicker(tickerData, market);
            this.tickers[symbol] = ticker;
            client.resolve(ticker, messageHash);
        }
    }
    handleTickers(client, message) {
        // const ticker = {
        //     'id': 1,
        //     'method': 'update.quotes',
        //     'error': null,
        //     'result': {
        //         'data': {
        //             'symbol': 'BTC-USDT',
        //             'timestamp': 1673417148,
        //             'topic': 'quotes',
        //             'price': '100.21',
        //             'volume': '0',
        //             'amount': '0',
        //             'high': '100.21',
        //             'low': '100.21',
        //             'change': '0',
        //             'tpp': 1,
        //             'l_price': '100.21',
        //         },
        //         'market': 'BTC-USDT',
        //     },
        // };
        const result = this.safeDict(message, 'result');
        const tickerData = this.safeDict(result, 'data');
        const symbolId = this.safeString(tickerData, 'symbol');
        const market = this.safeMarket(symbolId, undefined, undefined);
        tickerData['timestamp'] = this.safeTimestamp(tickerData, 'timestamp');
        const symbol = market['symbol'];
        const messageHash = 'update.quotes';
        const ticker = this.parseTicker(tickerData, market);
        this.tickers[symbol] = ticker;
        client.resolve(this.tickers, messageHash);
    }
    handleOHLCV(client, message) {
        // const message = {
        //     'id': 1,
        //     'method': 'update.kline',
        //     'error': null, // 错误响应
        //     'result': {
        //         'data': {
        //             'symbol': 'BTC-USDT',
        //             'ticks': [
        //                 {
        //                     'close': '101.000000',
        //                     'high': '101.000000',
        //                     'low': '101.000000',
        //                     'open': '101.000000',
        //                     'timestamp': 1672910460,
        //                     'volume': '0',
        //                 },
        //             ],
        //             'timestamp': 1721551500,
        //             'topic': 'kline:1Min:BTC-USDT',
        //             'tpp': 1,
        //             'type': '1Min',
        //         }, // 返回数据
        //         'period': '1Min',
        //     }, // 结果集
        // };
        // future
        // const future = { 'id': 0,
        //     'method':
        //     'update.kline',
        //     'result': { 'data': [ [ 1723034940, '65517.74', '65517.74', '65517.74', '65517.74', '0', '0', 'BTCUSDT' ] ],
        //         'market': 'BTCUSDT',
        //         'period': '1min' },
        //     'error': null };
        const result = this.safeDict(message, 'result');
        if (result === undefined) {
            return;
        }
        const klineData = this.safeDict(result, 'data');
        let marketId = this.safeString2(klineData, 'symbol', 'market', undefined);
        if (marketId === undefined) {
            // future
            marketId = this.safeString(result, 'market');
        }
        const market = this.safeMarket(marketId, undefined, undefined);
        const symbol = market['symbol'];
        let messageHash = undefined;
        let ticks = undefined;
        let timeframeId = undefined;
        let timeframe = undefined;
        if (market['spot']) {
            ticks = this.safeList(klineData, 'ticks');
            timeframeId = this.safeString(klineData, 'type');
            messageHash = this.safeString(klineData, 'topic');
            timeframe = this.findTimeframe(timeframeId);
        }
        else {
            ticks = this.safeList(result, 'data');
            timeframeId = this.safeString(result, 'period');
            timeframe = this.parseLowerTimeframe(timeframeId);
            messageHash = 'kline:' + String(timeframeId).toLowerCase() + ':' + marketId;
        }
        const ohlcvsByTimeframe = this.safeValue(this.ohlcvs, symbol);
        if (ohlcvsByTimeframe === undefined) {
            this.ohlcvs[symbol] = {};
        }
        let stored = this.safeValue(ohlcvsByTimeframe, timeframe);
        if (stored === undefined) {
            const limit = this.safeInteger(this.options, 'OHLCVLimit', 1000);
            stored = new Cache.ArrayCacheByTimestamp(limit);
            this.ohlcvs[symbol][timeframe] = stored;
        }
        for (let i = 0; i < ticks.length; i++) {
            const tick = ticks[i];
            const parsed = this.parseOHLCV(tick, market);
            stored.append(parsed);
        }
        client.resolve(stored, messageHash);
    }
    handleOrder(client, message) {
        // const orderMessage = {
        //     'id': 0,
        //     'method': 'update.orders',
        //     'result': {
        //         'frm': 'USDT',
        //         'left': '0.100000',
        //         'match_amt': '0',
        //         'match_price': '60000.21',
        //         'match_qty': '0',
        //         'order_id': '102',
        //         'order_sub_type': 0,
        //         'order_type': 1,
        //         'price': '60000.21',
        //         'quantity': '0.100000',
        //         'real_order_id': '102',
        //         'side': 1,
        //         'status': 2,
        //         'stop_price': '0',
        //         'symbol': 'BTC-USDT',
        //         'ticker_id': 7,
        //         'timestamp': 1721031092,
        //         'to': 'BTC',
        //         'topic': 'orders:BTC-USDT',
        //         'tpp': 7,
        //         'trade_no': '40545373062180505095221',
        //     },
        //     'error': null,
        // };
        // future
        // const futureOrder = { 'id': 0,
        //     'method': 'update.order',
        //     'result': { 'order_id': 5034339,
        //         'position_id': 0,
        //         'market': 'BTCUSDT',
        //         'type': 1,
        //         'side': 1,
        //         'left': '0.0000',
        //         'amount': '0.0400',
        //         'filled': '0.04',
        //         'deal_fee': '0.9583',
        //         'price': '56000',
        //         'avg_price': '59898.36',
        //         'deal_stock': '2395.9344',
        //         'position_type': 2,
        //         'leverage': '100',
        //         'update_time': 1723131121.719404,
        //         'create_time': 1723131121.719389,
        //         'status': 3,
        //         'stop_loss_price': '-',
        //         'take_profit_price': '-' },
        //     'error': None };
        const result = this.safeDict(message, 'result');
        const allinSymbol = this.safeString2(result, 'symbol', 'market');
        const market = this.safeMarket(allinSymbol);
        if (!market) {
            return;
        }
        const order = this.parseOrder(result, market);
        let messageHashAll = undefined;
        const messageHash = 'orders:' + market['id'];
        if (market['spot']) {
            messageHashAll = 'orders:__ALL__';
        }
        const safeOrder = this.safeOrder(order, market);
        client.resolve([safeOrder], messageHash);
        if (messageHashAll) {
            client.resolve([safeOrder], messageHashAll);
        }
    }
    handleBalance(client, message) {
        // {
        //     "id": 1,
        //     "method": "update.asset",
        //     "error": null, //错误响应
        //     "result": {
        //         "available": "999909.4",
        //         "freeze": "90.6",
        //         "symbol": "USDT",
        //         "topic": "accounts",
        //         "total": "1000000"
        //     } //结果集
        // }
        // future
        // {
        //     "id":0,
        //     "method":"update.asset",
        //     "result":{
        //       "USDT":{
        //         "available":"10320.9887",
        //         "frozen":"0",
        //         "margin":"16.1356",
        //         "balance_total":"10320.9887",
        //         "profit_unreal":"11.0315",
        //         "transfer":"10097.1501",
        //         "bonus":"223.8386"
        //       }
        //     },
        //     "error":null
        //   }
        const currentType = this.safeString(this.options, 'defaultType', undefined);
        const messageHash = 'update.asset';
        if (this.balance === undefined) {
            this.balance = {};
        }
        if (!this.safeDict(this.balance, 'info')) {
            this.balance['info'] = {};
        }
        if (currentType === 'spot') {
            const result = this.safeDict(message, 'result');
            const token = this.safeString(result, 'symbol');
            this.balance['info'][token] = result;
            const timestamp = this.milliseconds();
            this.balance['timestamp'] = timestamp;
            this.balance['datetime'] = this.iso8601(timestamp);
            this.balance[token] = {
                'free': this.safeString(result, 'available'),
                'total': this.safeString(result, 'total'),
                'used': this.safeString(result, 'freeze'),
            };
        }
        else {
            const originBalances = this.safeDict(message, 'result');
            const keys = Object.keys(originBalances);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const originBalance = originBalances[key];
                const symbol = key;
                const used = this.safeString(originBalance, 'frozen');
                const total = this.safeString(originBalance, 'balance_total');
                const free = this.safeString(originBalance, 'available');
                this.balance[symbol] = {
                    'free': free,
                    'used': used,
                    'total': total,
                    'debt': 0, // ???
                };
            }
        }
        this.balance = this.safeBalance(this.balance);
        client.resolve(this.balance, messageHash);
    }
    handlePositions(client, message) {
        // {
        //     "id":0,
        //     "method":"update.position",
        //     "result":{
        //       "event":1,
        //       "position":{
        //         "position_id":4784242,
        //         "create_time":1699944061.968543,
        //         "update_time":1699944061.968656,
        //         "user_id":9108,
        //         "market":"BTCUSDT",
        //         "type":2,
        //         "side":2,
        //         "amount":"0.0444",
        //         "close_left":"0.0444",
        //         "open_price":"36341.6",
        //         "open_margin":"6.4063",
        //         "margin_amount":"16.1356",
        //         "leverage":"100",
        //         "profit_unreal":"11.0184",
        //         "liq_price":"0",
        //         "mainten_margin":"0.005",
        //         "mainten_margin_amount":"8.0678",
        //         "adl_sort":1,
        //         "roe":"0.6828",
        //         "margin_ratio":"",
        //         "stop_loss_price":"-",
        //         "take_profit_price":"-"
        //       }
        //     },
        //     "error":null
        //   }
        const result = this.safeDict(message, 'result');
        const data = this.safeDict(result, 'position');
        const marketId = data['market'];
        const market = this.safeMarket(marketId);
        const messageHash = 'update.position';
        if (this.positions === undefined) {
            this.positions = new Cache.ArrayCacheBySymbolBySide();
        }
        const cache = this.positions;
        const position = this.parsePosition(data, market);
        cache.append(position);
        client.resolve([position], messageHash);
    }
    ping(client) {
        return {
            'id': this.requestId(),
            'method': 'ping',
            'params': {},
        };
    }
    handlePong(client, message) {
        client.lastPong = this.milliseconds();
        return message;
    }
    handleAuthenticate(client, message) {
        // { id: 1, method: 'sign', result: 'login success', error: null }
        const errorStr = message['error'];
        const messageHash = 'sign';
        if (!errorStr) {
            const future = this.safeValue(client.futures, messageHash);
            future.resolve(true);
        }
        else {
            const error = new errors.AuthenticationError(this.id + ' ' + this.json(errorStr));
            client.reject(error, messageHash);
            if (messageHash in client.subscriptions) {
                delete client.subscriptions[messageHash];
            }
        }
        return message;
    }
    handleErrorMessage(client, message) {
        // const response = { 'id': 100,
        //     'method': 'update.depth',
        //     'result': { 'data':
        //         { 'asks': [ { 'price': '68000.0', 'quantity': '0.357100' },
        //             { 'price': '68123.5', 'quantity': '0.230000' } ],
        //         'bids': [ { 'price': '67890.9', 'quantity': '0.002000' },
        //             { 'price': '67890.4', 'quantity': '0.001000' },
        //             { 'price': '65000.2', 'quantity': '0.300000' },
        //             { 'price': '62000.0', 'quantity': '1.999000' },
        //             { 'price': '60000.0', 'quantity': '1.100000' },
        //             { 'price': '8850.2', 'quantity': '0.200000' } ],
        //         'symbol': 'BTC-USDT',
        //         'timestamp': 1720856594882,
        //         'topic': 'depth:step1:BTC-USDT',
        //         'tpp': 7 },
        //     'merge': 'step1' },
        //     'error': null };
        // future
        // {'id': 1,
        //     'method': 'subscribe.sign',
        //     'result': None,
        //     'error': {'code': 20015, 'msg': 'system error'}
        // }
        const error = message['error'];
        if (error) {
            let code = this.safeString(error, 'code', 'default');
            let errorStr = undefined;
            if (code !== undefined) {
                errorStr = this.safeString(error, 'msg');
                this.throwExactlyMatchedException(this.exceptions['exact'], code, errorStr);
            }
            else {
                code = ' ';
                errorStr = error;
                this.throwExactlyMatchedException(this.exceptions['exact'], code, errorStr);
            }
        }
        return false;
    }
    handleMessage(client, message) {
        const error = this.safeValue(message, 'error');
        if (error) {
            this.handleErrorMessage(client, message);
        }
        // 'subscribe.depth': this.handleOrderBook,
        // 'subscribe.kline': this.handleOHLCV,
        const methodsDict = {
            'update.depth': this.handleOrderBook,
            'update.kline': this.handleOHLCV,
            'update.orders': this.handleOrder,
            'update.order': this.handleOrder,
            'update.asset': this.handleBalance,
            'ping': this.handlePong,
            'sign': this.handleAuthenticate,
            'update.quote': this.handleTicker,
            'update.quotes': this.handleTickers,
            'update.position': this.handlePositions,
        };
        const methodStr = this.safeString(message, 'method');
        const method = this.safeValue(methodsDict, methodStr);
        if (method) {
            method.call(this, client, message);
        }
    }
    requestId() {
        const requestId = this.sum(this.safeInteger(this.options, 'requestId', 0), 1);
        this.options['requestId'] = requestId;
        return requestId;
    }
}

module.exports = allin;
