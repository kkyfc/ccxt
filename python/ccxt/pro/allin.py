# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

import ccxt.async_support
from ccxt.async_support.base.ws.cache import ArrayCacheBySymbolBySide, ArrayCacheByTimestamp
import hashlib
from ccxt.base.types import Balances, Int, Order, OrderBook, Position, Str, Ticker, Tickers
from ccxt.async_support.base.ws.client import Client
from typing import List
from ccxt.base.errors import BaseError
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
                'watchTicker': True,
                'watchTickers': False,
                'watchTrades': True,
                'watchTradesForSymbols': False,
            },
            'urls': {
                'test': {
                    'ws': {
                        'spot': 'ws://ws.aie.test/ws',
                        'future': 'ws://futuresws.aie.test/wsf',
                        'swap': 'ws://futuresws.aie.test/wsf',
                    },
                },
                'api': {
                    'ws': {
                        'spot': 'ws://ws.aie.prod/ws',
                        'future': 'ws://futuresws.aie.prod/wsf',
                        'swap': 'ws://futuresws.aie.prod/wsf',
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
        type_ = None
        request = None
        merge = None
        if market['spot']:
            type_ = 'spot'
            merge = 'step0'
            request = {
                'method': 'subscribe.depth',
                'params': {
                    'market': marketId,
                    'merge': merge,
                },
            }
        else:
            merge = '0'
            type_ = 'future'
            request = {
                'method': 'subscribe.depth',
                'params': {
                    'market': marketId,
                    'merge': merge,
                },
            }
        url = self.urls['api']['ws'][type_]
        reqId = self.request_id()
        messageHash = 'depth:' + ':' + marketId  # 'topic': 'depth:step1:BTC-USDT'
        request['id'] = reqId
        orderbook = await self.watch(url, messageHash, request, messageHash, True)
        return orderbook.limit()

    async def watch_ticker(self, symbol: str, params={}) -> Ticker:
        """
        watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :see: https://allinexchange.github.io/spot-docs/v1/en/#websocket-guide
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        # response = {
        #     'id': 1,
        #     'method': 'update.quote',
        #     'error': null,  # 错误响应
        #     'result': {
        #         'data': {
        #             'symbol': 'BTC-USDT',
        #             'timestamp': 1673417148,
        #             'topic': 'quotes',
        #             'price': '100.21',  # 价格
        #             'volume': '0',
        #             'amount': '0',
        #             'high': '100.21',
        #             'low': '100.21',
        #             'change': '0',
        #             'tpp': 1,
        #             'l_price': '100.21',
        #         },  # 返回数据
        #         'market': 'BTC-USDT',
        #     },  # 结果集
        # }
        await self.load_markets()
        market = self.market(symbol)
        symbolId = market['id']
        messageHash = 'update.quote:' + symbolId
        type_ = 'spot'
        url = self.urls['api']['ws'][type_]
        request = {
            'method': 'subscribe.quote',
            'params': {
                'market': symbolId,
            },
            'id': self.request_id(),
        }
        ticker = await self.watch(url, messageHash, request, messageHash, True)
        return ticker

    async def watch_tickers(self, symbols=None, params={}) -> Tickers:
        """
        watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for all markets of a specific list
        :see: https://allinexchange.github.io/spot-docs/v1/en/#websocket-guide
        :param str[] symbols: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        messageHash = 'update.quotes'
        type_ = 'spot'
        url = self.urls['api']['ws'][type_]
        request = {
            'method': 'subscribe.quotes',
            'params': {},
            'id': self.request_id(),
        }
        tickers = await self.watch(url, messageHash, request, messageHash, True)
        return self.filter_by_array(tickers, 'symbol', symbols)

    async def watch_balance(self, params={}) -> Balances:
        """
        watch balance and get the amount of funds available for trading or funds locked in orders
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :param boolean [params.portfolioMargin]: set to True if you would like to watch the balance of a portfolio margin account
        :see: https://allinexchange.github.io/spot-docs/v1/en/#subscription-topic
        """
        await self.load_markets()
        currentType = self.safe_string(params, 'defaultType', None)
        if not currentType:
            currentType = self.options['defaultType']
        url = self.urls['api']['ws'][currentType]
        await self.authenticate(url)
        messageHash = 'update.asset'
        request = {
            'method': 'subscribe.asset',
            'params': {},
            'id': self.request_id(),
        }
        balances = await self.watch(url, messageHash, request, messageHash)
        return balances

    async def watch_positions(self, symbols: List[str] = None, since: Int = None, limit: Int = None, params={}) -> List[Position]:
        currentType = self.safe_string(params, 'defaultType', None)
        if not currentType:
            currentType = self.options['defaultType']
        await self.load_markets()
        if currentType == 'future' or currentType == 'swap':
            messageHash = 'update.position'
            url = self.urls['api']['ws'][currentType]
            await self.authenticate(url)
            request = {
                'method': 'subscribe.position',
                'id': self.request_id(),
                'params': {},
            }
            positions = await self.watch(url, messageHash, request, messageHash)
            return positions
        else:
            raise BaseError(currentType + 'market type no position')

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
        currentType = self.safe_string(params, 'defaultType', None)
        type_ = None
        marketId = None
        messageHash = None
        if symbol is None and currentType == 'spot':
            raise ArgumentsRequired(self.id + ' watchOrderBook() requires a symbol argument')
        elif symbol is not None:
            await self.load_markets()
            market = self.market(symbol)
            marketId = market['id']
            type_ = market['type']
            messageHash = 'orders:' + marketId
        else:
            type_ = currentType
            messageHash = 'orders:__ALL__'
        url = self.urls['api']['ws'][type_]
        await self.authenticate(url)
        request = None
        if type_ == 'spot':
            request = {
                'method': 'subscribe.orders',
                'params': {},
                'id': self.request_id(),
            }
        else:
            request = {
                'method': 'subscribe.order',
                'params': {},
                'id': self.request_id(),
            }
        if marketId is not None:
            request['params']['market'] = marketId
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
        type_ = market['type']
        interval = self.safe_string(self.timeframes, timeframe, timeframe)
        url = self.urls['api']['ws'][type_]
        reqId = self.request_id()
        if not market['spot']:
            interval = str(interval).lower()
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
        currentType = self.safe_string(params, 'defaultType', None)
        if not currentType:
            currentType = self.options['defaultType']
        client = self.client(url)
        future = client.future(messageHash)
        authenticated = self.safe_value(client.subscriptions, messageHash)
        request = {}
        if authenticated is None:
            nonce = str(self.nonce())
            ts = nonce
            client_id = self.apiKey
            s = 'client_id=' + client_id + '&nonce=' + nonce + '&ts=' + ts
            v = self.hmac(self.encode(s), self.encode(self.secret), hashlib.sha256)
            request = {'method': 'sign',
                'id': self.request_id(),
                'params': {'client_id': client_id,
                    'ts': ts,
                    'nonce': nonce,
                    'sign': v}}
            self.watch(url, messageHash, request, messageHash)
        return await future

    def handle_order_book(self, client: Client, message):
        # response = {'id': 100,
        #     'method': 'update.depth',
        #     'result': {'data':
        #         {'asks': [{'price': '68000.0', 'quantity': '0.357100'},
        #             {'price': '68123.5', 'quantity': '0.230000'}],
        #            'bids': [{'price': '67890.9', 'quantity': '0.002000'},
        #             {'price': '67890.4', 'quantity': '0.001000'},
        #             {'price': '65000.2', 'quantity': '0.300000'},
        #             {'price': '62000.0', 'quantity': '1.999000'},
        #             {'price': '60000.0', 'quantity': '1.100000'},
        #             {'price': '8850.2', 'quantity': '0.200000'}],
        #              'symbol': 'BTC-USDT',
        #              'timestamp': 1721550307.627,
        #              'topic': 'depth:step1:BTC-USDT',
        #              'tpp': 7},
        #          'merge': 'step1'},
        #     'error': null}
        # future
        # {
        #     "id":0,
        #     "method":"update.depth",
        #     "result":{
        #       "asks":[
        #         [
        #           "36341.6",
        #           "0.0444"
        #         ]
        #       ],
        #       "bids":[
        #         [
        #           "36341.25",
        #           "0.0511"
        #         ]
        #       ],
        #       "index_price":"36612.36",
        #       "last":"36341.59",
        #       "market":"BTCUSDT",
        #       "sign_price":"36589.76",
        #       "time":1699944061967
        #     },
        #     "error":null
        #   }
        result = self.safe_dict(message, 'result')
        marketId = self.safe_string(result, 'market', None)
        timestamp = None
        abData = None
        if marketId is None:
            # spot
            abData = self.safe_dict(result, 'data')
            marketId = self.safe_string(abData, 'symbol')
            timestamp = self.safe_timestamp(abData, 'timestamp')
        else:
            # future
            abData = result
            marketId = self.safe_string(abData, 'market')
            timestamp = self.safe_integer(abData, 'time')
        market = self.safe_market(marketId, None, None)
        messageHash = 'depth:' + ':' + marketId
        symbol = market['symbol']
        if not (symbol in self.orderbooks):
            self.orderbooks[symbol] = self.order_book()
            self.orderbooks[symbol]['symbol'] = symbol
        orderbook = self.orderbooks[symbol]
        snapshot = None
        if market['spot']:
            snapshot = self.parse_order_book(abData, symbol, timestamp, 'bids', 'asks', 'price', 'quantity')
            orderbook.reset(snapshot)
        else:
            snapshot = self.parse_order_book(abData, symbol, timestamp, 'bids', 'asks', 0, 1)
            orderbook.reset(snapshot)
            orderbook['markPrice'] = self.safe_float(result, 'sign_price')
            orderbook['indexPrice'] = self.safe_float(result, 'index_price')
            orderbook['lastPrice'] = self.safe_float(result, 'last')
        self.orderbooks[symbol] = orderbook
        client.resolve(orderbook, messageHash)

    def handle_fulls(self, datas):
        bookside = []
        for i in range(0, len(datas)):
            bookside.append(self.safe_float(datas, 'price'), self.safe_float(datas, 'quantity'))

    def handle_delta(self, bookside, delta):
        price = self.safe_float(delta, 'price')
        amount = self.safe_float(delta, 'quantity')
        bookside.store(price, amount)

    def handle_deltas(self, bookside, deltas):
        for i in range(0, len(deltas)):
            self.handle_delta(bookside, deltas[i])

    def handle_ticker(self, client: Client, message):
        # ticker = {
        #     'id': 1,
        #     'method': 'update.quote',
        #     'error': null,
        #     'result': {
        #         'data': {
        #             'symbol': 'BTC-USDT',
        #             'timestamp': 1673417148,
        #             'topic': 'quotes',
        #             'price': '100.21',
        #             'volume': '0',
        #             'amount': '0',
        #             'high': '100.21',
        #             'low': '100.21',
        #             'change': '0',
        #             'tpp': 1,
        #             'l_price': '100.21',
        #         },
        #         'market': 'BTC-USDT',
        #     },
        # }
        # future
        # {
        #     "id":0,
        #     "method":"update.state",
        #     "result": {
        #       "1000SHIBUSDT": {
        #         "market": "1000SHIBUSDT",
        #         "amount": "35226256.573504",
        #         "high":"0.009001",
        #         "last": "0.008607",
        #         "low": "0.008324",
        #         "open": "0.008864",
        #         "period": 86400,
        #         "volume":"4036517772",
        #         "change": "-0.0289936823104693",
        #         "funding_time": 79,
        #         "position_amount": "0",
        #         "funding_rate_last": "0.00092889",
        #         "funding_rate_next":"0.00078062",
        #         "funding_rate_predict": "0.00059084",
        #         "insurance": "12920.37897885999447286856",
        #         "sign_price": "0.008607",
        #         "index_price": "0.008606",
        #         "sell_total":"46470921",
        #         "buy_total": "43420303"
        #       }
        #     },
        #     "error":null
        #   }
        result = self.safe_dict(message, 'result')
        tickerData = self.safe_dict(result, 'data')
        if tickerData is None:
            # future
            keys = list(result.keys())
            for i in range(0, len(keys)):
                symbolId = keys[i]
                messageHash = 'update.quote:' + symbolId
                market = self.safe_market(symbolId)
                symbol = market['symbol']
                data = result[symbolId]
                ticker = self.parse_ticker(data, market)
                self.tickers[symbol] = ticker
                client.resolve(ticker, messageHash)
        else:
            # spot
            symbolId = self.safe_string(tickerData, 'symbol')
            market = self.safe_market(symbolId, None, None)
            tickerData['timestamp'] = self.safe_timestamp(tickerData, 'timestamp')
            symbol = market['symbol']
            messageHash = 'update.quote:' + symbolId
            ticker = self.parse_ticker(tickerData, market)
            self.tickers[symbol] = ticker
            client.resolve(ticker, messageHash)

    def handle_tickers(self, client: Client, message):
        # ticker = {
        #     'id': 1,
        #     'method': 'update.quotes',
        #     'error': null,
        #     'result': {
        #         'data': {
        #             'symbol': 'BTC-USDT',
        #             'timestamp': 1673417148,
        #             'topic': 'quotes',
        #             'price': '100.21',
        #             'volume': '0',
        #             'amount': '0',
        #             'high': '100.21',
        #             'low': '100.21',
        #             'change': '0',
        #             'tpp': 1,
        #             'l_price': '100.21',
        #         },
        #         'market': 'BTC-USDT',
        #     },
        # }
        result = self.safe_dict(message, 'result')
        tickerData = self.safe_dict(result, 'data')
        symbolId = self.safe_string(tickerData, 'symbol')
        market = self.safe_market(symbolId, None, None)
        tickerData['timestamp'] = self.safe_timestamp(tickerData, 'timestamp')
        symbol = market['symbol']
        messageHash = 'update.quotes'
        ticker = self.parse_ticker(tickerData, market)
        self.tickers[symbol] = ticker
        client.resolve(self.tickers, messageHash)

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
        #             'timestamp': 1721551500,
        #             'topic': 'kline:1Min:BTC-USDT',
        #             'tpp': 1,
        #             'type': '1Min',
        #         },  # 返回数据
        #         'period': '1Min',
        #     },  # 结果集
        # }
        # future
        # future = {'id': 0,
        #     'method':
        #     'update.kline',
        #     'result': {'data': [[1723034940, '65517.74', '65517.74', '65517.74', '65517.74', '0', '0', 'BTCUSDT']],
        #         'market': 'BTCUSDT',
        #         'period': '1min'},
        #     'error': null}
        result = self.safe_dict(message, 'result')
        if result is None:
            return
        klineData = self.safe_dict(result, 'data')
        marketId = self.safe_string_2(klineData, 'symbol', 'market', None)
        if marketId is None:
            # future
            marketId = self.safe_string(result, 'market')
        market = self.safe_market(marketId, None, None)
        symbol = market['symbol']
        messageHash = None
        ticks = None
        timeframeId = None
        timeframe = None
        if market['spot']:
            ticks = self.safe_list(klineData, 'ticks')
            timeframeId = self.safe_string(klineData, 'type')
            messageHash = self.safe_string(klineData, 'topic')
            timeframe = self.find_timeframe(timeframeId)
        else:
            ticks = self.safe_list(result, 'data')
            timeframeId = self.safe_string(result, 'period')
            timeframe = self.parseLowerTimeframe(timeframeId)
            messageHash = 'kline:' + str(timeframeId).lower() + ':' + marketId
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
            parsed = self.parse_ohlcv(tick, market)
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
        #         'update_timestamp': 1721031092,
        #         'to': 'BTC',
        #         'topic': 'orders:BTC-USDT',
        #         'tpp': 7,
        #         'trade_no': '40545373062180505095221',
        #     },
        #     'error': null,
        # }
        # future
        # futureOrder = {'id': 0,
        #     'method': 'update.order',
        #     'result': {'order_id': 5034339,
        #         'position_id': 0,
        #         'market': 'BTCUSDT',
        #         'type': 1,
        #         'side': 1,
        #         'left': '0.0000',
        #         'amount': '0.0400',
        #         'filled': '0.04',
        #         'deal_fee': '0.9583',
        #         'price': '56000',
        #         'avg_price': '59898.36',
        #         'deal_stock': '2395.9344',
        #         'position_type': 2,
        #         'leverage': '100',
        #         'update_time': 1723131121.719404,
        #         'create_time': 1723131121.719389,
        #         'status': 3,
        #         'stop_loss_price': '-',
        #         'take_profit_price': '-'},
        #     'error': None}
        result = self.safe_dict(message, 'result')
        allinSymbol = self.safe_string_2(result, 'symbol', 'market')
        market = self.safe_market(allinSymbol)
        if not market:
            return
        order = self.parse_order(result, market)
        messageHashAll = None
        messageHash = 'orders:' + market['id']
        if market['spot']:
            messageHashAll = 'orders:__ALL__'
        safeOrder = self.safe_order(order, market)
        client.resolve([safeOrder], messageHash)
        if messageHashAll:
            client.resolve([safeOrder], messageHashAll)

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
        # future
        # {
        #     "id":0,
        #     "method":"update.asset",
        #     "result":{
        #       "USDT":{
        #         "available":"10320.9887",
        #         "frozen":"0",
        #         "margin":"16.1356",
        #         "balance_total":"10320.9887",
        #         "profit_unreal":"11.0315",
        #         "transfer":"10097.1501",
        #         "bonus":"223.8386"
        #       }
        #     },
        #     "error":null
        #   }
        currentType = self.safe_string(self.options, 'defaultType', None)
        messageHash = 'update.asset'
        if self.balance is None:
            self.balance = {}
        if not self.safe_dict(self.balance, 'info'):
            self.balance['info'] = {}
        if currentType == 'spot':
            result = self.safe_dict(message, 'result')
            token = self.safe_string(result, 'symbol')
            self.balance['info'][token] = result
            timestamp = self.milliseconds()
            self.balance['timestamp'] = timestamp
            self.balance['datetime'] = self.iso8601(timestamp)
            self.balance[token] = {
                'free': self.safe_string(result, 'available'),
                'total': self.safe_string(result, 'total'),
                'used': self.safe_string(result, 'freeze'),
            }
        else:
            originBalances = self.safe_dict(message, 'result')
            keys = list(originBalances.keys())
            for i in range(0, len(keys)):
                key = keys[i]
                originBalance = originBalances[key]
                symbol = key
                used = self.safe_string(originBalance, 'frozen')
                total = self.safe_string(originBalance, 'balance_total')
                free = self.safe_string(originBalance, 'available')
                self.balance[symbol] = {
                    'free': free,
                    'used': used,
                    'total': total,
                    'debt': 0,  # ???
                }
        self.balance = self.safe_balance(self.balance)
        client.resolve(self.balance, messageHash)

    def handle_positions(self, client: Client, message):
        # {
        #     "id":0,
        #     "method":"update.position",
        #     "result":{
        #       "event":1,
        #       "position":{
        #         "position_id":4784242,
        #         "create_time":1699944061.968543,
        #         "update_time":1699944061.968656,
        #         "user_id":9108,
        #         "market":"BTCUSDT",
        #         "type":2,
        #         "side":2,
        #         "amount":"0.0444",
        #         "close_left":"0.0444",
        #         "open_price":"36341.6",
        #         "open_margin":"6.4063",
        #         "margin_amount":"16.1356",
        #         "leverage":"100",
        #         "profit_unreal":"11.0184",
        #         "liq_price":"0",
        #         "mainten_margin":"0.005",
        #         "mainten_margin_amount":"8.0678",
        #         "adl_sort":1,
        #         "roe":"0.6828",
        #         "margin_ratio":"",
        #         "stop_loss_price":"-",
        #         "take_profit_price":"-"
        #       }
        #     },
        #     "error":null
        #   }
        result = self.safe_dict(message, 'result')
        data = self.safe_dict(result, 'position')
        marketId = data['market']
        market = self.safe_market(marketId)
        messageHash = 'update.position'
        if self.positions is None:
            self.positions = ArrayCacheBySymbolBySide()
        cache = self.positions
        position = self.parse_position(data, market)
        cache.append(position)
        client.resolve([position], messageHash)

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
        # future
        # {'id': 1,
        #     'method': 'subscribe.sign',
        #     'result': None,
        #     'error': {'code': 20015, 'msg': 'system error'}
        # }
        error = message['error']
        if error:
            code = self.safe_string(error, 'code', 'default')
            errorStr = None
            if code is not None:
                errorStr = self.safe_string(error, 'msg')
                self.throw_exactly_matched_exception(self.exceptions['exact'], code, errorStr)
            else:
                code = ' '
                errorStr = error
                self.throw_exactly_matched_exception(self.exceptions['exact'], code, errorStr)
        return False

    def handle_message(self, client: Client, message):
        error = self.safe_value(message, 'error')
        if error:
            self.handle_error_message(client, message)
        # 'subscribe.depth': self.handle_order_book,
        # 'subscribe.kline': self.handle_ohlcv,
        methodsDict: dict = {
            'update.depth': self.handle_order_book,
            'update.kline': self.handle_ohlcv,
            'update.orders': self.handle_order,
            'update.order': self.handle_order,
            'update.asset': self.handle_balance,
            'ping': self.handle_pong,
            'sign': self.handle_authenticate,
            'update.quote': self.handle_ticker,
            'update.quotes': self.handle_tickers,
            'update.position': self.handle_positions,
        }
        methodStr = self.safe_string(message, 'method')
        method = self.safe_value(methodsDict, methodStr)
        if method:
            method(client, message)

    def request_id(self):
        requestId = self.sum(self.safe_integer(self.options, 'requestId', 0), 1)
        self.options['requestId'] = requestId
        return requestId
