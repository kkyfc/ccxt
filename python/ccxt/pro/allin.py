# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

import ccxt.async_support
from ccxt.async_support.base.ws.cache import ArrayCacheByTimestamp
import hashlib
from ccxt.base.types import Balances, Int, Order, OrderBook, Str
from ccxt.async_support.base.ws.client import Client
from typing import List
from ccxt.base.errors import ExchangeError
from ccxt.base.errors import AuthenticationError
from ccxt.base.errors import ArgumentsRequired


class allin(ccxt.async_support.allin):

    def describe(self):
        return self.deep_extend(super(allin, self).describe(), {
            'has': {
                'ws': True,
                'watchBalance': True,
                'watchLiquidations': False,
                'watchLiquidationsForSymbols': False,
                'watchMyLiquidations': False,
                'watchMyLiquidationsForSymbols': False,
                'watchBidsAsks': False,
                'watchMyTrades': False,
                'watchOHLCV': True,
                'watchOHLCVForSymbols': False,
                'watchOrderBook': True,
                'watchOrderBookForSymbols': False,
                'watchOrders': True,
                'watchOrdersForSymbols': False,
                'watchPositions': False,
                'watchTicker': False,
                'watchTickers': False,
                'watchTrades': True,
                'watchTradesForSymbols': False,
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
                'ping': self.ping,
                'keepAlive': 27000,
            },
            'options': {
                'returnRateLimits': False,
            },
        })

    async def watch_order_book(self, symbol: str, limit: Int = 50, params={}) -> OrderBook:
        """
        watches information on open orders with bid(buy) and ask(sell) prices, volumes and other data
        :param str symbol: unified symbol of the market to fetch the order book for
        :param int [limit]: the maximum amount of order book entries to return
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :see: https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
        """
        # response = {'id': 100,
        #     'method': 'update.depth',
        #     'result': {'data':
        #         {'asks': [{'price': '68000.0', 'quantity': '0.357100'},
        #             {'price': '68123.5', 'quantity': '0.230000'}],
        #         'bids': [{'price': '67890.9', 'quantity': '0.002000'},
        #             {'price': '67890.4', 'quantity': '0.001000'},
        #             {'price': '65000.2', 'quantity': '0.300000'},
        #             {'price': '62000.0', 'quantity': '1.999000'},
        #             {'price': '60000.0', 'quantity': '1.100000'},
        #             {'price': '8850.2', 'quantity': '0.200000'}],
        #         'symbol': 'BTC-USDT',
        #         'timestamp': 1720856594882,
        #         'topic': 'depth:step1:BTC-USDT',
        #         'tpp': 7},
        #     'merge': 'step1'},
        #     'error': null}
        if symbol is None:
            raise ArgumentsRequired(self.id + ' watchOrderBook() requires a symbol argument')
        await self.load_markets()
        market = self.market(symbol)
        marketId = market['id']
        type_ = 'spot'
        url = self.urls['api']['ws'][type_]
        reqId = self.request_id()
        merge = 'step0'
        request = {
            'method': 'subscribe.depth',
            'params': {
                'market': marketId,
                'merge': merge,
            },
        }
        messageHash = 'depth:' + merge + ':' + marketId  # 'topic': 'depth:step1:BTC-USDT'
        request['id'] = reqId
        orderbook = await self.watch(url, messageHash, request, messageHash, True)
        return orderbook.limit()

    async def watch_balance(self, params={}) -> Balances:
        """
        watch balance and get the amount of funds available for trading or funds locked in orders
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :param boolean [params.portfolioMargin]: set to True if you would like to watch the balance of a portfolio margin account
        :see: https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
        """
        await self.load_markets()
        type_ = 'spot'
        url = self.urls['api']['ws'][type_]
        await self.authenticate(url)
        messageHash = 'update.asset'
        request = {
            'method': 'subscribe.asset',
            'params': {},
            'id': self.request_id(),
        }
        balances = await self.watch(url, messageHash, request, messageHash)
        return balances

    async def watch_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}) -> List[Order]:
        """
        watches information on multiple orders made by the user
        :see: https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
        :param str symbol: unified market symbol of the market orders were made in
        :param int [since]: the earliest time in ms to fetch orders for
        :param int [limit]: the maximum number of order structures to retrieve
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure
        """
        if symbol is None:
            raise ArgumentsRequired(self.id + ' watchOrderBook() requires a symbol argument')
        await self.load_markets()
        market = self.market(symbol)
        marketId = market['id']
        messageHash = 'orders:' + marketId
        type_ = 'spot'
        url = self.urls['api']['ws'][type_]
        await self.authenticate(url)
        request = {
            'method': 'subscribe.orders',
            'params': {
                'market': marketId,
            },
            'id': self.request_id(),
        }
        orders = await self.watch(url, messageHash, request, messageHash, True)
        return orders

    async def watch_ohlcv(self, symbol: str, timeframe='1m', since: Int = None, limit: Int = None, params={}) -> List[list]:
        """
        watches historical candlestick data containing the open, high, low, and close price, and the volume of a market
        :param str symbol: unified symbol of the market to fetch OHLCV data for
        :param str timeframe: the length of time each candle represents
        :param int [since]: timestamp in ms of the earliest candle to fetch
        :param int [limit]: the maximum amount of candles to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns int[][]: A list of candles ordered, open, high, low, close, volume
        :see: https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
        """
        await self.load_markets()
        market = self.market(symbol)
        marketId = market['id']
        type_ = 'spot'
        interval = self.safe_string(self.timeframes, timeframe, timeframe)
        url = self.urls['api']['ws'][type_]
        reqId = self.request_id()
        messageHash = 'kline:' + interval + ':' + marketId
        request = {
            'method': 'subscribe.kline',
            'params': {
                'period': interval,
                'market': marketId,
            },
            'id': reqId,
        }
        ohlcv = await self.watch(url, messageHash, request, messageHash, True)
        return self.filter_by_since_limit(ohlcv, since, limit, 0, True)

    async def authenticate(self, url, params={}):
        self.check_required_credentials()
        messageHash = 'sign'
        client = self.client(url)
        future = client.future(messageHash)
        authenticated = self.safe_value(client.subscriptions, messageHash)
        result = {}
        if authenticated is None:
            nonce = str(self.nonce())
            ts = nonce
            client_id = self.apiKey
            s = 'client_id=' + client_id + '&nonce=' + nonce + '&ts=' + ts
            v = self.hmac(self.encode(s), self.encode(self.secret), hashlib.sha256)
            result = {'method': 'sign',
                'id': self.request_id(),
                'params': {'client_id': client_id,
                    'ts': ts,
                    'nonce': nonce,
                    'sign': v}}
            self.watch(url, messageHash, result, messageHash)
        return await future

    def handle_order_book(self, client: Client, message):
        # response = {'id': 100,
        #     'method': 'update.depth',
        #     'result': {'data':
        #         {'asks': [{'price': '68000.0', 'quantity': '0.357100'},
        #             {'price': '68123.5', 'quantity': '0.230000'}],
        #         'bids': [{'price': '67890.9', 'quantity': '0.002000'},
        #             {'price': '67890.4', 'quantity': '0.001000'},
        #             {'price': '65000.2', 'quantity': '0.300000'},
        #             {'price': '62000.0', 'quantity': '1.999000'},
        #             {'price': '60000.0', 'quantity': '1.100000'},
        #             {'price': '8850.2', 'quantity': '0.200000'}],
        #         'symbol': 'BTC-USDT',
        #         'timestamp': 1720856594882,
        #         'topic': 'depth:step1:BTC-USDT',
        #         'tpp': 7},
        #     'merge': 'step1'},
        #     'error': null}
        result = self.safe_dict(message, 'result')
        abData = self.safe_dict(result, 'data')
        marketId = self.safe_string(abData, 'symbol')
        market = self.safe_market(marketId, None, None)
        timestamp = self.safe_timestamp(abData, 'timestamp')
        messageHash = self.safe_string(abData, 'topic')
        symbol = market['symbol']
        if not (symbol in self.orderbooks):
            self.orderbooks[symbol] = self.order_book()
            self.orderbooks[symbol]['symbol'] = symbol
        orderbook = self.orderbooks[symbol]
        asks = self.safe_list(abData, 'asks', [])
        bids = self.safe_list(abData, 'bids', [])
        self.handle_deltas(orderbook['asks'], asks)
        self.handle_deltas(orderbook['bids'], bids)
        orderbook['timestamp'] = timestamp
        orderbook['datetime'] = self.iso8601(timestamp)
        self.orderbooks[symbol] = orderbook
        client.resolve(orderbook, messageHash)

    def handle_delta(self, bookside, delta):
        price = self.safe_float(delta, 'price')
        amount = self.safe_float(delta, 'quantity')
        bookside.store(price, amount)

    def handle_deltas(self, bookside, deltas):
        for i in range(0, len(deltas)):
            self.handle_delta(bookside, deltas[i])

    def handle_ohlcv(self, client: Client, message):
        # message = {
        #     'id': 1,
        #     'method': 'update.kline',
        #     'error': null,  # 错误响应
        #     'result': {
        #         'data': {
        #             'symbol': 'BTC-USDT',
        #             'ticks': [
        #                 {
        #                     'close': '101.000000',
        #                     'high': '101.000000',
        #                     'low': '101.000000',
        #                     'open': '101.000000',
        #                     'timestamp': 1672910460,
        #                     'volume': '0',
        #                 },
        #             ],
        #             'timestamp': 1672910460000,
        #             'topic': 'kline:1Min:BTC-USDT',
        #             'tpp': 1,
        #             'type': '1Min',
        #         },  # 返回数据
        #         'period': '1Min',
        #     },  # 结果集
        # }
        result = self.safe_dict(message, 'result')
        klineData = self.safe_dict(result, 'data')
        if not klineData:
            return
        marketId = self.safe_string(klineData, 'symbol')
        market = self.safe_market(marketId, None, None)
        symbol = market['symbol']
        messageHash = self.safe_string(klineData, 'topic')
        ticks = self.safe_list(klineData, 'ticks')
        timeframeId = self.safe_string(klineData, 'type')
        timeframe = self.find_timeframe(timeframeId)
        ohlcvsByTimeframe = self.safe_value(self.ohlcvs, symbol)
        if ohlcvsByTimeframe is None:
            self.ohlcvs[symbol] = {}
        stored = self.safe_value(ohlcvsByTimeframe, timeframe)
        if stored is None:
            limit = self.safe_integer(self.options, 'OHLCVLimit', 1000)
            stored = ArrayCacheByTimestamp(limit)
            self.ohlcvs[symbol][timeframe] = stored
        for i in range(0, len(ticks)):
            tick = ticks[i]
            parsed = [
                self.safe_timestamp(tick, 'timestamp'),
                self.safe_float(tick, 'open'),
                self.safe_float(tick, 'high'),
                self.safe_float(tick, 'low'),
                self.safe_float(tick, 'close'),
                self.safe_float(tick, 'volume'),
            ]
            stored.append(parsed)
        client.resolve(stored, messageHash)

    def handle_order(self, client: Client, message):
        # orderMessage = {
        #     'id': 0,
        #     'method': 'update.orders',
        #     'result': {
        #         'frm': 'USDT',
        #         'left': '0.100000',
        #         'match_amt': '0',
        #         'match_price': '60000.21',
        #         'match_qty': '0',
        #         'order_id': '102',
        #         'order_sub_type': 0,
        #         'order_type': 1,
        #         'price': '60000.21',
        #         'quantity': '0.100000',
        #         'real_order_id': '102',
        #         'side': 1,
        #         'status': 2,
        #         'stop_price': '0',
        #         'symbol': 'BTC-USDT',
        #         'ticker_id': 7,
        #         'timestamp': 1721031092,
        #         'to': 'BTC',
        #         'topic': 'orders:BTC-USDT',
        #         'tpp': 7,
        #         'trade_no': '40545373062180505095221',
        #     },
        #     'error': null,
        # }
        result = self.safe_dict(message, 'result')
        timestamp = self.safe_timestamp(result, 'timestamp')
        allinOrderStatus = self.safe_integer(result, 'status')
        allinSymbol = self.safe_string(result, 'symbol')
        market = self.safe_market(allinSymbol)
        if not market:
            return
        allinOrderType = self.force_string(self.safe_integer(result, 'order_type'))
        allinOrderSide = self.safe_integer(result, 'side')
        messageHash = self.safe_string(result, 'topic')
        cost = self.safe_string(result, 'match_amt', '0')
        order = {
            'id': self.safe_string(result, 'order_id'),
            'clientOrderId': self.safe_string(result, 'trade_no'),
            'datetime': self.iso8601(timestamp),
            'timestamp': timestamp,
            'lastTradeTimestamp': timestamp,
            'lastUpdateTimestamp': timestamp,
            'status': self.parse_order_status(allinOrderStatus),
            'symbol': market['symbol'],
            'type': self.parseOrderType(allinOrderType),
            'timeInForce': None,
            'side': self.parseOrderSide(allinOrderSide),
            'price': self.safe_float(result, 'price'),
            'average': self.safe_float(result, 'match_price'),
            'amount': self.safe_float(result, 'quantity'),
            'filled': self.safe_float(result, 'match_qty'),
            'remaining': self.safe_float(result, 'left'),
            'stopPrice': None,
            'triggerPrice': None,
            'takeProfitPrice': None,
            'stopLossPrice': None,
            'cost': cost,
            'trades': [],
            'fee': None,
            'reduceOnly': None,
            'postOnly': None,
            'info': result,
        }
        safeOrder = self.safe_order(order, market)
        client.resolve([safeOrder], messageHash)

    def handle_balance(self, client: Client, message):
        # {
        #     "id": 1,
        #     "method": "update.asset",
        #     "error": null,  #错误响应
        #     "result": {
        #         "available": "999909.4",
        #         "freeze": "90.6",
        #         "symbol": "USDT",
        #         "topic": "accounts",
        #         "total": "1000000"
        #     }  #结果集
        # }
        messageHash = 'update.asset'
        result = self.safe_dict(message, 'result')
        token = self.safe_string(result, 'symbol')
        if self.balance is None:
            self.balance = {}
        if not self.safe_dict(self.balance, 'info'):
            self.balance['info'] = {}
        self.balance['info'][token] = result
        timestamp = self.milliseconds()
        self.balance['timestamp'] = timestamp
        self.balance['datetime'] = self.iso8601(timestamp)
        self.balance[token] = {
            'free': self.safe_string(result, 'available'),
            'total': self.safe_string(result, 'total'),
            'used': self.safe_string(result, 'freeze'),
        }
        self.balance = self.safe_balance(self.balance)
        client.resolve(self.balance, messageHash)

    def ping(self, client):
        return {
            'id': self.request_id(),
            'method': 'ping',
            'params': {},
        }

    def handle_pong(self, client, message):
        client.lastPong = self.milliseconds()
        return message

    def handle_authenticate(self, client: Client, message):
        # {id: 1, method: 'sign', result: 'login success', error: null}
        errorStr = message['error']
        messageHash = 'sign'
        if not errorStr:
            future = self.safe_value(client.futures, messageHash)
            future.resolve(True)
        else:
            error = AuthenticationError(self.id + ' ' + self.json(errorStr))
            client.reject(error, messageHash)
            if messageHash in client.subscriptions:
                del client.subscriptions[messageHash]
        return message

    def handle_error_message(self, client: Client, message) -> bool:
        # response = {'id': 100,
        #     'method': 'update.depth',
        #     'result': {'data':
        #         {'asks': [{'price': '68000.0', 'quantity': '0.357100'},
        #             {'price': '68123.5', 'quantity': '0.230000'}],
        #         'bids': [{'price': '67890.9', 'quantity': '0.002000'},
        #             {'price': '67890.4', 'quantity': '0.001000'},
        #             {'price': '65000.2', 'quantity': '0.300000'},
        #             {'price': '62000.0', 'quantity': '1.999000'},
        #             {'price': '60000.0', 'quantity': '1.100000'},
        #             {'price': '8850.2', 'quantity': '0.200000'}],
        #         'symbol': 'BTC-USDT',
        #         'timestamp': 1720856594882,
        #         'topic': 'depth:step1:BTC-USDT',
        #         'tpp': 7},
        #     'merge': 'step1'},
        #     'error': null}
        error = message['error']
        if error:
            raise ExchangeError(self.id + ' ' + error)
        return False

    def handle_message(self, client: Client, message):
        error = self.safe_value(message, 'error')
        if error:
            self.handle_error_message(client, message)
        methodsDict: dict = {
            'update.depth': self.handle_order_book,
            'subscribe.depth': self.handle_order_book,
            'subscribe.kline': self.handle_ohlcv,
            'update.kline': self.handle_ohlcv,
            'update.orders': self.handle_order,
            'update.asset': self.handle_balance,
            'ping': self.handle_pong,
            'sign': self.handle_authenticate,
            'subscribe.quote': None,
        }
        methodStr = self.safe_string(message, 'method')
        method = self.safe_value(methodsDict, methodStr)
        if method:
            method(client, message)

    def request_id(self):
        requestId = self.sum(self.safe_integer(self.options, 'requestId', 0), 1)
        self.options['requestId'] = requestId
        return requestId
