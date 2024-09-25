
//  ---------------------------------------------------------------------------

import Exchange from './abstract/allin.js';
import { ArgumentsRequired, BadRequest, NetworkError, ExchangeError,
    OrderNotFound, AuthenticationError, RateLimitExceeded, BadSymbol,
    OperationFailed, BaseError,
    InsufficientFunds, OperationRejected,
    OrderNotFillable, InvalidOrder, NotSupported } from './base/errors.js';
import { TICK_SIZE } from './base/functions/number.js';
import { Precise } from './base/Precise.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import type { Int, OrderSide, OrderType, Trade, Order, OHLCV, Balances, Str, Ticker, OrderBook, Market, MarketInterface, Num, Dict, int, Position, Strings, Leverage, FundingRate } from './base/types.js';

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
            'precisionMode': TICK_SIZE,
            'options': {
                'sandboxMode': false,
                'fetchMarkets': [ 'spot', 'future' ],
                'defaultType': 'spot',  // 'future', 'spot'
            },
            'has': {
                'CORS': true,
                'spot': true,
                'margin': true,
                'swap': true,
                'future': true,
                'option': false,
                'borrowCrossMargin': true,
                'brushVolume': true,    // 刷单接口
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
                'fetchTickers': false,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
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
                    'spotPublic': 'http://api.aie.test',
                    'spotPrivate': 'http://api.aie.test',
                    'futurePublic': 'http://futuresopen.aie.test',
                    'futurePrivate': 'http://futuresopen.aie.test',
                },
                'logo': 'https://allinexchange.github.io/spot-docs/v1/en/images/logo-e47cee02.svg',
                'doc': [ 'https://allinexchange.github.io/spot-docs/v1/en/#introduction' ],
                'api': {
                    'spotPublic': 'http://api.aie.prod',
                    'spotPrivate': 'http://api.aie.prod',
                    'futurePublic': 'http://futuresopen.aie.prod',
                    'futurePrivate': 'http://futuresopen.aie.prod',
                },
            },
            'api': {
                'spotPublic': {
                    'get': {
                        // public
                        '/open/v1/tickers/market': 0,
                        '/open/v1/depth/market': 0,
                        '/open/v1/trade/market': 0,
                        '/open/v1/kline/market': 0,
                        '/open/v1/tickers/exchange_info': 0,
                    },
                },
                'spotPrivate': {
                    'get': {
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
                        '/open/v1/tickers/brush': 0,  // 刷量
                    },
                },
                'futurePublic': {
                    'get': {
                        // public
                        '/open/api/v2/market/kline': 0,
                        '/open/api/v2/market/list': 0,
                        '/open/api/v2/market/deals': 0,
                        '/open/api/v2/market/depth': 0,
                        '/open/api/v2/market/state': 0,
                        '/open/api/v2/market/state/all': 0,
                    },
                },
                'futurePrivate': {
                    'get': {
                        // private
                        '/open/api/v2/order/deals': 0,
                        '/open/api/v2/order/finished': 0,
                        '/open/api/v2/order/detail': 0,
                        '/open/api/v2/order/pending': 0,
                        '/open/api/v2/order/stop/pending': 0,
                        '/open/api/v2/order/stop/finished': 0,
                        '/open/api/v2/setting/leverage': 0,
                        '/open/api/v2/asset/query': 0,
                        '/open/api/v2/asset/history': 0,
                        '/open/api/v2/position/pending': 0,
                        '/open/api/v2/position/margin': 0,
                    },
                    'post': {
                        '/open/api/v2/position/margin': 0,
                        '/open/api/v2/order/market': 0,
                        '/open/api/v2/order/cancel/all': 0,
                        '/open/api/v2/order/cancel': 0,
                        '/open/api/v2/order/cancel/batch': 0,
                        '/open/api/v2/order/limit': 0,
                        '/open/api/v2/order/stop': 0,
                        '/open/api/v2/order/stop/cancel': 0,
                        '/open/api/v2/order/stop/cancel/all': 0,
                        '/open/api/v2/setting/leverage': 0,
                        '/open/api/v2/position/close/limit': 0,
                        '/open/api/v2/position/close/market': 0,
                        '/open/api/v2/position/close/stop': 0,
                        '/open/api/v2/order/report': 0,  // 刷量
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
                    '10500': InsufficientFunds,         // system error
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
                    '1010017': OrderNotFillable,          // Order amount cannot be less than %s
                    '1010023': BadRequest,          // Below the minimum sell price
                    '1010318': BadRequest,          // client_oid must be 21 in length, and must be numbers
                    '1010030': OrderNotFound,       // order_id not exists
                    '1010002': BadRequest,          // ticker_id is empty
                    '1010004': BadRequest,          // kline type is error
                    '1010406': BadRequest,          // Depth position error
                    '1010005': BadRequest,          // data is empty
                    '1010364': BadRequest,          // symbol count cannot be more than 10
                    'default': BaseError,
                    // future
                    '13128': InsufficientFunds,     // balance not enough
                    '13122': OrderNotFound,
                    '10013': OrderNotFound,
                    '10029': OrderNotFillable,      // order count over limit
                    '10056': ExchangeError,         // depth insufficient
                    '10057': ExchangeError,         // failure to collect reward
                    '10058': BadRequest,            // this event has reached its maximum number of participants
                    '10059': InsufficientFunds,     // this reward has been issued, please pay attention to the next activity
                    '10060': ExchangeError,         // activity has not started yet
                    '10061': BadRequest,            // position is not exist
                    '10062': InvalidOrder,          // the order quantity is too smal
                    '10063': InvalidOrder,          // failure to fulfil activity requirements
                    '13127': InvalidOrder,          // amount exceed limit
                    '10064': OperationRejected,     // ban trade
                    '20001': BadRequest,            // leverage illega
                    '20002': BadRequest,            // market  illegal
                    '20003': BadSymbol,             // position type illegal
                    '20004': BadRequest,            // adjust margin type illegal
                    '20005': BadRequest,            // order side illegal
                    '20006': BadRequest,            // order id illegal
                    '20007': BadRequest,            // position id illegal
                    '20008': BadRequest,            // quantity illegal
                    '20010': BadRequest,            // price illegal,
                    '20011': BadRequest,            // stop loss price type illegal
                    '20012': BadRequest,            // stop loss price illegal
                    '20013': BadRequest,            // take profit price type illegal
                    '20014': BadRequest,            // take profit price illegal
                    '20015': BadRequest,            // page illegal
                    '20016': BadRequest,            // page size illegal
                    '20017': BadRequest,            // start time illegal
                    '20018': BadRequest,            // end time illegal
                    '20019': BadRequest,            // kline type illegal
                    '20020': BadRequest,            // stop price illegal
                    '20021': BadRequest,            // current price illegal
                    '20022': BadRequest,            // step illegal
                    '12026': ExchangeError,         // internal error
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
        const rawFetchMarkets = this.safeList (this.options, 'fetchMarkets', [ 'spot', 'future' ]);
        for (let i = 0; i < rawFetchMarkets.length; i++) {
            const marketType = rawFetchMarkets[i];
            if (marketType === 'spot') {
                promisesRaw.push (this.spotPublicGetOpenV1TickersExchangeInfo (params));
            } else if (marketType === 'future') {
                promisesRaw.push (this.futurePublicGetOpenApiV2MarketList (params));
            }
        }
        const promises = await Promise.all (promisesRaw);
        let markets = [];
        let promiseMarkets = undefined;
        for (let i = 0; i < rawFetchMarkets.length; i++) {
            const type_ = rawFetchMarkets[i];
            const promise = this.safeDict (promises, i);
            if (type_ === 'spot') {
                const dataDict = this.safeDict (promise, 'data', {});
                promiseMarkets = this.safeList (dataDict, 'symbols', []);
            } else if (type_ === 'future') {
                promiseMarkets = this.safeList (promise, 'data', []);
            } else {
                continue;
            }
            markets = this.arrayConcat (markets, promiseMarkets);
        }
        return this.parseMarkets (markets);
    }

    parseMarket (market: Dict): MarketInterface {
        const spot = this.safeBool (market, 'is_spot_trading_allowed', false) === true;
        if (spot) {
            return this.parseSpotMarket (market);
        } else {
            return this.parseFutureMarket (market);
        }
    }

    parseFutureMarket (market: Dict): MarketInterface {
        // const market = { 'type': 1,
        //     'leverages': [ '3', '5', '8', '10', '15', '20', '30', '50', '100' ],
        //     'merges': [ '100', '10', '1', '0.1', '0.01' ],
        //     'name': 'BTCUSDT',
        //     'stock': 'BTC',
        //     'money': 'USDT',
        //     'fee_prec': 8,
        //     'tick_size': '0.01',
        //     'stock_prec': 8,
        //     'money_prec': 2,
        //     'amount_prec': 4,
        //     'amount_min': '0.0001',
        //     'available': true,
        //     'limits': [ [ '2500.0001', '3', '0.036' ], [ '2000.0001', '5', '0.032' ], [ '1500.0001', '8', '0.028' ], [ '1000.0001', '10', '0.024' ], [ '500.0001', '15', '0.02' ], [ '250.0001', '20', '0.016' ], [ '100.0001', '30', '0.012' ], [ '50.0001', '50', '0.008' ], [ '20.0001', '100', '0.004' ] ],
        //     'sort': 100 };
        const origin_symbol = this.safeString (market, 'name');
        const active = this.safeBool (market, 'available');
        const baseId = this.safeString (market, 'stock');
        const quoteId = this.safeString (market, 'money');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const spot = false;
        const future = false;
        const swap = true;
        const option = false;
        const type_ = 'swap';
        const contract = swap || future || option;
        let settle = undefined;
        const futureType = this.safeInteger (market, 'type');
        let linear = undefined;
        if (futureType === 1) {
            settle = quote;
            linear = true;
        } else {
            settle = base;
            linear = false;
        }
        const settleId = settle;
        const symbol = base + '/' + quote + ':' + settle;
        const fees = {};
        const leverages = this.safeList (market, 'leverages');
        const maxLeverage = this.safeString (leverages, leverages.length - 1);
        const minLeverage = this.safeString (leverages, 0);
        const base_precision = this.safeString (market, 'amount_prec');
        const quote_precision = this.safeString (market, 'money_prec');
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
            'swap': swap,
            'future': future,
            'option': false,
            'contract': contract,
            'settle': settle,
            'settleId': settleId,
            'contractSize': contract ? 1 : undefined,
            'linear': linear,
            'inverse': !linear,
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'maker': 0.0001,
            'taker': 0.0002,
            'created': undefined,
            'precision': {
                'amount': this.parseNumber (this.parsePrecision (base_precision)),
                'price': this.parseNumber (this.parsePrecision (quote_precision)),
            },
            'limits': {
                'leverage': {
                    'min': this.parseNumber (minLeverage),
                    'max': this.parseNumber (maxLeverage),
                },
                'amount': {
                    'min': this.safeNumber (market, 'amount_min'),
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'info': market,
        });
    }

    parseSpotMarket (market: Dict): MarketInterface {
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
        const spot = true;
        const future = false;
        const swap = false;
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
        const base_precision = this.safeString (market, 'base_precision');
        const quote_precision = this.safeString (market, 'quote_precision');
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
                'amount': this.parseNumber (this.parsePrecision (base_precision)),
                'price': this.parseNumber (this.parsePrecision (quote_precision)),
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
        // spot
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
        // future
        // {
        //     "code": 0,
        //     "msg": "success",
        //     "data": {
        //       "market": "ETHUSDT",
        //       "amount": "4753.05",
        //       "high": "1573.89",
        //       "last": "1573.89",
        //       "low": "1571.23",
        //       "open": "1571.23",
        //       "change": "0.0016929411989333",
        //       "period": 86400,
        //       "volume": "3.02",
        //       "funding_time": 400,
        //       "position_amount": "2.100",
        //       "funding_rate_last": "0.00375",
        //       "funding_rate_next": "0.00293873",
        //       "funding_rate_predict": "-0.00088999",
        //       "insurance": "10500.45426906585552617850",
        //       "sign_price": "1581.98",
        //       "index_price": "1578.12",
        //       "sell_total": "112.974",
        //       "buy_total": "170.914"
        //     }
        //   }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (market['spot']) {
            response = await this.spotPublicGetOpenV1TickersMarket (this.extend (request, params));
        } else {
            response = await this.futurePublicGetOpenApiV2MarketState (this.extend (request, params));
        }
        const timestamp = this.safeTimestamp (response, 'time', this.milliseconds ());
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
        // future {
        //     "code": 0,
        //     "msg": "success",
        //     "data": {
        //       "index_price": "1577.63",
        //       "sign_price": "1581.5",
        //       "time": 1697620709569,
        //       "last": "1573.89",
        //       "asks": [
        //         [
        //           "1621.22",
        //           "30.613"
        //         ]
        //       ],
        //       "bids": [
        //         [
        //           "1573.84",
        //           "0.819"
        //         ]
        //       ]
        //     }
        //   }
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrderBook() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        let response = undefined;
        if (market['spot']) {
            const request: Dict = {
                'symbol': market['id'],
            };
            response = await this.spotPublicGetOpenV1DepthMarket (request);
            const result = this.safeDict (response, 'data', {});
            const timestamp = this.safeTimestamp (response, 'time');
            return this.parseOrderBook (result, symbol, timestamp, 'bids', 'asks', 'price', 'quantity');
        } else {
            const request: Dict = {
                'market': market['id'],
            };
            response = await this.futurePublicGetOpenApiV2MarketDepth (request);
            const result = this.safeDict (response, 'data', {});
            const timestamp = this.safeInteger (result, 'time');
            const orderbook = this.parseOrderBook (result, symbol, timestamp, 'bids', 'asks', 0, 1);
            orderbook['markPrice'] = this.safeFloat (result, 'sign_price');
            orderbook['indexPrice'] = this.safeFloat (result, 'index_price');
            orderbook['lastPrice'] = this.safeFloat (result, 'last');
            return orderbook;
        }
    }

    async fetchBalance (params = {}): Promise<Balances> {
        /**
         * @method
         * @name allin#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @see https://allinexchange.github.io/spot-docs/v1/en/#account-balance
         * @param {string} [params.type] wallet type, ['spot', 'future']
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
        let response = undefined;
        let currentType = this.safeString (params, 'defaultType', undefined);
        if (!currentType) {
            currentType = this.options['defaultType'];
        }
        if (currentType === 'spot') {
            response = await this.spotPrivateGetOpenV1Balance ();
            return this.parseSpotBalance (response);
        } else if (currentType === 'future' || currentType === 'swap') {
            response = await this.futurePrivateGetOpenApiV2AssetQuery ();
            return this.parseFutureBalance (response);
        }
    }

    async fetchLeverage (symbol: string, params = {}): Promise<Leverage> {
        /**
         * @method
         * @name allin#fetchLeverage
         * @description fetch the set leverage for a market
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [leverage structure]{@link https://docs.ccxt.com/#/?id=leverage-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'market': market['id'],
        };
        const leverage = await this.futurePrivateGetOpenApiV2SettingLeverage (request);
        return this.parseLeverage (leverage, market);
    }

    async fetchPosition (symbol: string, params = {}): Promise<Position> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchPosition() requires a symbol argument');
        }
        await this.loadMarkets ();
        const postionList = await this.fetchPositions ([ symbol ], params);
        if (postionList.length > 0) {
            return postionList[0];
        } else {
            return undefined;
        }
    }

    async fetchPositions (symbols: Strings = undefined, params = {}): Promise<Position[]> {
        await this.loadMarkets ();
        let symbol = undefined;
        const request = {};
        if ((symbols !== undefined) && Array.isArray (symbols)) {
            const symbolsLength = symbols.length;
            if (symbolsLength > 1) {
                throw new ArgumentsRequired (this.id + ' fetchPositions() does not accept an array with more than one symbol');
            } else if (symbolsLength === 1) {
                symbol = symbols[0];
            }
            symbols = this.marketSymbols (symbols);
        } else if (symbols !== undefined) {
            symbol = symbols;
            symbols = [ this.symbol (symbol) ];
        }
        if (symbol !== undefined) {
            const market = this.market (symbol);
            request['market'] = market['id'];
        }
        const response = await this.futurePrivateGetOpenApiV2PositionPending (request);
        const positions = this.safeList (response, 'data', []);
        const positionList = [];
        for (let i = 0; i < positions.length; i++) {
            const pos = positions[i];
            const marketId = pos['market'];
            const market = this.safeMarket (marketId);
            const ccPos = this.parsePosition (pos, market);
            positionList.push (ccPos);
        }
        if (symbols !== undefined) {
            return this.filterByArrayPositions (positionList, 'symbol', symbols, false);
        } else {
            return positionList;
        }
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
         * @param {int} [since] timestamp in ms of the earliest funding rate to fetch
         * @param {int} [limit] the maximum amount of [funding rate structures]
         */
        // const kline = { 'code': 0,
        //     'msg': 'ok',
        //     'data':
        //      [ { 'time': 1720072680, 'open': '68000.00', 'close': '68000.00', 'high': '68000.00', 'low': '68000.00', 'volume': '0', 'amount': '0' },
        //          { 'time': 1720072740, 'open': '68000.00', 'close': '68000.00', 'high': '68000.00', 'low': '68000.00', 'volume': '0', 'amount': '0' },
        // ],
        //     'time': 1720081645 };
        // const futureKline = { 'code': 0,
        //     'msg': 'success',
        //     'data': [ [ 1722669840, '66019', '66019', '66019', '66019', '0', '0', 'BTCUSDT' ],
        //         [ 1722669900, '66019', '66019', '66019', '66019', '0', '0', 'BTCUSDT' ],
        //         [ 1722669960, '66019', '66019', '66019', '66019', '0', '0', 'BTCUSDT' ],
        //         [ 1722670020, '66019', '66019', '66019', '66019', '0', '0', 'BTCUSDT' ] ],
        //     'time': 1722670456 };
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketId = this.marketId (symbol);
        const spot = market['spot'];
        // const swap = market['swap'];
        let duration = this.timeframes[timeframe];
        let request = {};
        let response = undefined;
        if (spot) {
            request = {
                'symbol': marketId,
                'type': duration,
            };
            response = await this.spotPublicGetOpenV1KlineMarket (request);
        } else {
            let start = undefined;
            let end = undefined;
            // duration time steep
            const interval = this.parseTimeframe (timeframe);
            if (limit && since) {
                start = since;
                end = start + limit * interval * 1000 - 1;
            } else if (limit) {
                end = this.milliseconds ();
                start = end - limit * interval * 1000;
            } else if (since) {
                end = this.milliseconds ();
                start = since;
            }
            duration = String (duration).toLowerCase ();
            request = {
                'market': marketId,
                'type': duration,
            };
            if (start !== undefined) {
                request['start_time'] = this.parseToInt (start / 1000);
            }
            if (end !== undefined) {
                request['end_time'] = this.parseToInt (end / 1000);
            }
            response = await this.futurePublicGetOpenApiV2MarketKline (request);
        }
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
        let request = undefined;
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchOrders', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchOrders', symbol, since, limit, params) as Order[];
        }
        let response = undefined;
        if (market['spot']) {
            request = {
                'symbol': market['id'],
                'side': 0,
            };
            if (since !== undefined) {
                request['start'] = since;
            }
            response = await this.spotPrivateGetOpenV1Orders (request);
        } else {
            request = {
                'market': market['id'],
            };
            if (since !== undefined) {
                request['start_time'] = since;
            }
            response = await this.futurePrivateGetOpenApiV2OrderFinished (request);
        }
        const orders = this.safeList2 (this.safeDict (response, 'data', {}), 'orders', 'records');
        if (orders) {
            return this.parseOrders (orders, market, since, limit, params);
        } else {
            return [];
        }
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
        let request: Dict = undefined;
        let response = undefined;
        let orders = undefined;
        if (market['spot']) {
            request = {
                'symbol': market['id'],
            };
            response = await this.spotPrivateGetOpenV1OrdersLast (request);
            orders = this.safeList (response, 'data');
        } else {
            request = {
                'market': market['id'],
            };
            response = await this.futurePrivateGetOpenApiV2OrderPending (request);
            orders = this.safeList (this.safeDict (response, 'data'), 'records');
        }
        if (orders) {
            return this.parseOrders (orders, market);
        } else {
            return [];
        }
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
        // future
        // const futureOrder = {
        //     'code': 0,
        //     'msg': 'success',
        //     'data': {
        //         'order_id': 1470445037,
        //         'position_id': 0,
        //         'market': 'ETHUSDT',
        //         'type': 2,
        //         'side': 1,
        //         'left': '0',
        //         'amount': '1',
        //         'filled': '1',
        //         'deal_fee': '0.7869',
        //         'price': '0',
        //         'avg_price': '1573.84',
        //         'deal_stock': '1573.84',
        //         'position_type': 1,
        //         'leverage': '20',
        //         'update_time': 1697616547.90107,
        //         'create_time': 1697616547.901067,
        //         'status': 3,
        //         'stop_loss_price': '-',
        //         'take_profit_price': '-',
        //         'client_oid': '36341ddd362363263626',
        //     },
        // };
        if (id === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a orderId argument');
        }
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        let response = undefined;
        if (market['spot']) {
            const request: Dict = {
                'order_id': id,
                'symbol': market['id'],
            };
            response = await this.spotPrivateGetOpenV1OrdersDetail (request);
        } else {
            const request: Dict = {
                'order_id': id,
                'market': market['id'],
            };
            response = await this.futurePrivateGetOpenApiV2OrderDetail (request);
        }
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
        let response = undefined;
        if (market['spot']) {
            const request: Dict = {
                'symbol': market['id'],
            };
            response = await this.spotPublicGetOpenV1TradeMarket (request);
        } else {
            const request: Dict = {
                'market': market['id'],
            };
            response = await this.futurePublicGetOpenApiV2MarketDeals (request);
        }
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
        // const spot = { 'code': 0,
        //     'msg': 'ok',
        //     'data': { 'create_at': 1724217619.237232,
        //         'frm': 'USDT',
        //         'left': '0.000000',
        //         'match_amt': '5939.74200000',
        //         'match_price': '59397.42',
        //         'match_qty': '0.100000',
        //         'order_id': '112321459',
        //         'order_sub_type': 0,
        //         'order_type': 'LIMIT',
        //         'price': '60000.21',
        //         'quantity': '0.100000',
        //         'side': 2,
        //         'status': 3,
        //         'stop_price': '0',
        //         'symbol': 'BTC-USDT',
        //         'ticker': 'BTC-USDT',
        //         'ticker_id': 7,
        //         'timestamp': 1724217619.237232,
        //         'to': 'BTC',
        //         'trade_no': '40546382832340918031114',
        //         'update_timestamp': 1724217619.237275 },
        //     'time': 1724217619.237593 };
        // future
        // const future = { 'code': 0,
        //     'msg': 'success',
        //     'data': { 'order_id': '22710426',
        //         'position_id': '0',
        //         'market': 'BTCUSDT',
        //         'type': '1',
        //         'side': '1',
        //         'left': '0.0099',
        //         'amount': '0.0099',
        //         'filled': '0',
        //         'deal_fee': '0',
        //         'price': '59181.464',
        //         'avg_price': '',
        //         'deal_stock': '0',
        //         'position_type': '2',
        //         'leverage': '5',
        //         'update_time': '1724067149.721356',
        //         'create_time': '1724067149.721356',
        //         'status': '1',
        //         'stop_loss_price': '',
        //         'take_profit_price': '',
        //         'client_oid': '40546335150450903175323' },
        //     'time': 1723130482 };
        await this.loadMarkets ();
        const market = this.market (symbol);
        let response = undefined;
        if (market['spot']) {
            const request: Dict = this.createSpotOrderRequest (
                symbol,
                type,
                side,
                amount,
                price,
                params,
                market
            );
            response = await this.spotPrivatePostOpenV1OrdersPlace (request);
            const orderData = this.safeDict (response, 'data');
            return this.parseOrder (orderData, market);
        } else {
            const request: Dict = this.createFutureOrderRequest (
                symbol,
                type,
                side,
                amount,
                price,
                params,
                market
            );
            if (type === 'limit') {
                response = await this.futurePrivatePostOpenApiV2OrderLimit (request);
            } else {
                response = await this.futurePrivatePostOpenApiV2OrderMarket (request);
            }
            const orderData = this.safeDict (response, 'data');
            return this.parseOrder (orderData, market);
        }
    }

    async brushVolume (symbol: string, side: OrderSide, amount: number, price: Num) {
        /**
         * @method
         * @name allin#brushVolume
         * @description 刷量
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        let response = undefined;
        const allinSide = this.toOrderSide (side);
        if (market['spot']) {
            const request = {
                'symbol': market['id'],
                'side': allinSide,
                'price': this.priceToPrecision (symbol, price),
                'quantity': this.amountToPrecision (symbol, amount),
            };
            response = await this.spotPrivatePostOpenV1TickersBrush (request);
        } else {
            const request = {
                'market': market['id'],
                'side': allinSide,
                'price': this.priceToPrecision (symbol, price),
                'quantity': this.amountToPrecision (symbol, amount),
            };
            response = await this.futurePrivatePostOpenApiV2OrderReport (request);
        }
        return response;
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
        // future
        // const future = { 'code': 0,
        //     'msg': 'success',
        //     'data': { 'order_id': '22710426',
        //         'position_id': '0',
        //         'market': 'BTCUSDT',
        //         'type': '1',
        //         'side': '1',
        //         'left': '0.0099',
        //         'amount': '0.0099',
        //         'filled': '0',
        //         'deal_fee': '0',
        //         'price': '59181.464',
        //         'avg_price': '',
        //         'deal_stock': '0',
        //         'position_type': '2',
        //         'leverage': '5',
        //         'update_time': '1724067149.721356',
        //         'create_time': '1724067149.721356',
        //         'status': '1',
        //         'stop_loss_price': '',
        //         'take_profit_price': '',
        //         'client_oid': '40546335150450903175323' },
        //     'time': 1723130482 };
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        let request = undefined;
        let response = undefined;
        if (market['spot']) {
            request = {
                'symbol': market['id'],
                'order_id': id,
            };
            response = await this.spotPrivatePostOpenV1OrdersCancel (request);
            const orderData = this.safeDict (response, 'data');
            return this.parseOrder (orderData, market);
        } else {
            request = {
                'market': market['id'],
                'order_id': id,
            };
            response = await this.futurePrivatePostOpenApiV2OrderCancel (request);
            const orderData = this.safeDict (response, 'data');
            return this.parseOrder (orderData, market);
        }
    }

    async cancelOrders (ids:string[], symbol: Str = undefined, params = {}) {
        /**
         * @method
         * @name allin#cancelOrders
         * @description cancel multiple orders
         * @see https://allinexchange.github.io/spot-docs/v1/en/#cancel-all-or-part-of-the-orders-in-order
         * @param {string[]} ids order ids
         * @param {string} [symbol] unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         */
        // spot
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
        // future {"code": 0, "msg": "success", "data": ["20979038", "20979039"], "time": 1723883453}
        const currentType = this.options['defaultType'];
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (currentType === 'spot') {
            const request = {
                'symbol': market['id'],
                'order_ids': ids.join (','),
            };
            const response = await this.spotPrivatePostOpenV1OrdersBatcancel (request);
            const orderDatas = this.safeDict (response, 'data');
            return this.parseOrders (orderDatas, market);
        } else {
            const request = {
                'market': market['id'],
                'order_ids': ids.join (','),
            };
            const response = await this.futurePrivatePostOpenApiV2OrderCancelBatch (request);
            const orderDatas = this.safeDict (response, 'data');
            return this.parseOrders (orderDatas, market);
        }
    }

    createSpotOrderRequest (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num, params: {}, market: Market): Dict {
        const orderType = this.toSpotOrderType (type);
        const orderSide = this.toOrderSide (side);
        const request = {
            'symbol': market['id'],
            'side': this.forceString (orderSide),
            'order_type': orderType,
            'quantity': this.amountToPrecision (symbol, amount),
        };
        if (price !== undefined && orderType === 'LIMIT') {
            request['price'] = this.priceToPrecision (symbol, price);
        }
        const requestParams = this.omit (params, [
            'postOnly', 'stopLossPrice', 'takeProfitPrice', 'stopPrice',
            'triggerPrice', 'trailingTriggerPrice',
            'trailingPercent', 'quoteOrderQty' ]);
        return this.extend (request, requestParams);
    }

    createFutureOrderRequest (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num, params: {}, market: Market): Dict {
        const orderSide = this.toOrderSide (side);
        const request = {
            'market': market['id'],
            'side': orderSide,
            'quantity': this.amountToPrecision (symbol, amount),
        };
        if (price !== undefined && type === 'limit') {
            request['price'] = this.priceToPrecision (symbol, price);
        }
        return request;
    }

    async fetchFundingRate (symbol: string, params = {}) {
        /**
         * @method
         * @name allin#fetchFundingRate
         * @description fetch the current funding rate
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'market': market['id'],
        };
        let response = undefined;
        if (market['future'] || market['swap']) {
            response = await this.futurePublicGetOpenApiV2MarketState (request);
        } else {
            throw new NotSupported (this.id + ' fetchFundingRate() supports linear and inverse contracts only');
        }
        const data = this.safeDict (response, 'data', {});
        return this.parseFundingRate (data, market);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.implodeHostname (this.urls['api'][api]) + path;
        const nonce = this.nonce ().toString ();
        const ts = nonce;
        const client_id = this.apiKey;
        let requestParams = this.extend ({}, params);
        if ((api === 'spotPrivate') || (api === 'futurePrivate') || (api === 'private')) {
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

    async setLeverage (leverage: Int, symbol: Str = undefined, params = {}): Promise<{}> {
        /**
         * @method
         * @name allin#setLeverage
         * @description set the level of leverage for a market
         * @param {string} [params.marginMode] set marginMode
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const newMarginMode = this.safeString (params, 'marginMode', undefined);
        const oldLeverage = await this.fetchLeverage (symbol, params);
        const oldLeverageNum = this.safeInteger (oldLeverage, 'longLeverage');
        const oldMarginMode = this.safeString (oldLeverage, 'marginMode');
        if ((newMarginMode && newMarginMode !== oldMarginMode) || oldLeverageNum !== leverage) {
            const reqMarginMode = newMarginMode ? newMarginMode : oldMarginMode;
            const request = {
                'market': market['id'],
                'leverage': leverage,
                'position_type': this.toLeverageMode (reqMarginMode),
            };
            return await this.futurePrivatePostOpenApiV2SettingLeverage (request);
        }
        return {};
    }

    parseFundingRate (contract, market: Market = undefined): FundingRate {
        //     "data": {
        //       "market": "ETHUSDT",
        //       "amount": "4753.05",
        //       "high": "1573.89",
        //       "last": "1573.89",
        //       "low": "1571.23",
        //       "open": "1571.23",
        //       "change": "0.0016929411989333",
        //       "period": 86400,
        //       "volume": "3.02",
        //       "funding_time": 400,
        //       "position_amount": "2.100",
        //       "funding_rate_last": "0.00375",
        //       "funding_rate_next": "0.00293873",
        //       "funding_rate_predict": "-0.00088999",
        //       "insurance": "10500.45426906585552617850",
        //       "sign_price": "1581.98",
        //       "index_price": "1578.12",
        //       "sell_total": "112.974",
        //       "buy_total": "170.914"
        //     }
        const timestamp = this.milliseconds ();
        return {
            'info': contract,
            'symbol': market['symbol'],
            'markPrice': this.safeFloat (contract, 'sign_price'),
            'indexPrice': this.safeFloat (contract, 'index_price'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'fundingRate': this.safeFloat (contract, 'funding_rate_last'),
            'nextFundingRate': this.safeFloat (contract, 'funding_rate_next'),
            'previousFundingRate': this.safeFloat (contract, 'funding_rate_predict'),
            'nextFundingTimestamp': undefined,
            'nextFundingDatetime': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
            'fundingTimestamp': timestamp,
            'interestRate': undefined,
        };
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
        // future
        // {
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
        const marketId = this.safeString2 (ticker, 'symbol', 'markt');
        const symbol = this.safeSymbol (marketId, market, undefined);
        const last = this.safeString2 (ticker, 'price', 'last');
        const baseVolume = this.safeString (ticker, 'volume'); // 数量
        const quoteVolume = this.safeString (ticker, 'amount'); // 金额
        let timestamp = this.safeInteger (ticker, 'timestamp');
        const open_ = this.safeNumber (ticker, 'open');
        const high = this.safeNumber (ticker, 'high');
        const low = this.safeNumber (ticker, 'low');
        if (timestamp !== undefined) {
            timestamp = this.milliseconds ();
        }
        return this.safeTicker ({
            'symbol': symbol,
            'info': ticker,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'open': open_,
            'high': high,
            'low': low,
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

    parseSpotBalance (response: any): Balances {
        // const balances = { 'code': 0,
        //     'msg': 'ok',
        //     'data': [
        //         { 'amount': '1000.1', 'freeze': '0', 'symbol': 'BTC' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'ETH' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'TRX' },
        //         { 'amount': '99988000', 'freeze': '6000', 'symbol': 'USDT' } ],
        //     'time': 1720067861 };
        const originBalances = this.safeList (response, 'data', []);
        const timestamp = this.safeTimestamp (response, 'time');
        const balances = {
            'info': originBalances,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        };
        for (let i = 0; i < originBalances.length; i++) {
            const originBalance = originBalances[i];
            const symbol = this.safeString (originBalance, 'symbol');
            const used = this.safeString (originBalance, 'freeze');
            const free = this.safeString (originBalance, 'amount');
            const total = Precise.stringAdd (free, used);
            balances[symbol] = {
                'free': free,
                'used': used,
                'total': total,
                'debt': 0, // ???
            };
        }
        return this.safeBalance (balances);
    }

    parseFutureBalance (response: any): Balances {
        // const response = {
        //     'code': 0,
        //     'msg': 'success',
        //     'data': {
        //         'USDT': {
        //             'available': '8300.569',
        //             'frozen': '0',
        //             'margin': '0',
        //             'balance_total': '8300.569',
        //             'profit_unreal': '0',
        //             'transfer': '8300.569',
        //             'bonus': '0',
        //         },
        //     },
        //     'time': 1720067861,
        // };
        const originBalances = this.safeDict (response, 'data', {});
        const timestamp = this.safeTimestamp (response, 'time');
        const balances = {
            'info': originBalances,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        };
        const keys = Object.keys (originBalances);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const originBalance = originBalances[key];
            const symbol = key;
            const used = this.safeString (originBalance, 'frozen');
            const total = this.safeString (originBalance, 'balance_total');
            const free = this.safeString (originBalance, 'available');
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
        // const klines = [ { 'timestamp': 1720072680,
        //     'open': '68000.00',
        //     'close': '68000.00',
        //     'high': '68000.00',
        //     'low': '68000.00',
        //     'volume': '0',
        //     'amount': '0' },
        // { 'timestamp': 1720072740,
        //     'open': '68000.00',
        //     'close': '68000.00',
        //     'high': '68000.00',
        //     'low': '68000.00',
        //     'volume': '0',
        //     'amount': '0' },
        // ];
        // future
        // open close high low
        // [1722670020,"66019","66019","66019","66019","0","0","BTCUSDT"]
        return [
            this.safeTimestamp2 (ohlcv, 'timestamp', 0),
            this.safeFloat2 (ohlcv, 'open', 1),
            this.safeFloat2 (ohlcv, 'high', 3),
            this.safeFloat2 (ohlcv, 'low', 4),
            this.safeFloat2 (ohlcv, 'close', 2),
            this.safeFloat2 (ohlcv, 'volume', 5),
        ];
    }

    parseLowerTimeframe (timeframeId: string) {
        const timeframes = {
            '1min': '1m',
            '3min': '3m',
            '5min': '5m',
            '15min': '15m',
            '10min': '10m',
            '30min': '30m',
            '1hour': '1h',
            '2hour': '2h',
            '4hour': '4h',
            '6hour': '6h',
            '12hour': '12h',
            '1day': '1d',
            '1week': '1w',
        };
        return timeframes[timeframeId];
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
        // future
        // {
        //     "id": 27699216,
        //     "price": "1573.89",
        //     "amount": "0.922",
        //     "type": "buy",
        //     "time": 1697619536.256684
        //   }
        const timestamp = this.safeTimestamp2 (trade, 'time', 'timestamp');
        const symbol = this.safeString (market, 'symbol');
        let side = undefined;
        if (market['spot']) {
            const sideNumber = this.safeInteger (trade, 'side');
            side = (sideNumber === 1) ? 'sell' : 'buy';
        } else {
            const sideStr = this.safeString (trade, 'type');
            side = (sideStr === 'buy') ? 'sell' : 'buy';
        }
        const amount = this.safeString (trade, 'amount');
        const volume = this.safeString (trade, 'volume', undefined);
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
            let errorType = undefined;
            if (type_) {
                errorType = String (type_);
            } else {
                errorType = 'null';
            }
            throw new ExchangeError ('unknown orderType: ' + errorType);
        }
    }

    toSpotOrderType (type_: string) {
        // ccxt orderType to allin orderType
        if (type_ === 'limit') {
            return 'LIMIT';
        } else if (type_ === 'market') {
            return 'MARKET';
        } else {
            throw new ExchangeError ('unknown orderType: ' + type_);
        }
    }

    toFutureOrderType (type_: string) {
        // ccxt orderType to allin orderType
        if (type_ === 'limit') {
            return 1;
        } else if (type_ === 'market') {
            return 2;
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

    parseSpotOrderStatus (status: Int) {
        // Status 2 Outstanding，3 Partial filled，4 all filled，
        // 5 cancel after partial filled，
        const statusStr = this.numberToString (status);
        const statusDict = {
            '1': 'open',        // no
            '2': 'open',        // 2 Outstanding
            '3': 'open',        // 3 Partial filled
            '4': 'closed',      // 4 all filled
            '5': 'closed',    // 5 canceled after partial filled
            '6': 'canceled',    // 6 all cancel
        };
        return this.safeString (statusDict, statusStr);
    }

    parseFutureOrderStatus (status: Int) {
        // OrderStatusPending         OrderStatus = 1
        // OrderStatusPartial         OrderStatus = 2
        // OrderStatusFilled          OrderStatus = 3
        // OrderStatusPartialCanceled OrderStatus = 4
        // OrderStatusCanceled        OrderStatus = 5
        const statusStr = this.numberToString (status);
        const statusDict = {
            '1': 'open',        // 1 Pending
            '2': 'open',        // 2 Partial filled
            '3': 'closed',      // 3 all filled
            '4': 'closed',      // 4 canceled after partial filled
            '5': 'canceled',    // 5 all cancel
        };
        return this.safeString (statusDict, statusStr);
    }

    parseOrder (order: Dict, market?: Market): Order {
        // // create spot order
        //     'data': { 'create_at': 1724217619.237232,
        //         'frm': 'USDT',
        //         'left': '0.000000',
        //         'match_amt': '5939.74200000',
        //         'match_price': '59397.42',
        //         'match_qty': '0.100000',
        //         'order_id': '112321459',
        //         'order_sub_type': 0,
        //         'order_type': 'LIMIT',
        //         'price': '60000.21',
        //         'quantity': '0.100000',
        //         'side': 2,
        //         'status': 3,
        //         'stop_price': '0',
        //         'symbol': 'BTC-USDT',
        //         'ticker': 'BTC-USDT',
        //         'ticker_id': 7,
        //         'timestamp': 1724217619.237232,
        //         'to': 'BTC',
        //         'trade_no': '40546382832340918031114',
        //         'update_timestamp': 1724217619.237275 },
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
        // future
        // const futureOrder = {
        //     'code': 0,
        //     'msg': 'success',
        //     'data': {
        //         'order_id': 1470445037,
        //         'position_id': 0,
        //         'market': 'ETHUSDT',
        //         'type': 2,
        //         'side': 1,
        //         'left': '0',
        //         'amount': '1',
        //         'filled': '1',
        //         'deal_fee': '0.7869',
        //         'price': '0',
        //         'avg_price': '1573.84',
        //         'deal_stock': '1573.84',
        //         'position_type': 1,
        //         'leverage': '20',
        //         'update_time': 1697616547.90107,
        //         'create_time': 1697616547.901067,
        //         'status': 3,
        //         'stop_loss_price': '-',
        //         'take_profit_price': '-',
        //         'client_oid': '36341ddd362363263626',
        //     },
        // };
        const timestamp = this.safeTimestamp2 (order, 'create_at', 'create_time');
        const updateAt = this.safeTimestamp2 (order, 'update_time', 'update_timestamp');
        const symbol = this.safeString2 (market, 'symbol', 'market');
        const side = this.parseOrderSide (this.safeInteger (order, 'side'));
        const price = this.safeString (order, 'price');
        const amount = this.safeString2 (order, 'quantity', 'amount');
        const average = this.safeString2 (order, 'match_price', 'avg_price');
        const filled = this.safeString2 (order, 'match_qty', 'filled', '0');
        const cost = this.safeString2 (order, 'match_amt', 'deal_stock', '0');
        const feeCost = this.safeString2 (order, 'fee', 'deal_fee', undefined);
        const type_ = this.parseOrderType (this.safeString2 (order, 'order_type', 'type'));
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = {
                'currency': undefined,
                'cost': feeCost,
                'rate': undefined,
            };
        }
        const trades = this.safeList (order, 'trades', []);
        let status = undefined;
        if (market['spot']) {
            status = this.parseSpotOrderStatus (this.safeInteger (order, 'status'));
        } else {
            status = this.parseFutureOrderStatus (this.safeInteger (order, 'status'));
        }
        return this.safeOrder ({
            'info': order,
            'id': this.safeString (order, 'order_id'),
            'clientOrderId': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': updateAt,
            'lastUpdateTimestamp': updateAt,
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

    parsePosition (position: Dict, market?: Market): Position {
        //       "position":{
        //         "position_id":4784242,
        //         "create_time":1699944061.968543,
        //         "update_time":1699944061.968656,
        //         "user_id":9108,
        //         "market":"BTCUSDT",
        //         "type":2,            // Position type，1 Isolated position 2 Cross position
        //         "side":2,            //1 short 2 long
        //         "amount":"0.0444",
        //         "close_left":"0.0444",       // left can close
        //         "open_price":"36341.6",
        // "last_price":"62748.25000000",
        // "sign_price":"56885.76824999",
        // "index_price":"56864.00000000",
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
        const timestamp = this.safeTimestamp (position, 'update_time');
        const initialMarginNum = this.safeNumber (position, 'open_margin');
        const maintenanceMarginString = this.safeString (position, 'mainten_margin_amount');
        const sideNum = this.safeInteger (position, 'side');
        const modeNum = this.safeInteger (position, 'type');
        const amount = this.safeString (position, 'amount');
        const lastPrice = this.safeString (position, 'last_price');
        const markPrice = this.safeString (position, 'sign_price');
        const size = market['contractSize'];
        const notional = this.parseNumber (Precise.stringMul (amount, lastPrice)) * size;
        const profit_unreal = this.safeNumber (position, 'profit_unreal');
        const collateral = initialMarginNum + profit_unreal;
        return this.safePosition ({
            'info': position,
            'id': this.safeInteger (position, 'position_id'),
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastUpdateTimestamp': timestamp,
            'initialMargin': initialMarginNum,
            'initialMarginPercentage': undefined,
            'maintenanceMargin': this.parseNumber (maintenanceMarginString),
            'maintenanceMarginPercentage': this.safeInteger (position, 'mainten_margin'),
            'entryPrice': this.safeFloat (position, 'open_price'),
            'notional': notional,
            'leverage': this.safeNumber (position, 'leverage'),
            'unrealizedPnl': this.safeFloat (position, 'profit_unreal'),
            'realizedPnl': undefined,
            'contracts': this.parseNumber (amount), // in USD for inverse swaps
            'contractSize': this.safeNumber (market, 'contractSize'),
            'marginRatio': this.safeNumber (position, 'margin_ratio'),
            'liquidationPrice': this.safeNumber (position, 'liq_price'),
            'markPrice': this.parseNumber (markPrice),
            'lastPrice': this.parseNumber (lastPrice),
            'collateral': collateral,
            'marginMode': this.parseLeverageMode (modeNum),
            'side': this.parsePositionSide (sideNum),
            'percentage': this.safeFloat (position, 'roe'),
            'stopLossPrice': this.safeNumber (position, 'stop_loss_price'),
            'takeProfitPrice': this.safeNumber (position, 'take_profit_price'),
        });
    }

    parsePositionSide (sideNum: Int) {
        if (sideNum === 1) {
            return 'short';
        } else {
            return 'long';
        }
    }

    toLeverageMode (marginMode: string) {
        if (marginMode === 'isolated') {
            return 1;
        } else {
            return 2;
        }
    }

    parseLeverageMode (modeNum: Int) {
        if (modeNum === 1) {
            return 'isolated';
        } else {
            return 'cross';
        }
    }

    parseLeverage (leverage, market): Leverage {
        // {
        //     "code": 0,
        //     "msg": "success",
        //     "data": {
        //       "leverage": "100",
        //       "position_type": 1
        //     }
        //   }
        const data = this.safeDict (leverage, 'data');
        const leverageNum = this.safeInteger (data, 'leverage');
        const modeNum = this.safeInteger (data, 'position_type');
        return {
            'info': leverage,
            'symbol': market['symbol'],
            'marginMode': this.parseLeverageMode (modeNum),
            'longLeverage': leverageNum,
            'shortLeverage': leverageNum,
        };
    }

    handleErrors (statusCode: Int, statusText: string, url: string, method: string, responseHeaders: Dict, responseBody: string, response: any, requestHeaders: any, requestBody: any) {
        if (statusCode >= 400) {
            throw new NetworkError (this.id + ' http-code=' + this.numberToString (statusCode) + ', ' + statusText);
        }
        // const response = { 'code': 0,
        //     'msg': 'ok',
        //     'data': [
        //         { 'amount': '1000.1', 'freeze': '0', 'symbol': 'BTC' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'ETH' },
        //         { 'amount': '0', 'freeze': '0', 'symbol': 'TRX' },
        //         { 'amount': '99988000', 'freeze': '6000', 'symbol': 'USDT' } ],
        //     'time': 1720067861 };
        // feture
        // {'code': '10013', 'msg': 'order is not exist', 'data': None, 'time': '1723189930'}
        if (response === undefined) {
            return undefined; // fallback to default error handler
        }
        const responseCode: int = this.safeInteger (response, 'code', 0);
        if (responseCode !== 0) {
            const codeStr = this.numberToString (responseCode);
            const messageNew = this.safeString (response, 'msg');
            const msg = this.id + ', server-code=' + codeStr + ', ' + messageNew;
            this.throwExactlyMatchedException (this.exceptions['exact'], codeStr, msg);
        }
    }

    throwExactlyMatchedException (exact, string, message) {
        if (string === undefined) {
            return;
        }
        if (string in exact) {
            throw new exact[string] (message);
        } else {
            throw new ExchangeError (message);
        }
    }
}
