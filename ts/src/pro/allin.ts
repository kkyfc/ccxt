
// ----------------------------------------------------------------------------

import allinRest from '../allin.js';
// import { Precise } from '../base/Precise.js';
import { ArgumentsRequired, AuthenticationError } from '../base/errors.js';
// import { ArrayCache, ArrayCacheByTimestamp, ArrayCacheBySymbolById, ArrayCacheBySymbolBySide } from '../base/ws/Cache.js';
import type { Int, Str, OrderBook, Balances, Order, OHLCV, Dict } from '../base/types.js';
import Client from '../base/ws/Client.js';
import { sha256 } from '../static_dependencies/noble-hashes/sha256.js';

// -----------------------------------------------------------------------------

export default class allin extends allinRest {
    describe () {
        return this.deepExtend (super.describe (), {
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
                'watchTicker': false,
                'watchTickers': false,
                'watchTrades': true,
                'watchTradesForSymbols': false,
            },
            'urls': {
                'test': {
                    'ws': {
                        'spot': 'wss://ws.allintest.pro/ws',
                        'futures': 'wss://ws.allintest.pro/ws',
                        'public': 'wss://ws.allintest.pro/ws',
                        'private': 'wss://ws.allintest.pro/ws',
                    },
                },
                'api': {
                    'ws': {
                        'spot': 'wss://ws.allintest.pro/ws',
                        'futures': 'wss://ws.allintest.pro/ws',
                        'public': 'wss://ws.allintest.pro/ws',
                        'private': 'wss://ws.allintest.pro/ws',
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

    async watchOrderBook (symbol: string, limit?: Int, params = {}): Promise<OrderBook> {
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
            throw new ArgumentsRequired (this.id + ' watchOrderBook() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketId = market['id'];
        const type_ = 'spot';
        const url = this.urls['api']['ws'][type_];
        const reqId = this.requestId ();
        const merge = 'step0';
        const request = {
            'method': 'subscribe.depth',
            'params': {
                'market': marketId,
                'merge': merge,
            },
        };
        const messageHash = 'depth:' + merge + ':' + marketId;  // 'topic': 'depth:step1:BTC-USDT'
        request['id'] = reqId;
        const orderbook = await this.watch (url, messageHash, request, messageHash, true);
        return orderbook.limit ();
    }

    async watchBalance (params?: {}): Promise<Balances> {
        /**
         * @method
         * @name allin#watchBalance
         * @description watch balance and get the amount of funds available for trading or funds locked in orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {boolean} [params.portfolioMargin] set to true if you would like to watch the balance of a portfolio margin account
         * @see https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
         */
        await this.loadMarkets ();
        const type_ = 'spot';
        const url = this.urls['api']['ws'][type_];
        await this.authenticate (url);
        const messageHash = 'update.asset';
        const request = {
            'method': 'subscribe.asset',
            'params': {},
            'id': this.requestId (),
        };
        const balances = await this.watch (url, messageHash, request, messageHash);
        return balances;
    }

    async watchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
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
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' watchOrderBook() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketId = market['id'];
        const messageHash = 'orders:' + marketId;
        const type_ = 'spot';
        const url = this.urls['api']['ws'][type_];
        await this.authenticate (url);
        const request = {
            'method': 'subscribe.orders',
            'params': {
                'market': marketId,
            },
            'id': this.requestId (),
        };
        const orders = await this.watch (url, messageHash, request, messageHash, true);
        return orders;
    }

    async watchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
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
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketId = market['id'];
        const type_ = 'spot';
        const interval = this.safeString (this.timeframes, timeframe, timeframe);
        const url = this.urls['api']['ws'][type_];
        const reqId = this.requestId ();
        const messageHash = 'kline:' + interval + ':' + marketId;
        const request = {
            'method': 'subscribe.kline',
            'params': {
                'period': interval,
                'market': marketId,
            },
            'id': reqId,
        };
        const ohlcv = await this.watch (url, messageHash, request, messageHash, true);
        return this.filterBySinceLimit (ohlcv, since, limit, 0, true);
    }

    async authenticate (url, params = {}) {
        this.checkRequiredCredentials ();
        const messageHash = 'sign';
        const client = this.client (url);
        const future = client.future (messageHash);
        const authenticated = this.safeValue (client.subscriptions, messageHash);
        let result = {};
        if (authenticated === undefined) {
            const nonce = this.nonce ().toString ();
            const ts = nonce;
            const client_id = this.apiKey;
            const s = 'client_id=' + client_id + '&nonce=' + nonce + '&ts=' + ts;
            const v = this.hmac (this.encode (s), this.encode (this.secret), sha256);
            result = { 'method': 'sign',
                'id': this.requestId (),
                'params': { 'client_id': client_id,
                    'ts': ts,
                    'nonce': nonce,
                    'sign': v }};
            this.watch (url, messageHash, result, messageHash);
        }
        return await future;
    }

    handleOrderBook (client: Client, message) {
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
        const result = this.safeDict (message, 'result');
        const abData = this.safeDict (result, 'data');
        const marketId = this.safeString (abData, 'symbol');
        const market = this.safeMarket (marketId, undefined, undefined);
        const timestamp = this.safeInteger (abData, 'timestamp');
        const messageHash = this.safeString (abData, 'topic');
        const symbol = market['symbol'];
        if (!(symbol in this.orderbooks)) {
            this.orderbooks[symbol] = this.orderBook ();
            this.orderbooks[symbol]['symbol'] = symbol;
        }
        const orderbook = this.orderbooks[symbol];
        const asks = this.safeList (abData, 'asks', []);
        const bids = this.safeList (abData, 'bids', []);
        this.handleDeltas (orderbook['asks'], asks);
        this.handleDeltas (orderbook['bids'], bids);
        orderbook['timestamp'] = timestamp;
        orderbook['datetime'] = this.iso8601 (timestamp);
        this.orderbooks[symbol] = orderbook;
        client.resolve (orderbook, messageHash);
    }

    handleDelta (bookside, delta) {
        const price = this.safeFloat (delta, 'price');
        const amount = this.safeFloat (delta, 'quantity');
        bookside.store (price, amount);
    }

    handleDeltas (bookside, deltas) {
        for (let i = 0; i < deltas.length; i++) {
            this.handleDelta (bookside, deltas[i]);
        }
    }

    handleOHLCV (client: Client, message) {
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
        //             'timestamp': 1672910460000,
        //             'topic': 'kline:1Min:BTC-USDT',
        //             'tpp': 1,
        //             'type': '1Min',
        //         }, // 返回数据
        //         'period': '1Min',
        //     }, // 结果集
        // };
        const result = this.safeDict (message, 'result');
        const klineData = this.safeDict (result, 'data');
        if (!klineData) {
            return;
        }
        // const marketId = this.safeString (klineData, 'symbol');
        // const market = this.safeMarket (marketId, undefined, undefined);
        // const timestamp = this.safeInteger (klineData, 'timestamp');
        // const messageHash = this.safeString (klineData, 'topic');
        const ticks = this.safeString (klineData, 'ticks');
        for (let i = 0; i < ticks.length; i++) {
            const tick = ticks[i];
            this.log (tick);
            // const parsed = [
            //     this.safeInteger (tick, 'timestamp'),
            //     this.safeFloat (tick, 'open'),
            //     this.safeFloat (tick, 'high'),
            //     this.safeFloat (tick, 'low'),
            //     this.safeFloat (tick, 'close'),
            //     this.safeFloat (tick, 'volume'),
            // ];
        }
    }

    handleOrder (client: Client, message) {
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
        const result = this.safeDict (message, 'result');
        const timestamp = this.safeInteger (result, 'timestamp');
        const allinOrderStatus = this.safeInteger (result, 'status');
        const allinSymbol = this.safeString (result, 'symbol');
        const market = this.safeMarket (allinSymbol);
        if (!market) {
            return;
        }
        const allinOrderType = this.forceString (this.safeInteger (result, 'order_type'));
        const allinOrderSide = this.safeInteger (result, 'side');
        const messageHash = this.safeString (result, 'topic');
        const cost = this.safeString (result, 'match_amt', '0');
        const order = {
            'id': this.safeString (result, 'order_id'),
            'clientOrderId': this.safeString (result, 'trade_no'),
            'datetime': this.iso8601 (timestamp),
            'timestamp': timestamp,
            'lastTradeTimestamp': timestamp,
            'lastUpdateTimestamp': timestamp,
            'status': this.parseOrderStatus (allinOrderStatus),
            'symbol': market['symbol'],
            'type': this.parseOrderType (allinOrderType),
            'timeInForce': undefined,
            'side': this.parseOrderSide (allinOrderSide),
            'price': this.safeFloat (result, 'price'),
            'average': this.safeFloat (result, 'match_price'),
            'amount': this.safeFloat (result, 'quantity'),
            'filled': this.safeFloat (result, 'match_qty'),
            'remaining': this.safeFloat (result, 'left'),
            'stopPrice': undefined,
            'triggerPrice': undefined,
            'takeProfitPrice': undefined,
            'stopLossPrice': undefined,
            'cost': cost,
            'trades': [],
            'fee': undefined,
            'reduceOnly': undefined,
            'postOnly': undefined,
            'info': result,
        };
        const safeOrder = this.safeOrder (order, market);
        client.resolve (safeOrder, messageHash);
    }

    handleBalance (client: Client, message) {
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
        const messageHash = 'update.asset';
        const result = this.safeDict (message, 'result');
        const token = this.safeString (result, 'symbol');
        if (this.balance === undefined) {
            this.balance = {};
        }
        if (this.balance['info'] === undefined) {
            this.balance['info'] = {};
        }
        this.balance['info'][token] = result;
        const timestamp = this.now ();
        this.balance['timestamp'] = timestamp;
        this.balance['datetime'] = this.iso8601 (timestamp);
        this.balance[token] = {
            'free': this.safeString (result, 'available'),
            'total': this.safeString (result, 'total'),
            'used': this.safeString (result, 'freeze'),
        };
        this.balance = this.safeBalance (this.balance);
        client.resolve (this.balance, messageHash);
    }

    ping (client) {
        return {
            'id': this.requestId (),
            'method': 'ping',
            'params': {},
        };
    }

    handlePong (client, message) {
        client.lastPong = this.now ();
        return message;
    }

    handleAuthenticate (client: Client, message) {
        // { id: 1, method: 'sign', result: 'login success', error: null }
        const errorStr = message['error'];
        const messageHash = 'sign';
        if (!errorStr) {
            const future = this.safeValue (client.futures, messageHash);
            future.resolve (true);
        } else {
            const error = new AuthenticationError (this.id + ' ' + this.json (errorStr));
            client.reject (error, messageHash);
            if (messageHash in client.subscriptions) {
                delete client.subscriptions[messageHash];
            }
        }
        return message;
    }

    handleErrorMessage (client: Client, message): boolean {
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
        const error = message['error'];
        if (error) {
            return true;
        }
        return false;
    }

    handleMessage (client: Client, message) {
        const error = this.safeValue (message, 'error');
        this.log ('message: ', message);
        if (error) {
            this.handleErrorMessage (client, message);
        }
        const methodsDict: Dict = {
            'update.depth': this.handleOrderBook,
            'subscribe.depth': this.handleOrderBook,
            'subscribe.kline': this.handleOHLCV,
            'update.kline': this.handleOHLCV,
            'update.orders': this.handleOrder,
            'update.asset': this.handleBalance,
            'ping': this.handlePong,
            'sign': this.handleAuthenticate,
            'subscribe.quote': undefined,
        };
        const methodStr = this.safeString (message, 'method');
        const method = this.safeValue (methodsDict, methodStr);
        if (method) {
            method.call (this, client, message);
        }
    }

    requestId () {
        const requestId = this.sum (this.safeInteger (this.options, 'requestId', 0), 1);
        this.options['requestId'] = requestId;
        return requestId;
    }
}
