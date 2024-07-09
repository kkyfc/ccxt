# -*- coding: utf-8 -*-

# PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
# https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

from ccxt.async_support.base.exchange import Exchange
from ccxt.abstract.coincheck import ImplicitAPI
import hashlib
from ccxt.base.types import Balances, Currency, Int, Market, Num, Order, OrderBook, OrderSide, OrderType, Str, Ticker, Trade, TradingFees, Transaction
from typing import List
from ccxt.base.errors import ExchangeError
from ccxt.base.errors import AuthenticationError
from ccxt.base.errors import BadSymbol
from ccxt.base.decimal_to_precision import TICK_SIZE


class coincheck(Exchange, ImplicitAPI):

    def describe(self):
        return self.deep_extend(super(coincheck, self).describe(), {
            'id': 'coincheck',
            'name': 'coincheck',
            'countries': ['JP', 'ID'],
            'rateLimit': 1500,
            'has': {
                'CORS': None,
                'spot': True,
                'margin': False,
                'swap': False,
                'future': False,
                'option': False,
                'addMargin': False,
                'cancelOrder': True,
                'closeAllPositions': False,
                'closePosition': False,
                'createOrder': True,
                'createReduceOnlyOrder': False,
                'fetchBalance': True,
                'fetchBorrowRateHistories': False,
                'fetchBorrowRateHistory': False,
                'fetchCrossBorrowRate': False,
                'fetchCrossBorrowRates': False,
                'fetchDeposits': True,
                'fetchFundingHistory': False,
                'fetchFundingRate': False,
                'fetchFundingRateHistory': False,
                'fetchFundingRates': False,
                'fetchIndexOHLCV': False,
                'fetchIsolatedBorrowRate': False,
                'fetchIsolatedBorrowRates': False,
                'fetchLeverage': False,
                'fetchMarginMode': False,
                'fetchMarkOHLCV': False,
                'fetchMyTrades': True,
                'fetchOpenInterestHistory': False,
                'fetchOpenOrders': True,
                'fetchOrderBook': True,
                'fetchPosition': False,
                'fetchPositionHistory': False,
                'fetchPositionMode': False,
                'fetchPositions': False,
                'fetchPositionsForSymbol': False,
                'fetchPositionsHistory': False,
                'fetchPositionsRisk': False,
                'fetchPremiumIndexOHLCV': False,
                'fetchTicker': True,
                'fetchTrades': True,
                'fetchTradingFee': False,
                'fetchTradingFees': True,
                'fetchWithdrawals': True,
                'reduceMargin': False,
                'setLeverage': False,
                'setMarginMode': False,
                'setPositionMode': False,
                'ws': True,
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/51840849/87182088-1d6d6380-c2ec-11ea-9c64-8ab9f9b289f5.jpg',
                'api': {
                    'rest': 'https://coincheck.com/api',
                },
                'www': 'https://coincheck.com',
                'doc': 'https://coincheck.com/documents/exchange/api',
                'fees': [
                    'https://coincheck.com/exchange/fee',
                    'https://coincheck.com/info/fee',
                ],
            },
            'api': {
                'public': {
                    'get': [
                        'exchange/orders/rate',
                        'order_books',
                        'rate/{pair}',
                        'ticker',
                        'trades',
                    ],
                },
                'private': {
                    'get': [
                        'accounts',
                        'accounts/balance',
                        'accounts/leverage_balance',
                        'bank_accounts',
                        'deposit_money',
                        'exchange/orders/opens',
                        'exchange/orders/transactions',
                        'exchange/orders/transactions_pagination',
                        'exchange/leverage/positions',
                        'lending/borrows/matches',
                        'send_money',
                        'withdraws',
                    ],
                    'post': [
                        'bank_accounts',
                        'deposit_money/{id}/fast',
                        'exchange/orders',
                        'exchange/transfers/to_leverage',
                        'exchange/transfers/from_leverage',
                        'lending/borrows',
                        'lending/borrows/{id}/repay',
                        'send_money',
                        'withdraws',
                    ],
                    'delete': [
                        'bank_accounts/{id}',
                        'exchange/orders/{id}',
                        'withdraws/{id}',
                    ],
                },
            },
            'markets': {
                'BTC/JPY': self.safe_market_structure({'id': 'btc_jpy', 'symbol': 'BTC/JPY', 'base': 'BTC', 'quote': 'JPY', 'baseId': 'btc', 'quoteId': 'jpy', 'type': 'spot', 'spot': True}),  # the only real pair
                # 'ETH/JPY': {'id': 'eth_jpy', 'symbol': 'ETH/JPY', 'base': 'ETH', 'quote': 'JPY', 'baseId': 'eth', 'quoteId': 'jpy'},
                'ETC/JPY': self.safe_market_structure({'id': 'etc_jpy', 'symbol': 'ETC/JPY', 'base': 'ETC', 'quote': 'JPY', 'baseId': 'etc', 'quoteId': 'jpy', 'type': 'spot', 'spot': True}),
                # 'DAO/JPY': {'id': 'dao_jpy', 'symbol': 'DAO/JPY', 'base': 'DAO', 'quote': 'JPY', 'baseId': 'dao', 'quoteId': 'jpy'},
                # 'LSK/JPY': {'id': 'lsk_jpy', 'symbol': 'LSK/JPY', 'base': 'LSK', 'quote': 'JPY', 'baseId': 'lsk', 'quoteId': 'jpy'},
                'FCT/JPY': self.safe_market_structure({'id': 'fct_jpy', 'symbol': 'FCT/JPY', 'base': 'FCT', 'quote': 'JPY', 'baseId': 'fct', 'quoteId': 'jpy', 'type': 'spot', 'spot': True}),
                'MONA/JPY': self.safe_market_structure({'id': 'mona_jpy', 'symbol': 'MONA/JPY', 'base': 'MONA', 'quote': 'JPY', 'baseId': 'mona', 'quoteId': 'jpy', 'type': 'spot', 'spot': True}),
                # 'XMR/JPY': {'id': 'xmr_jpy', 'symbol': 'XMR/JPY', 'base': 'XMR', 'quote': 'JPY', 'baseId': 'xmr', 'quoteId': 'jpy'},
                # 'REP/JPY': {'id': 'rep_jpy', 'symbol': 'REP/JPY', 'base': 'REP', 'quote': 'JPY', 'baseId': 'rep', 'quoteId': 'jpy'},
                # 'XRP/JPY': {'id': 'xrp_jpy', 'symbol': 'XRP/JPY', 'base': 'XRP', 'quote': 'JPY', 'baseId': 'xrp', 'quoteId': 'jpy'},
                # 'ZEC/JPY': {'id': 'zec_jpy', 'symbol': 'ZEC/JPY', 'base': 'ZEC', 'quote': 'JPY', 'baseId': 'zec', 'quoteId': 'jpy'},
                # 'XEM/JPY': {'id': 'xem_jpy', 'symbol': 'XEM/JPY', 'base': 'XEM', 'quote': 'JPY', 'baseId': 'xem', 'quoteId': 'jpy'},
                # 'LTC/JPY': {'id': 'ltc_jpy', 'symbol': 'LTC/JPY', 'base': 'LTC', 'quote': 'JPY', 'baseId': 'ltc', 'quoteId': 'jpy'},
                # 'DASH/JPY': {'id': 'dash_jpy', 'symbol': 'DASH/JPY', 'base': 'DASH', 'quote': 'JPY', 'baseId': 'dash', 'quoteId': 'jpy'},
                # 'ETH/BTC': {'id': 'eth_btc', 'symbol': 'ETH/BTC', 'base': 'ETH', 'quote': 'BTC', 'baseId': 'eth', 'quoteId': 'btc'},
                'ETC/BTC': self.safe_market_structure({'id': 'etc_btc', 'symbol': 'ETC/BTC', 'base': 'ETC', 'quote': 'BTC', 'baseId': 'etc', 'quoteId': 'btc', 'type': 'spot', 'spot': True}),
                # 'LSK/BTC': {'id': 'lsk_btc', 'symbol': 'LSK/BTC', 'base': 'LSK', 'quote': 'BTC', 'baseId': 'lsk', 'quoteId': 'btc'},
                # 'FCT/BTC': {'id': 'fct_btc', 'symbol': 'FCT/BTC', 'base': 'FCT', 'quote': 'BTC', 'baseId': 'fct', 'quoteId': 'btc'},
                # 'XMR/BTC': {'id': 'xmr_btc', 'symbol': 'XMR/BTC', 'base': 'XMR', 'quote': 'BTC', 'baseId': 'xmr', 'quoteId': 'btc'},
                # 'REP/BTC': {'id': 'rep_btc', 'symbol': 'REP/BTC', 'base': 'REP', 'quote': 'BTC', 'baseId': 'rep', 'quoteId': 'btc'},
                # 'XRP/BTC': {'id': 'xrp_btc', 'symbol': 'XRP/BTC', 'base': 'XRP', 'quote': 'BTC', 'baseId': 'xrp', 'quoteId': 'btc'},
                # 'ZEC/BTC': {'id': 'zec_btc', 'symbol': 'ZEC/BTC', 'base': 'ZEC', 'quote': 'BTC', 'baseId': 'zec', 'quoteId': 'btc'},
                # 'XEM/BTC': {'id': 'xem_btc', 'symbol': 'XEM/BTC', 'base': 'XEM', 'quote': 'BTC', 'baseId': 'xem', 'quoteId': 'btc'},
                # 'LTC/BTC': {'id': 'ltc_btc', 'symbol': 'LTC/BTC', 'base': 'LTC', 'quote': 'BTC', 'baseId': 'ltc', 'quoteId': 'btc'},
                # 'DASH/BTC': {'id': 'dash_btc', 'symbol': 'DASH/BTC', 'base': 'DASH', 'quote': 'BTC', 'baseId': 'dash', 'quoteId': 'btc'},
            },
            'fees': {
                'trading': {
                    'tierBased': False,
                    'percentage': True,
                    'maker': self.parse_number('0'),
                    'taker': self.parse_number('0'),
                },
            },
            'precisionMode': TICK_SIZE,
            'exceptions': {
                'exact': {
                    'disabled API Key': AuthenticationError,  # {"success":false,"error":"disabled API Key"}'
                    'invalid authentication': AuthenticationError,  # {"success":false,"error":"invalid authentication"}
                },
                'broad': {},
            },
        })

    def parse_balance(self, response) -> Balances:
        result: dict = {'info': response}
        codes = list(self.currencies.keys())
        for i in range(0, len(codes)):
            code = codes[i]
            currency = self.currency(code)
            currencyId = currency['id']
            if currencyId in response:
                account = self.account()
                reserved = currencyId + '_reserved'
                account['free'] = self.safe_string(response, currencyId)
                account['used'] = self.safe_string(response, reserved)
                result[code] = account
        return self.safe_balance(result)

    async def fetch_balance(self, params={}) -> Balances:
        """
        query for balance and get the amount of funds available for trading or funds locked in orders
        :see: https://coincheck.com/documents/exchange/api#order-transactions-pagination
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `balance structure <https://docs.ccxt.com/#/?id=balance-structure>`
        """
        await self.load_markets()
        response = await self.privateGetAccountsBalance(params)
        return self.parse_balance(response)

    async def fetch_open_orders(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}) -> List[Order]:
        """
        fetch all unfilled currently open orders
        :see: https://coincheck.com/documents/exchange/api#order-opens
        :param str symbol: unified market symbol
        :param int [since]: the earliest time in ms to fetch open orders for
        :param int [limit]: the maximum number of  open orders structures to retrieve
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns Order[]: a list of `order structures <https://docs.ccxt.com/#/?id=order-structure>`
        """
        await self.load_markets()
        # Only BTC/JPY is meaningful
        market = None
        if symbol is not None:
            market = self.market(symbol)
        response = await self.privateGetExchangeOrdersOpens(params)
        rawOrders = self.safe_value(response, 'orders', [])
        parsedOrders = self.parse_orders(rawOrders, market, since, limit)
        result = []
        for i in range(0, len(parsedOrders)):
            result.append(self.extend(parsedOrders[i], {'status': 'open'}))
        return result

    def parse_order(self, order: dict, market: Market = None) -> Order:
        #
        # fetchOpenOrders
        #
        #     {                       id:  202835,
        #                      "order_type": "buy",
        #                            "rate":  26890,
        #                            "pair": "btc_jpy",
        #                  "pending_amount": "0.5527",
        #       "pending_market_buy_amount":  null,
        #                  "stop_loss_rate":  null,
        #                      "created_at": "2015-01-10T05:55:38.000Z"}
        #
        # todo: add formats for fetchOrder, fetchClosedOrders here
        #
        id = self.safe_string(order, 'id')
        side = self.safe_string(order, 'order_type')
        timestamp = self.parse8601(self.safe_string(order, 'created_at'))
        amount = self.safe_string(order, 'pending_amount')
        remaining = self.safe_string(order, 'pending_amount')
        price = self.safe_string(order, 'rate')
        status = None
        marketId = self.safe_string(order, 'pair')
        symbol = self.safe_symbol(marketId, market, '_')
        return self.safe_order({
            'id': id,
            'clientOrderId': None,
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'lastTradeTimestamp': None,
            'amount': amount,
            'remaining': remaining,
            'filled': None,
            'side': side,
            'type': None,
            'timeInForce': None,
            'postOnly': None,
            'status': status,
            'symbol': symbol,
            'price': price,
            'stopPrice': None,
            'triggerPrice': None,
            'cost': None,
            'fee': None,
            'info': order,
            'average': None,
            'trades': None,
        }, market)

    async def fetch_order_book(self, symbol: str, limit: Int = None, params={}) -> OrderBook:
        """
        fetches information on open orders with bid(buy) and ask(sell) prices, volumes and other data
        :see: https://coincheck.com/documents/exchange/api#order-book
        :param str symbol: unified symbol of the market to fetch the order book for
        :param int [limit]: the maximum amount of order book entries to return
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: A dictionary of `order book structures <https://docs.ccxt.com/#/?id=order-book-structure>` indexed by market symbols
        """
        await self.load_markets()
        market = self.market(symbol)
        request: dict = {
            'pair': market['id'],
        }
        response = await self.publicGetOrderBooks(self.extend(request, params))
        return self.parse_order_book(response, market['symbol'])

    def parse_ticker(self, ticker: dict, market: Market = None) -> Ticker:
        #
        # {
        #     "last":4192632.0,
        #     "bid":4192496.0,
        #     "ask":4193749.0,
        #     "high":4332000.0,
        #     "low":4101047.0,
        #     "volume":2313.43191762,
        #     "timestamp":1643374115
        # }
        #
        symbol = self.safe_symbol(None, market)
        timestamp = self.safe_timestamp(ticker, 'timestamp')
        last = self.safe_string(ticker, 'last')
        return self.safe_ticker({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'high': self.safe_string(ticker, 'high'),
            'low': self.safe_string(ticker, 'low'),
            'bid': self.safe_string(ticker, 'bid'),
            'bidVolume': None,
            'ask': self.safe_string(ticker, 'ask'),
            'askVolume': None,
            'vwap': None,
            'open': None,
            'close': last,
            'last': last,
            'previousClose': None,
            'change': None,
            'percentage': None,
            'average': None,
            'baseVolume': self.safe_string(ticker, 'volume'),
            'quoteVolume': None,
            'info': ticker,
        }, market)

    async def fetch_ticker(self, symbol: str, params={}) -> Ticker:
        """
        fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
        :see: https://coincheck.com/documents/exchange/api#ticker
        :param str symbol: unified symbol of the market to fetch the ticker for
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a `ticker structure <https://docs.ccxt.com/#/?id=ticker-structure>`
        """
        if symbol != 'BTC/JPY':
            raise BadSymbol(self.id + ' fetchTicker() supports BTC/JPY only')
        await self.load_markets()
        market = self.market(symbol)
        request: dict = {
            'pair': market['id'],
        }
        ticker = await self.publicGetTicker(self.extend(request, params))
        #
        # {
        #     "last":4192632.0,
        #     "bid":4192496.0,
        #     "ask":4193749.0,
        #     "high":4332000.0,
        #     "low":4101047.0,
        #     "volume":2313.43191762,
        #     "timestamp":1643374115
        # }
        #
        return self.parse_ticker(ticker, market)

    def parse_trade(self, trade: dict, market: Market = None) -> Trade:
        #
        # fetchTrades(public)
        #
        #      {
        #          "id": "206849494",
        #          "amount": "0.01",
        #          "rate": "5598346.0",
        #          "pair": "btc_jpy",
        #          "order_type": "sell",
        #          "created_at": "2021-12-08T14:10:33.000Z"
        #      }
        #
        # fetchMyTrades(private) - example from docs
        #
        #      {
        #          "id": 38,
        #          "order_id": 49,
        #          "created_at": "2015-11-18T07:02:21.000Z",
        #          "funds": {
        #              "btc": "0.1",
        #              "jpy": "-4096.135"
        #                  },
        #           "pair": "btc_jpy",
        #           "rate": "40900.0",
        #           "fee_currency": "JPY",
        #           "fee": "6.135",
        #           "liquidity": "T",
        #           "side": "buy"
        #      }
        #
        timestamp = self.parse8601(self.safe_string(trade, 'created_at'))
        id = self.safe_string(trade, 'id')
        priceString = self.safe_string(trade, 'rate')
        marketId = self.safe_string(trade, 'pair')
        market = self.safe_market(marketId, market, '_')
        baseId = market['baseId']
        quoteId = market['quoteId']
        symbol = market['symbol']
        takerOrMaker = None
        amountString = None
        costString = None
        side = None
        fee = None
        orderId = None
        if 'liquidity' in trade:
            if self.safe_string(trade, 'liquidity') == 'T':
                takerOrMaker = 'taker'
            elif self.safe_string(trade, 'liquidity') == 'M':
                takerOrMaker = 'maker'
            funds = self.safe_value(trade, 'funds', {})
            amountString = self.safe_string(funds, baseId)
            costString = self.safe_string(funds, quoteId)
            fee = {
                'currency': self.safe_string(trade, 'fee_currency'),
                'cost': self.safe_string(trade, 'fee'),
            }
            side = self.safe_string(trade, 'side')
            orderId = self.safe_string(trade, 'order_id')
        else:
            amountString = self.safe_string(trade, 'amount')
            side = self.safe_string(trade, 'order_type')
        return self.safe_trade({
            'id': id,
            'info': trade,
            'datetime': self.iso8601(timestamp),
            'timestamp': timestamp,
            'symbol': symbol,
            'type': None,
            'side': side,
            'order': orderId,
            'takerOrMaker': takerOrMaker,
            'price': priceString,
            'amount': amountString,
            'cost': costString,
            'fee': fee,
        }, market)

    async def fetch_my_trades(self, symbol: Str = None, since: Int = None, limit: Int = None, params={}):
        """
        fetch all trades made by the user
        :see: https://coincheck.com/documents/exchange/api#order-transactions-pagination
        :param str symbol: unified market symbol
        :param int [since]: the earliest time in ms to fetch trades for
        :param int [limit]: the maximum number of trades structures to retrieve
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns Trade[]: a list of `trade structures <https://docs.ccxt.com/#/?id=trade-structure>`
        """
        await self.load_markets()
        market = self.market(symbol)
        request: dict = {}
        if limit is not None:
            request['limit'] = limit
        response = await self.privateGetExchangeOrdersTransactionsPagination(self.extend(request, params))
        #
        #      {
        #          "success": True,
        #          "data": [
        #                      {
        #                          "id": 38,
        #                          "order_id": 49,
        #                          "created_at": "2015-11-18T07:02:21.000Z",
        #                          "funds": {
        #                              "btc": "0.1",
        #                              "jpy": "-4096.135"
        #                                  },
        #                          "pair": "btc_jpy",
        #                          "rate": "40900.0",
        #                          "fee_currency": "JPY",
        #                          "fee": "6.135",
        #                          "liquidity": "T",
        #                          "side": "buy"
        #                       },
        #                  ]
        #      }
        #
        transactions = self.safe_list(response, 'data', [])
        return self.parse_trades(transactions, market, since, limit)

    async def fetch_trades(self, symbol: str, since: Int = None, limit: Int = None, params={}) -> List[Trade]:
        """
        get the list of most recent trades for a particular symbol
        :see: https://coincheck.com/documents/exchange/api#public-trades
        :param str symbol: unified symbol of the market to fetch trades for
        :param int [since]: timestamp in ms of the earliest trade to fetch
        :param int [limit]: the maximum amount of trades to fetch
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns Trade[]: a list of `trade structures <https://docs.ccxt.com/#/?id=public-trades>`
        """
        await self.load_markets()
        market = self.market(symbol)
        request: dict = {
            'pair': market['id'],
        }
        if limit is not None:
            request['limit'] = limit
        response = await self.publicGetTrades(self.extend(request, params))
        #
        #      {
        #          "id": "206849494",
        #          "amount": "0.01",
        #          "rate": "5598346.0",
        #          "pair": "btc_jpy",
        #          "order_type": "sell",
        #          "created_at": "2021-12-08T14:10:33.000Z"
        #      }
        #
        data = self.safe_list(response, 'data', [])
        return self.parse_trades(data, market, since, limit)

    async def fetch_trading_fees(self, params={}) -> TradingFees:
        """
        fetch the trading fees for multiple markets
        :see: https://coincheck.com/documents/exchange/api#account-info
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: a dictionary of `fee structures <https://docs.ccxt.com/#/?id=fee-structure>` indexed by market symbols
        """
        await self.load_markets()
        response = await self.privateGetAccounts(params)
        #
        #     {
        #         "success": True,
        #         "id": "7487995",
        #         "email": "some@email.com",
        #         "identity_status": "identity_pending",
        #         "bitcoin_address": null,
        #         "lending_leverage": "4",
        #         "taker_fee": "0.0",
        #         "maker_fee": "0.0",
        #         "exchange_fees": {
        #           "btc_jpy": {taker_fee: '0.0', maker_fee: "0.0"},
        #           "etc_jpy": {taker_fee: '0.0', maker_fee: "0.0"},
        #           "fct_jpy": {taker_fee: '0.0', maker_fee: "0.0"},
        #           "mona_jpy": {taker_fee: '0.0', maker_fee: "0.0"},
        #           "plt_jpy": {taker_fee: '0.0', maker_fee: "0.0"}
        #         }
        #     }
        #
        fees = self.safe_value(response, 'exchange_fees', {})
        result: dict = {}
        for i in range(0, len(self.symbols)):
            symbol = self.symbols[i]
            market = self.market(symbol)
            fee = self.safe_value(fees, market['id'], {})
            result[symbol] = {
                'info': fee,
                'symbol': symbol,
                'maker': self.safe_number(fee, 'maker_fee'),
                'taker': self.safe_number(fee, 'taker_fee'),
                'percentage': True,
                'tierBased': False,
            }
        return result

    async def create_order(self, symbol: str, type: OrderType, side: OrderSide, amount: float, price: Num = None, params={}):
        """
        create a trade order
        :see: https://coincheck.com/documents/exchange/api#order-new
        :param str symbol: unified symbol of the market to create an order in
        :param str type: 'market' or 'limit'
        :param str side: 'buy' or 'sell'
        :param float amount: how much of currency you want to trade in units of base currency
        :param float [price]: the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: an `order structure <https://docs.ccxt.com/#/?id=order-structure>`
        """
        await self.load_markets()
        market = self.market(symbol)
        request: dict = {
            'pair': market['id'],
        }
        if type == 'market':
            order_type = type + '_' + side
            request['order_type'] = order_type
            prefix = (order_type + '_') if (side == 'buy') else ''
            request[prefix + 'amount'] = amount
        else:
            request['order_type'] = side
            request['rate'] = price
            request['amount'] = amount
        response = await self.privatePostExchangeOrders(self.extend(request, params))
        id = self.safe_string(response, 'id')
        return self.safe_order({
            'id': id,
            'info': response,
        }, market)

    async def cancel_order(self, id: str, symbol: Str = None, params={}):
        """
        cancels an open order
        :see: https://coincheck.com/documents/exchange/api#order-cancel
        :param str id: order id
        :param str symbol: not used by coincheck cancelOrder()
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict: An `order structure <https://docs.ccxt.com/#/?id=order-structure>`
        """
        request: dict = {
            'id': id,
        }
        response = await self.privateDeleteExchangeOrdersId(self.extend(request, params))
        #
        #    {
        #        "success": True,
        #        "id": 12345
        #    }
        #
        return self.parse_order(response)

    async def fetch_deposits(self, code: Str = None, since: Int = None, limit: Int = None, params={}) -> List[Transaction]:
        """
        fetch all deposits made to an account
        :see: https://coincheck.com/documents/exchange/api#account-deposits
        :param str code: unified currency code
        :param int [since]: the earliest time in ms to fetch deposits for
        :param int [limit]: the maximum number of deposits structures to retrieve
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of `transaction structures <https://docs.ccxt.com/#/?id=transaction-structure>`
        """
        await self.load_markets()
        currency = None
        request: dict = {}
        if code is not None:
            currency = self.currency(code)
            request['currency'] = currency['id']
        if limit is not None:
            request['limit'] = limit
        response = await self.privateGetDepositMoney(self.extend(request, params))
        # {
        #   "success": True,
        #   "deposits": [
        #     {
        #       "id": 2,
        #       "amount": "0.05",
        #       "currency": "BTC",
        #       "address": "13PhzoK8me3u5nHzzFD85qT9RqEWR9M4Ty",
        #       "status": "confirmed",
        #       "confirmed_at": "2015-06-13T08:29:18.000Z",
        #       "created_at": "2015-06-13T08:22:18.000Z"
        #     },
        #     {
        #       "id": 1,
        #       "amount": "0.01",
        #       "currency": "BTC",
        #       "address": "13PhzoK8me3u5nHzzFD85qT9RqEWR9M4Ty",
        #       "status": "received",
        #       "confirmed_at": "2015-06-13T08:21:18.000Z",
        #       "created_at": "2015-06-13T08:21:18.000Z"
        #     }
        #   ]
        # }
        data = self.safe_list(response, 'deposits', [])
        return self.parse_transactions(data, currency, since, limit, {'type': 'deposit'})

    async def fetch_withdrawals(self, code: Str = None, since: Int = None, limit: Int = None, params={}) -> List[Transaction]:
        """
        fetch all withdrawals made from an account
        :see: https://coincheck.com/documents/exchange/api#withdraws
        :param str code: unified currency code
        :param int [since]: the earliest time in ms to fetch withdrawals for
        :param int [limit]: the maximum number of withdrawals structures to retrieve
        :param dict [params]: extra parameters specific to the exchange API endpoint
        :returns dict[]: a list of `transaction structures <https://docs.ccxt.com/#/?id=transaction-structure>`
        """
        await self.load_markets()
        currency = None
        if code is not None:
            currency = self.currency(code)
        request: dict = {}
        if limit is not None:
            request['limit'] = limit
        response = await self.privateGetWithdraws(self.extend(request, params))
        #  {
        #   "success": True,
        #   "pagination": {
        #     "limit": 25,
        #     "order": "desc",
        #     "starting_after": null,
        #     "ending_before": null
        #   },
        #   "data": [
        #     {
        #       "id": 398,
        #       "status": "finished",
        #       "amount": "242742.0",
        #       "currency": "JPY",
        #       "created_at": "2014-12-04T15:00:00.000Z",
        #       "bank_account_id": 243,
        #       "fee": "400.0",
        #       "is_fast": True
        #     }
        #   ]
        # }
        data = self.safe_list(response, 'data', [])
        return self.parse_transactions(data, currency, since, limit, {'type': 'withdrawal'})

    def parse_transaction_status(self, status: Str):
        statuses: dict = {
            # withdrawals
            'pending': 'pending',
            'processing': 'pending',
            'finished': 'ok',
            'canceled': 'canceled',
            # deposits
            'confirmed': 'pending',
            'received': 'ok',
        }
        return self.safe_string(statuses, status, status)

    def parse_transaction(self, transaction: dict, currency: Currency = None) -> Transaction:
        #
        # fetchDeposits
        #
        # {
        #       "id": 2,
        #       "amount": "0.05",
        #       "currency": "BTC",
        #       "address": "13PhzoK8me3u5nHzzFD85qT9RqEWR9M4Ty",
        #       "status": "confirmed",
        #       "confirmed_at": "2015-06-13T08:29:18.000Z",
        #       "created_at": "2015-06-13T08:22:18.000Z"
        #  }
        #
        # fetchWithdrawals
        #
        #  {
        #       "id": 398,
        #       "status": "finished",
        #       "amount": "242742.0",
        #       "currency": "JPY",
        #       "created_at": "2014-12-04T15:00:00.000Z",
        #       "bank_account_id": 243,
        #       "fee": "400.0",
        #       "is_fast": True
        #  }
        #
        id = self.safe_string(transaction, 'id')
        timestamp = self.parse8601(self.safe_string(transaction, 'created_at'))
        address = self.safe_string(transaction, 'address')
        amount = self.safe_number(transaction, 'amount')
        currencyId = self.safe_string(transaction, 'currency')
        code = self.safe_currency_code(currencyId, currency)
        status = self.parse_transaction_status(self.safe_string(transaction, 'status'))
        updated = self.parse8601(self.safe_string(transaction, 'confirmed_at'))
        fee = None
        feeCost = self.safe_number(transaction, 'fee')
        if feeCost is not None:
            fee = {
                'cost': feeCost,
                'currency': code,
            }
        return {
            'info': transaction,
            'id': id,
            'txid': None,
            'timestamp': timestamp,
            'datetime': self.iso8601(timestamp),
            'network': None,
            'address': address,
            'addressTo': address,
            'addressFrom': None,
            'tag': None,
            'tagTo': None,
            'tagFrom': None,
            'type': None,
            'amount': amount,
            'currency': code,
            'status': status,
            'updated': updated,
            'comment': None,
            'internal': None,
            'fee': fee,
        }

    def nonce(self):
        return self.milliseconds()

    def sign(self, path, api='public', method='GET', params={}, headers=None, body=None):
        url = self.urls['api']['rest'] + '/' + self.implode_params(path, params)
        query = self.omit(params, self.extract_params(path))
        if api == 'public':
            if query:
                url += '?' + self.urlencode(query)
        else:
            self.check_required_credentials()
            nonce = str(self.nonce())
            queryString = ''
            if method == 'GET':
                if query:
                    url += '?' + self.urlencode(self.keysort(query))
            else:
                if query:
                    body = self.urlencode(self.keysort(query))
                    queryString = body
            auth = nonce + url + queryString
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'ACCESS-KEY': self.apiKey,
                'ACCESS-NONCE': nonce,
                'ACCESS-SIGNATURE': self.hmac(self.encode(auth), self.encode(self.secret), hashlib.sha256),
            }
        return {'url': url, 'method': method, 'body': body, 'headers': headers}

    def handle_errors(self, httpCode: int, reason: str, url: str, method: str, headers: dict, body: str, response, requestHeaders, requestBody):
        if response is None:
            return None
        #
        #     {"success":false,"error":"disabled API Key"}'
        #     {"success":false,"error":"invalid authentication"}
        #
        success = self.safe_bool(response, 'success', True)
        if not success:
            error = self.safe_string(response, 'error')
            feedback = self.id + ' ' + self.json(response)
            self.throw_exactly_matched_exception(self.exceptions['exact'], error, feedback)
            self.throw_broadly_matched_exception(self.exceptions['broad'], body, feedback)
            raise ExchangeError(self.id + ' ' + self.json(response))
        return None
