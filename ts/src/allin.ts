
//  ---------------------------------------------------------------------------

import Exchange from './abstract/allin.js';
import { ArgumentsRequired, BadRequest, NetworkError, ExchangeError, OrderNotFound, AuthenticationError, RateLimitExceeded, BadSymbol, OperationFailed } from './base/errors.js';
import { Precise } from './base/Precise.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import type { Int, OrderSide, OrderType, Trade, Order, OHLCV, Balances, Str, Ticker, OrderBook, Market, MarketInterface, Num, Dict, int } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class allin
 * @augments Exchange
 */
export default class allin extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'allin',
            'name': 'allin',
            'countries': [ 'US' ],
            'version': 'v1',
            'userAgent': undefined,
            'rateLimit': 200,
            'hostname': 'allin.pro',
            'pro': true,
            'certified': false,
            'options': {
                'sandboxMode': false,
            },
            'has': {
                'CORS': true,
                'spot': true,
                'margin': true,
                'swap': true,
                'future': true,
                'option': true,
                'borrowCrossMargin': true,
                'cancelAllOrders': true,
                'cancelAllOrdersAfter': true,
                'cancelOrder': true,
                'cancelOrders': true,
                'cancelOrdersForSymbols': true,
                'closeAllPositions': false,
                'closePosition': false,
                'createMarketBuyOrderWithCost': true,
                'createMarketSellOrderWithCost': true,
                'createOrder': true,
                'createOrders': true,
                'createOrderWithTakeProfitAndStopLoss': false,
                'createPostOnlyOrder': false,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': false,
                'createStopLossOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'createTakeProfitOrder': true,
                'createTrailingAmountOrder': true,
                'createTriggerOrder': false,
                'editOrder': true,
                'fetchBalance': true,
                'fetchBorrowInterest': false, // temporarily disabled, as it doesn't work
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchCanceledAndClosedOrders': true,
                'fetchCanceledOrders': true,
                'fetchClosedOrder': true,
                'fetchClosedOrders': true,
                'fetchCrossBorrowRate': true,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': false,
                'fetchDeposit': false,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': true,
                'fetchDeposits': true,
                'fetchDepositWithdrawFee': 'emulated',
                'fetchDepositWithdrawFees': true,
                'fetchFundingHistory': true,
                'fetchFundingRate': true, // emulated in exchange
                'fetchFundingRateHistory': true,
                'fetchFundingRates': true,
                'fetchGreeks': true,
                'fetchIndexOHLCV': true,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchLedger': true,
                'fetchLeverage': true,
                'fetchLeverageTiers': true,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarketLeverageTiers': true,
                'fetchMarkets': true,
                'fetchMarkOHLCV': true,
                'fetchMyLiquidations': true,
                'fetchMySettlementHistory': true,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': true,
                'fetchOpenInterestHistory': true,
                'fetchOpenOrder': true,
                'fetchOpenOrders': true,
                'fetchOption': true,
                'fetchOptionChain': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchOrderTrades': false,
                'fetchPosition': true,
                'fetchPositionHistory': 'emulated',
                'fetchPositions': true,
                'fetchPositionsHistory': true,
                'fetchPremiumIndexOHLCV': true,
                'fetchSettlementHistory': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': true,
                'fetchTransactions': false,
                'fetchTransfers': true,
                'fetchUnderlyingAssets': false,
                'fetchVolatilityHistory': true,
                'fetchWithdrawals': true,
                'repayCrossMargin': true,
                'sandbox': true,
                'setLeverage': true,
                'setMarginMode': true,
                'setPositionMode': true,
                'transfer': true,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1Min',
                '3m': '3Min',
                '5m': '5Min',
                '15m': '15Min',
                '10m': '10Min',
                '30m': '30Min',
                '1h': '1Hour',
                '2h': '2Hour',
                '4h': '4Hour',
                '6h': '6Hour',
                '12h': '12Hour',
                '1d': '1Day',
                '1w': '1Week',
            },
            'urls': {
                'test': {
                    'spot': 'https://api.allintest.pro',
                    'futures': 'https://api.allintest.pro',
                    'public': 'https://api.allintest.pro',
                    'private': 'https://api.allintest.pro',
                },
                'logo': 'https://allinexchange.github.io/spot-docs/v1/en/images/logo-e47cee02.svg',
                'doc': [ 'https://allinexchange.github.io/spot-docs/v1/en/#introduction' ],
                'api': {
                    'spot': 'https://api.allintest.pro',
                    'futures': 'https://api.allintest.pro',
                    'public': 'https://api.allintest.pro',
                    'private': 'https://api.allintest.pro',
                },
            },
            'api': {
                'public': {
                    'get': {
                        '/open/v1/tickers/market': 0,
                        '/open/v1/depth/market': 0,
                        '/open/v1/trade/market': 0,
                        '/open/v1/kline/market': 0,
                    },
                },
                'private': {
                    'get': {
                        '/open/v1/tickers/exchange_info': 0,
                        '/open/v1/tickers': 0,
                        '/open/v1/balance': 0,
                        '/open/v1/timestamp': 0,
                        '/open/v1/kline': 0,
                        '/open/v1/depth': 0,
                        '/open/v1/tickers/trade': 0,
                        '/open/v1/orders/last': 0,
                        '/open/v1/orders': 0,
                        '/open/v1/orders/detail': 0,
                        '/open/v1/orders/detailmore': 0,
                        '/open/v1/orders/fee-rate': 0,
                    },
                    'post': {
                        '/open/v1/orders/place': 0,
                        '/open/v1/orders/cancel': 0,
                        '/open/v1/orders/batcancel': 0,
                    },
                },
            },
            'exceptions': {
                'spot': {
                    'exact': {
                        '1010004': BadRequest,
                        '80005': BadRequest,
                    },
                },
                'exact': {
                    '1010037': OrderNotFound, // order not found
                    '1010312': BadRequest,
                    '1010313': AuthenticationError,
                    '1010314': RateLimitExceeded,   // Request cannot be more than %s/m
                    '1010315': RateLimitExceeded,   // no authority, ip is not allowed
                    '1010316': AuthenticationError, // no authority, sign is error
                    '1010007': RateLimitExceeded,   // call too frequently
                    '1010325': BadSymbol,           // symbol is empty
                    '10500': ExchangeError,         // system error
                    '1010367': OperationFailed,     // this ticker cannot be operated
                    '1010006': AuthenticationError, // invalid user_id
                    '1010009': BadRequest,          // side is error
                    '1010010': BadRequest,          // time is error
                    '1010008': BadRequest,          // status is error
                    '80005': BadRequest,            // param error
                    '1010013': BadRequest,          // ticker is paused
                    '1010018': BadRequest,          // cannot place market price order
                    '1010016': BadRequest,          // price is too small
                    '1010401': BadRequest,          // price is too high
                    '1010019': BadRequest,          // market price empty
                    '1010020': BadRequest,          // order_type must 1 or 3
                    '1010022': BadRequest,          // Below the minimum purchase price
                    '1010017': BadRequest,          // Order amount cannot be less than %s
                    '1010023': BadRequest,          // Below the minimum sell price
                    '1010318': BadRequest,          // client_oid must be 21 in length, and must be numbers
                    '1010030': OrderNotFound,       // order_id not exists
                    '1010002': BadRequest,          // ticker_id is empty
                    '1010004': BadRequest,          // kline type is error
                    '1010406': BadRequest,          // Depth position error
                    '1010005': BadRequest,          // data is empty
                    '1010364': BadRequest,          // symbol count cannot be more than 10
                },
            },
        });
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name allin#fetchMarkets
         * @description retrieves data on all markets for allin
         * @see https://allinexchange.github.io/spot-docs/v1/en/#all-trading-pairs-2
         */
        // const markets_resp = { 'code': 0,
        //     'msg': 'ok',
        //     'data': { 'server_time': 1720058066,
        //         'symbols': [
        //             { 'symbol': 'BTC-USDT',
        //                 'status': 'TRADING',
        //                 'base_asset': 'USDT',
        //                 'base_precision': 2,
        //                 'base_asset_precision': 8,
        //                 'quote_asset': 'BTC',
        //                 'quote_precision': 6,
        //                 'quote_asset_precision': 8,
        //                 'order_types': [ 'LIMIT', 'MARKET' ],
        //                 'order_side': { 'buy': 2, 'sell': 1 },
        //                 'is_spot_trading_allowed': true,
        //                 'min_order_amount': '2' },
        //             { 'symbol': 'ETH-USDT',
        //                 'status': 'TRADING',
        //                 'base_asset': 'USDT',
        //                 'base_precision': 6,
        //                 'base_asset_precision': 8,
        //                 'quote_asset': 'ETH',
        //                 'quote_precision': 6,
        //                 'quote_asset_precision': 8,
        //                 'order_types': [ 'LIMIT', 'MARKET' ],
        //                 'order_side': { 'buy': 2, 'sell': 1 },
        //                 'is_spot_trading_allowed': true,
        //                 'min_order_amount': '2' } ],
        //         'timezone': 'UTC' },
        //     'time': 1720058066 };
        const promisesRaw = [];
        // const sandboxMode = this.safeBool (this.options, 'sandboxMode', false);
        const rawFetchMarkets = this.safeList (this.options, 'fetchMarkets', [ 'spot', 'linear', 'inverse' ]);
        for (let i = 0; i < rawFetchMarkets.length; i++) {
            const marketType = rawFetchMarkets[i];
            if (marketType === 'spot') {
                promisesRaw.push (this.privateGetOpenV1TickersExchangeInfo (params));
            }
        }
        const promises = await Promise.all (promisesRaw);
        let markets = [];
        for (let i = 0; i < rawFetchMarkets.length; i++) {
            const promise = this.safeDict (promises, i);
            const dataDict = this.safeDict (promise, 'data', {});
            const promiseMarkets = this.safeList (dataDict, 'symbols', []);
            markets = this.arrayConcat (markets, promiseMarkets);
        }
        return this.parseMarkets (markets);
    }

    parseMarket (market: Dict): MarketInterface {
        // market = { 'symbol': 'BTC-USDT',
        //     'status': 'TRADING',
        //     'base_asset': 'USDT',
        //     'base_precision': 2,
        //     'quote_asset': 'BTC',
        //     'quote_precision': 6,
        //     'order_types': [ 'LIMIT', 'MARKET' ],
        //     'order_side': { 'buy': 2, 'sell': 1 },
        //     'is_spot_trading_allowed': true,
        //     'min_order_amount': '2' };
        const origin_symbol = this.safeString (market, 'symbol');
        const active = market['status'] === 'TRADING';
        let baseId = this.safeString (market, 'base_asset');
        let quoteId = this.safeString (market, 'quote_asset');
        const spot = market['is_spot_trading_allowed'] === true;
        const swap = false;
        const future = false;
        const option = false;
        const type_ = 'spot';
        const contract = swap || future || option;
        // if ((origin_symbol !== undefined) && !spot) {
        if (origin_symbol !== undefined) {
            const parts = origin_symbol.split ('-');
            baseId = this.safeString (parts, 0);
            quoteId = this.safeString (parts, 1);
        }
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const settleId = this.safeString (market, 'settleCcy');
        const settle = this.safeCurrencyCode (settleId);
        const base_precision = this.safeInteger (market, 'base_precision');
        const quote_precision = this.safeInteger (market, 'quote_precision');
        const fees = this.safeDict2 (this.fees, type_, 'trading', {});
        let maxLeverage = this.safeString (market, 'lever', '1');
        maxLeverage = Precise.stringMax (maxLeverage, '1');
        const maxSpotCost = this.safeNumber (market, 'maxMktSz');
        let symbol = base + '/' + quote;
        let expiry = undefined;
        let strikePrice = undefined;
        let optionType = undefined;
        if (contract) {
            symbol = symbol + ':' + settle;
            // ???
            expiry = this.safeInteger (market, 'expTime');
            if (future) {
                const ymd = this.yymmdd (expiry);
                symbol = symbol + '-' + ymd;
            } else if (option) {
                strikePrice = this.safeString (market, 'stk');
                optionType = this.safeString (market, 'optType');
                const ymd = this.yymmdd (expiry);
                symbol = symbol + '-' + ymd + '-' + strikePrice + '-' + optionType;
                optionType = (optionType === 'P') ? 'put' : 'call';
            }
        }
        return this.extend (fees, {
            'id': origin_symbol,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'baseId': baseId,
            'quoteId': quoteId,
            'active': active,
            'type': type_,
            'spot': spot,
            'margin': false,
            'swap': false,
            'future': false,
            'option': false,
            'contract': contract,
            'settle': settle,
            'settleId': settleId,
            'contractSize': contract ? this.safeNumber (market, '???') : undefined,
            'linear': contract ? (quoteId === settleId) : undefined,
            'inverse': contract ? (baseId === settleId) : undefined,
            'expiry': expiry,
            'expiryDatetime': this.iso8601 (expiry),
            'strike': strikePrice,
            'optionType': optionType,
            'maker': 0.0001,
            'taker': 0.0002,
            'created': undefined,
            'precision': {
                'amount': base_precision,
                'price': quote_precision,
            },
            'limits': {
                'leverage': {
                    'min': this.parseNumber ('1'),
                    'max': this.parseNumber (maxLeverage),
                },
                'amount': {
                    'min': this.safeNumber (market, 'min_order_amount'),
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': contract ? undefined : maxSpotCost,
                },
            },
            'info': market,
        });
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        // const tickers = { 'code': 0,
        //     'msg': 'ok',
        //     'data': [ { 'symbol': 'BTC-USDT',
        //         'amt_num': 2,
        //         'qty_num': 6,
        //         'amount': '0',
        //         'volume': '0',
        //         'high': '68000',
        //         'low': '68000',
        //         'change': '0',
        //         'price': '68000',
        //         'l_price': '68000' } ],
        //     'time': 1720064580 };
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        const response = await this.publicGetOpenV1TickersMarket (this.extend (request, params));
        const timestamp = this.safeTimestamp (response, 'time');
        const TickerList = this.safeList (response, 'data', []);
        const firstTicker = this.safeValue (TickerList, 0, {});
        firstTicker['timestamp'] = timestamp;
        return this.parseTicker (firstTicker, market);
    }

    async fetchOrderBook (symbol: string, limit: Int = 50, params = {}): Promise<OrderBook> {
        /**
         * @method
         * @name allin#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @see https://allinexchange.github.io/spot-docs/v1/en/#depth
         * @see https://allinexchange.github.io/spot-docs/v1/en/#market-depth
         */
        // const orderbook = { 'code': 0,
        //     'msg': 'ok',
        //     'data': { 'bids': [
        //         { 'price': '63000.21', 'quantity': '0.008694' },
        //         { 'price': '62500.00', 'quantity': '0.034351' },
        //         { 'price': '62000.00', 'quantity': '1.999000' },
        //         { 'price': '40000.00', 'quantity': '0.022334' } ],
        //     'asks': [ { 'price': '72875.36', 'quantity': '0.036895' },
        //         { 'price': '72951.29', 'quantity': '0.040065' },
        //         { 'price': '73104.20', 'quantity': '0.040996' },
        //         { 'price': '78000.00', 'quantity': '0.003000' } ] },
        //     'time': 1721550050 };
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrderBook() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        const response = await this.publicGetOpenV1DepthMarket (this.extend (request, params));
        const result = this.safeDict (response, 'data', {});
        const timestamp = this.safeTimestamp (response, 'time');
        return this.parseOrderBook (result, symbol, timestamp, 'bids', 'asks', 'price', 'quantity');
    }

    async fetchBalance (params = {}): Promise<Balances> {
        /**
         * @method
         * @name allin#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @see https://allinexchange.github.io/spot-docs/v1/en/#account-balance
         */
        // const balances = { 'code': 0,
        //     'msg': 'ok',
        //     'data': [
        //         { 'amount': '1000.1', 'freeze': '0', 'symbol': 'BTC' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'ETH' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'TRX' },
        //         { 'amount': '99988000', 'freeze': '6000', 'symbol': 'USDT' } ],
        //     'time': 1720067861 };
        await this.loadMarkets ();
        const response = await this.privateGetOpenV1Balance (params);
        return this.parseBalance (response);
    }

    async fetchOHLCV (symbol: string, timeframe: string = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        /**
         * @method
         * @name allin#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @see https://allinexchange.github.io/spot-docs/v1/en/#market-k-line-2
         * @see https://allinexchange.github.io/spot-docs/v1/en/#market-k-line
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] not support
         * @param {int} [limit] not support
         */
        // const kline = { 'code': 0,
        //     'msg': 'ok',
        //     'data':
        //      [ { 'time': 1720072680, 'open': '68000.00', 'close': '68000.00', 'high': '68000.00', 'low': '68000.00', 'volume': '0', 'amount': '0' },
        //          { 'time': 1720072740, 'open': '68000.00', 'close': '68000.00', 'high': '68000.00', 'low': '68000.00', 'volume': '0', 'amount': '0' },
        // ],
        //     'time': 1720081645 };
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketId = this.marketId (symbol);
        const duration = this.timeframes[timeframe];
        params = this.extend (params, {
            'symbol': marketId,
            'type': duration,
        });
        const response = await this.publicGetOpenV1KlineMarket (params);
        const klines = this.safeList (response, 'data', []);
        return this.parseOHLCVs (klines, market, timeframe, since, limit);
    }

    async fetchOrders (symbol: Str, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        /**
         * @method
         * @name allin#fetchOrders
         * @description fetches information on multiple orders made by the user
         * @see https://allinexchange.github.io/spot-docs/v1/en/#order-history
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] Starting time, time stamp
         * @param {int} [limit] not support
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.side] Direction，1 sell，2 buy，0 all
         * @param {string} [params.end] Closing time, time stamp
         */
        // const orders = {
        //     'code': 0,
        //     'msg': 'ok',
        //     'data': {
        //         'count': 4,
        //         'orders': [
        //             {
        //                 'order_id': '11574744030837944',
        //                 'trade_no': '499016576021202015341',
        //                 'symbol': 'BTC-USDT',
        //                 'price': '7900',
        //                 'quantity': '1',
        //                 'match_amt': '0',
        //                 'match_qty': '0',
        //                 'match_price': '',
        //                 'side': 1,
        //                 'order_type': 1,
        //                 'status': 6,
        //                 'create_at': 1574744151836,
        //             },
        //         ],
        //     },
        //     'time': 1720243714,
        // };
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = this.extend (params, {
            'symbol': market['id'],
        });
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchOrders', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchOrders', symbol, since, limit, params) as Order[];
        }
        if (since !== undefined) {
            request['start'] = since;
        }
        const response = await this.privateGetOpenV1Orders (request);
        const orders = this.safeList (this.safeDict (response, 'data', {}), 'orders');
        return this.parseOrders (orders, market, since, limit, params);
    }

    async fetchOpenOrders (symbol: Str, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        /**
         * @method
         * @name allin#fetchOpenOrders
         * @description fetch all unfilled currently open orders
         * @see https://allinexchange.github.io/spot-docs/v1/en/#active-orders
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] not support
         * @param {int} [limit] not support
         */
        // {
        //     'code': 0,
        //     'data': [
        //         {
        //             'symbol': 'BTC-USDT',
        //             'order_id': '11574744030837944',
        //             'trade_no': '499016576021202015341',
        //             'price': '7900',
        //             'quantity': '1',
        //             'match_amt': '0',
        //             'match_qty': '0',
        //             'match_price': '',
        //             'side': -1,
        //             'order_type': 1,
        //             'create_at': 1574744151836
        //         },
        //     ],
        // }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = this.extend (params, {
            'symbol': market['id'],
        });
        const response = await this.privateGetOpenV1OrdersLast (request);
        const orders = this.safeList (response, 'data');
        return this.parseOrders (orders, market);
    }

    async fetchOrder (id: string, symbol?: Str, params = {}): Promise<Order> {
        /**
         * @method
         * @name allin#fetchOrder
         * @description fetches information on an order made by the user
         * @see https://allinexchange.github.io/spot-docs/v1/en/#get-order-details
         * @param {string} id the order id
         * @param {string} symbol unified symbol of the market the order was made in
         */
        // {
        //     'code': 0,
        //     'data': {
        //         'order_id': '11574751725833010',
        //         'trade_no': '499073202290421221116',
        //         'symbol': 'BTC-USDT',
        //         'price': '70000',
        //         'quantity': '0.0001',
        //         'match_amt': '7',
        //         'match_qty': '0.0001',
        //         'match_price': '70000',
        //         'fee': '0.0112',
        //         'side': -1,
        //         'order_type': 1,
        //         'status': 4,
        //         'create_at': 1574922846832,
        //         'trades': [{
        //             'amount': '7',
        //             'price': '70000',
        //             'quantity': '0.0001',
        //             'fee': '0.0112',
        //             'time': 1574922846833
        //             }]
        //     }
        // }
        if (id === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a orderId argument');
        }
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'order_id': id,
            'symbol': market['id'],
        };
        const response = await this.privateGetOpenV1OrdersDetail (request);
        const order = this.safeDict (response, 'data');
        return this.parseOrder (order, market);
    }

    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        /**
         * @method
         * @name allin#fetchTrades
         * @description Each filled orders
         * @see https://allinexchange.github.io/spot-docs/v1/en/#each-filled-orders-2
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int} [since] not support
         * @param {int} [limit] not support
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         */
        // const trades = { 'code': 0,
        //     'msg': 'ok',
        //     'data': [
        //         { 'amount': '10200.00000015',
        //             'price': '68000.000001',
        //             'side': 1,
        //             'time': 1719476275833,
        //             'volume': '0.150000' },
        //         { 'amount': '10200.00000015',
        //             'price': '68000.000001',
        //             'side': -1,
        //             'time': 1719476383705,
        //             'volume': '0.150000' } ],
        //     'time': 1720167549 };
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        const response = await this.publicGetOpenV1TradeMarket (request);
        const trades = this.safeList (response, 'data');
        return this.parseTrades (trades, market, since, limit);
    }

    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params = {}): Promise<Order> {
        /**
         * @method
         * @name allin#createOrder
         * @description create a trade order
         * @see https://allinexchange.github.io/spot-docs/v1/en/#place-new-order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of you want to trade in units of the base currency
         * @param {float} [price] the price that the order is to be fullfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         */
        // {
        //     "code": 0,
        //     "msg": "ok",
        //     "data": {
        //         "order_id": "xxx",
        //         "trade_no": "xxx",
        //     },
        // }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const symbolId = this.safeString (market, 'id');
        const request: Dict = this.createOrderRequest (
            symbol,
            type,
            side,
            amount,
            price,
            params,
            market
        );
        const response = await this.privatePostOpenV1OrdersPlace (request);
        const orderData = this.safeDict (response, 'data');
        const timestamp = this.safeInteger (response, 'time');  // timestamp in s
        return this.parseOrder ({
            'order_id': this.safeString (orderData, 'order_id'),
            'trade_no': this.safeString (orderData, 'trade_no'),
            'symbol': symbolId,
            'price': price,
            'quantity': amount,
            'match_amt': '0',
            'match_qty': '0',
            'match_price': '',
            'side': request['side'],
            'order_type': request['order_type'],
            'status': 'open',
            'create_at': timestamp,
        }, market);
    }

    async cancelOrder (id: string, symbol: Str, params = {}): Promise<{}> {
        /**
         * @method
         * @name allin#cancelOrder
         * @description cancels an open order
         * @see https://allinexchange.github.io/spot-docs/v1/en/#cancel-an-order-in-order
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         */
        // const response = { 'code': 0,
        //     'msg': 'ok',
        //     'data': { 'create_at': 1720775927804,
        //         'left': '0.100000',
        //         'match_amt': '0',
        //         'match_price': '0',
        //         'match_qty': '0',
        //         'order_id': '40',
        //         'order_type': 1,
        //         'price': '60000.00',
        //         'quantity': '0.100000',
        //         'side': 1,
        //         'status': 6,
        //         'symbol': 'BTC-USDT',
        //         'ticker': 'BTC-USDT',
        //         'trade_no': '40545292203741231233614' },
        //     'time': 1720775985 };
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
            'order_id': id,
        };
        const response = await this.privatePostOpenV1OrdersCancel (request);
        const orderData = this.safeDict (response, 'data');
        return this.parseOrder (orderData, market);
    }

    createOrderRequest (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num, params: {}, market: Market): Dict {
        const orderType = this.toOrderType (type);
        const orderSide = this.toOrderSide (side);
        const request = {
            'symbol': market['id'],
            'side': this.forceString (orderSide),
            'order_type': orderType,
            'quantity': this.forceString (amount),
        };
        if (price !== undefined && orderType === 'LIMIT') {
            request['price'] = this.forceString (price);
        }
        const requestParams = this.omit (params, [
            'postOnly', 'stopLossPrice', 'takeProfitPrice', 'stopPrice',
            'triggerPrice', 'trailingTriggerPrice',
            'trailingPercent', 'quoteOrderQty' ]);
        return this.extend (request, requestParams);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.implodeHostname (this.urls['api'][api]) + path;
        const nonce = this.nonce ().toString ();
        const ts = nonce;
        const client_id = this.apiKey;
        let requestParams = this.extend ({}, params);
        if (api === 'private') {
            this.checkRequiredCredentials ();
            requestParams = this.extend (requestParams, { 'ts': ts, 'nonce': nonce, 'sign': '', 'client_id': this.apiKey });
            const s = 'client_id=' + client_id + '&nonce=' + nonce + '&ts=' + ts;
            const v = this.hmac (this.encode (s), this.encode (this.secret), sha256);
            requestParams['sign'] = v;
        }
        if (method === 'GET') {
            if (Object.keys (requestParams).length) {
                url += '?' + this.rawencode (requestParams);
            }
        } else if (method === 'POST') {
            if (!body) {
                body = {};
            }
            body = this.extend (body, requestParams);
            const headersPost = {
                'Content-Type': 'application/x-www-form-urlencoded',
            };
            if (!headers) {
                headers = headersPost;
            } else {
                headers = this.extend (headers, headersPost);
            }
        }
        if (body) {
            body = this.urlencode (body);
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        // const ticker = { 'symbol': 'BTC-USDT',
        //     'amt_num': 2,
        //     'qty_num': 6,
        //     'amount': '0',
        //     'volume': '0',
        //     'high': '68000',
        //     'low': '68000',
        //     'change': '0',
        //     'price': '68000',
        //     'l_price': '68000' };
        const marketId = this.safeString (ticker, 'symbol');
        const symbol = this.safeSymbol (marketId, market, undefined);
        const last = this.safeString (ticker, 'price');
        const baseVolume = this.safeString (ticker, 'volume'); // 数量
        const quoteVolume = this.safeString (ticker, 'amount'); // 金额
        const timestamp = this.safeInteger (ticker, 'timestamp');
        return this.safeTicker ({
            'symbol': symbol,
            'info': ticker,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'open': undefined,
            'high': this.safeString (ticker, 'high'),
            'low': this.safeString (ticker, 'low'),
            'close': last,
            'bid': undefined,
            'bidVolume': undefined,
            'ask': undefined,
            'askVolume': undefined,
            'vwap': undefined,
            'last': last,
            'change': this.safeString (ticker, 'change'),
            'average': undefined,
            'quoteVolume': quoteVolume,
            'baseVolume': baseVolume,
        }, market);
    }

    parseBalance (response: any): Balances {
        // const balances = { 'code': 0,
        //     'msg': 'ok',
        //     'data': [
        //         { 'amount': '1000.1', 'freeze': '0', 'symbol': 'BTC' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'ETH' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'TRX' },
        //         { 'amount': '99988000', 'freeze': '6000', 'symbol': 'USDT' } ],
        //     'time': 1720067861 };
        const originBalances = this.safeList (response, 'data', []);
        const timestamp = this.safeTimestamp (response, 'timestamp');
        const balances = {
            'info': originBalances,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        };
        for (let i = 0; i < originBalances.length; i++) {
            const originBalance = originBalances[i];
            const symbol = this.safeString (originBalance, 'symbol');
            const used = this.safeString (originBalance, 'freeze');
            const total = this.safeString (originBalance, 'amount');
            const free = Precise.stringSub (total, used);
            balances[symbol] = {
                'free': free,
                'used': used,
                'total': total,
                'debt': 0, // ???
            };
        }
        return this.safeBalance (balances);
    }

    parseOHLCV (ohlcv: any, market?: Market): OHLCV {
        // const klines = [ { 'time': 1720072680,
        //     'open': '68000.00',
        //     'close': '68000.00',
        //     'high': '68000.00',
        //     'low': '68000.00',
        //     'volume': '0',
        //     'amount': '0' },
        // { 'time': 1720072740,
        //     'open': '68000.00',
        //     'close': '68000.00',
        //     'high': '68000.00',
        //     'low': '68000.00',
        //     'volume': '0',
        //     'amount': '0' },
        // ];
        return [
            this.safeTimestamp (ohlcv, 'time'),
            this.safeInteger (ohlcv, 'open'),
            this.safeInteger (ohlcv, 'high'),
            this.safeInteger (ohlcv, 'low'),
            this.safeInteger (ohlcv, 'close'),
            this.safeInteger (ohlcv, 'volume'),
        ];
    }

    parseTrade (trade: Dict, market?: Market): Trade {
        //         { 'amount': '10200.00000015',
        //             'price': '68000.000001',
        //             'side': 1,
        //             'time': 1719476275833,
        //             'volume': '0.150000' }
        //         {
        //             'amount': '7',
        //             'price': '70000',
        //             'quantity': '0.0001',
        //             'fee': '0.0112',
        //             'time': 1574922846833
        //             }
        const timestamp = this.safeTimestamp (trade, 'time');
        const symbol = this.safeString (market, 'symbol');
        const sideNumber = this.safeInteger (trade, 'side');
        const side = (sideNumber === 1) ? 'sell' : 'buy';
        const amount = this.safeString (trade, 'amount');
        const volume = this.safeString (trade, 'volume');
        return this.safeTrade ({
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'id': undefined,
            'order': undefined,
            'type': undefined,
            'side': side,
            'takerOrMaker': undefined,
            'price': this.safeString (trade, 'price'),
            'amount': amount,
            'cost': volume,
            'fee': undefined,
        }, market);
    }

    parseOrderType (type_: Str) {
        // int order_type, 1 Limit，3 Market
        if (type_ === 'LIMIT' || type_ === '1') {
            return 'limit';
        } else if (type_ === 'MARKET' || type_ === '2') {
            return 'market';
        } else {
            throw new ExchangeError ('unknown orderType: ' + this.numberToString (type_));
        }
    }

    toOrderType (type_: string) {
        // ccxt orderType to allin orderType
        if (type_ === 'limit') {
            return 'LIMIT';
        } else if (type_ === 'market') {
            return 'MARKET';
        } else {
            throw new ExchangeError ('unknown orderType: ' + type_);
        }
    }

    parseOrderSide (side: Int) {
        if (side === 2) {
            return 'buy';
        } else {
            return 'sell';
        }
    }

    toOrderSide (side: string) {
        if (side === 'buy') {
            return 2;
        } else {
            return 1;
        }
    }

    parseOrderStatus (status: Int) {
        // Status 2 Outstanding，3 Partial filled，4 all filled，
        // 5 cancel after partial filled，
        const statusStr = this.numberToString (status);
        const statusDict = {
            '1': 'open',        // no
            '2': 'open',        // 2 Outstanding
            '3': 'open',        // 3 Partial filled
            '4': 'closed',      // 4 all filled
            '5': 'canceled',    // 5 canceled after partial filled
            '6': 'canceled',    // 6 all cancel
        };
        return this.safeString (statusDict, statusStr);
    }

    parseOrder (order: Dict, market?: Market): Order {
        // // fetchOrders //
        // const order = {
        //     'order_id': '11574744030837944',
        //     'trade_no': '499016576021202015341', // removed
        //     'symbol': 'BTC-USDT',
        //     'price': '7900',
        //     'quantity': '1',
        //     'match_amt': '0',
        //     'match_qty': '0',
        //     'match_price': '',
        //     'side': -1,
        //     'order_type': 1,
        //     'status': 6,
        //     'create_at': 1721550307.615717,
        // };
        // // order detail //
        //     'data': {
        //         'order_id': '11574751725833010',
        //         'trade_no': '499073202290421221116', // removed
        //         'symbol': 'BTC-USDT',
        //         'price': '70000',
        //         'quantity': '0.0001',
        //         'match_amt': '7',
        //         'match_qty': '0.0001',
        //         'match_price': '70000',
        //         'fee': '0.0112',
        //         'side': -1,
        //         'order_type': 1,
        //         'status': 4,
        //         'create_at': 1721550307.615717,
        //         'trades': [{
        //             'amount': '7',
        //             'price': '70000',
        //             'quantity': '0.0001',
        //             'fee': '0.0112',
        //             'time': 1574922846833
        //             }]
        //     }
        const timestamp = this.safeTimestamp (order, 'create_at');
        const symbol = this.safeString (market, 'symbol');
        const type_ = this.parseOrderType (this.safeString (order, 'order_type'));
        const side = this.parseOrderSide (this.safeInteger (order, 'side'));
        const price = this.safeString (order, 'price');
        const amount = this.safeString (order, 'quantity');
        const status = this.parseOrderStatus (this.safeInteger (order, 'status'));
        const average = this.safeString (order, 'match_price');
        const filled = this.safeString (order, 'match_qty', '0');
        const cost = this.safeString (order, 'match_amt', '0');
        const feeCost = this.safeString (order, 'fee', undefined);
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = {
                'currency': this.safeString (order, 'quoteAsset'),
                'cost': feeCost,
                'rate': undefined,
            };
        }
        const trades = this.safeList (order, 'trades', []);
        return this.safeOrder ({
            'info': order,
            'id': this.safeString (order, 'order_id'),
            'clientOrderId': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'lastUpdateTimestamp': undefined,
            'symbol': symbol,
            'type': type_,
            'timeInForce': undefined,
            'postOnly': undefined,
            'reduceOnly': undefined,
            'side': side,
            'price': price,
            'triggerPrice': undefined,
            'amount': amount,
            'cost': cost,
            'average': average,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': fee,
            'trades': trades,
        }, market);
    }

    handleErrors (statusCode: Int, statusText: string, url: string, method: string, responseHeaders: Dict, responseBody: string, response: any, requestHeaders: any, requestBody: any) {
        if (statusCode >= 400) {
            throw new NetworkError (this.id + ' ' + statusText);
        }
        // const response = { 'code': 0,
        //     'msg': 'ok',
        //     'data': [
        //         { 'amount': '1000.1', 'freeze': '0', 'symbol': 'BTC' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'ETH' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'TRX' },
        //         { 'amount': '99988000', 'freeze': '6000', 'symbol': 'USDT' } ],
        //     'time': 1720067861 };
        if (response === undefined) {
            return undefined; // fallback to default error handler
        }
        const responseCode: int = this.safeInteger (response, 'code', 0);
        if (responseCode !== 0) {
            const codeStr = this.numberToString (responseCode);
            const messageNew = this.safeString (response, 'msg');
            const msg = this.id + ', code: ' + codeStr + ', ' + messageNew;
            this.log (response);
            this.throwExactlyMatchedException (this.exceptions['exact'], codeStr, msg);
        }
    }
}
