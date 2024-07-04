//  ---------------------------------------------------------------------------

import Exchange from './abstract/allin.js';
import { ExchangeError, ArgumentsRequired, OperationFailed, OperationRejected, InsufficientFunds, OrderNotFound, InvalidOrder, DDoSProtection, InvalidNonce, AuthenticationError, RateLimitExceeded, PermissionDenied, NotSupported, BadRequest, BadSymbol, AccountSuspended, OrderImmediatelyFillable, OnMaintenance, BadResponse, RequestTimeout, OrderNotFillable, MarginModeAlreadySet, MarketClosed } from './base/errors.js';
import { Precise } from './base/Precise.js';
import type { TransferEntry, Int, OrderSide, Balances, OrderType, Trade, OHLCV, Order, FundingRateHistory, OpenInterest, Liquidation, OrderRequest, Str, Transaction, Ticker, OrderBook, Tickers, Market, Greeks, Strings, Currency, MarketInterface, MarginMode, MarginModes, Leverage, Leverages, Num, Option, MarginModification, TradingFeeInterface, Currencies, TradingFees, Conversion, CrossBorrowRate, IsolatedBorrowRates, IsolatedBorrowRate, Dict, TransferEntries, LeverageTier, LeverageTiers, int, Dictionary, Position, IndexType } from './base/types.js';
import { TRUNCATE, TICK_SIZE } from './base/functions/number.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import { rsa } from './base/functions/rsa.js';
import { eddsa } from './base/functions/crypto.js';
import { ed25519 } from './static_dependencies/noble-curves/ed25519.js';

//  ---------------------------------------------------------------------------xs
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
            'rateLimit': 20,
            'hostname': 'allin.com',
            'pro': true,
            'certified': true,
            'options': {
                'sandboxMode': false,
                'fetchMarkets': [
                    'spot', // allows CORS in browsers
                    // 'linear', // allows CORS in browsers
                    // 'inverse', // allows CORS in browsers
                    // // 'option', // does not allow CORS, enable
                ],
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
                'createOrderWithTakeProfitAndStopLoss': true,
                'createPostOnlyOrder': true,
                'createReduceOnlyOrder': true,
                'createStopLimitOrder': true,
                'createStopLossOrder': true,
                'createStopMarketOrder': true,
                'createStopOrder': true,
                'createTakeProfitOrder': true,
                'createTrailingAmountOrder': true,
                'createTriggerOrder': true,
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
                'fetchOrder': false,
                'fetchOrderBook': true,
                'fetchOrders': false,
                'fetchOrderTrades': true,
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
                '1m': '1',
                '3m': '3',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '2h': '120',
                '4h': '240',
                '6h': '360',
                '12h': '720',
                '1d': 'D',
                '1w': 'W',
                '1M': 'M',
            },
            'urls': {
                'test': {
                    'spot': 'https://api.allintest.pro',
                    'futures': 'https://api.allintest.pro',
                    'public': 'https://api.allintest.pro',
                    'private': 'https://api.allintest.pro',
                },
                'logo': 'https://allinexchange.github.io/spot-docs/v1/en/images/logo-e47cee02.svg',
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
                        '/open/v1/tickers': 1,
                        '/open/v1/balance': 1,
                        '/open/v1/timestamp': 1,
                        '/open/v1/kline': 1,
                        '/open/v1/depth': 1,
                        '/open/v1/tickers/trade': 1,
                        '/open/v1/orders/last': 1,
                        '/open/v1/orders': 1,
                        '/open/v1/orders/detail': 1,
                        '/open/v1/orders/detailmore': 1,
                        '/open/v1/orders/fee-rate': 1,
                    },
                    'post': {
                        '/open/v1/orders/place': 1,
                        '/open/v1/orders/cancel': 1,
                        '/open/v1/orders/batcancel': 1,
                    },
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
        //                 'order_side': { 'buy': 1, 'sell': -1 },
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
        //                 'order_side': { 'buy': 1, 'sell': -1 },
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
        //     'order_side': { 'buy': 1, 'sell': -1 },
        //     'is_spot_trading_allowed': true,
        //     'min_order_amount': '2' };
        const origin_symbol = this.safeString (market, 'symbol');
        const active = market['status'] === 'TRADING';
        let baseId = this.safeString (market, 'base_asset');
        let quoteId = market['quote_asset'];
        const spot = market['is_spot_trading_allowed'] === true;
        const swap = false;
        const future = false;
        const option = false;
        const type_ = 'spot';
        const contract = swap || future || option;
        if ((origin_symbol !== undefined) && !spot) {
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

    async fetchTicker (symbol: string, params?: {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        const response = await this.publicGetOpenV1TickersMarket (this.extend (request, params));
        if (Array.isArray (response)) {
            const firstTicker = this.safeDict (response, 0, {});
            return this.parseTicker (firstTicker, market);
        }
        return this.parseTicker (response, market);
    }

    async fetchOrderBook (symbol: string, limit?: Int, params?: {}): Promise<OrderBook> {
        // const orderbook = {
        //     'code': 0,
        //     'msg': 'ok',
        //     'data': { 'bids': [
        //         { 'price': '67890.99', 'quantity': '0.002000' },
        //         { 'price': '67890.44', 'quantity': '0.001000' },
        //         { 'price': '62000.00', 'quantity': '1.999000' } ],
        //     'asks': [
        //         { 'price': '68000.00', 'quantity': '0.357100' },
        //         { 'price': '68123.44', 'quantity': '0.230000' },
        //     ] }};
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
        const timestamp = Date.now ();
        return this.parseOrderBook (result, symbol, timestamp, 'bids', 'asks', 'price', 'quantity');
    }

    // async fetchOrder (id: string, symbol?: Str, params?: {}): Promise<Order> {

    // }

    // async fetchBalance (params?: {}): Promise<Balances> {

    // }

    // async fetchPositions (symbol: string, params?: {}): Promise<Position> {

    // }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.implodeHostname (this.urls['api'][api]) + path;
        const nonce = this.nonce ().toString ();
        const ts = nonce;
        const client_id = this.apiKey;
        let result = this.extend ({}, params);
        result['url'] = url;
        if (api === 'private') {
            this.checkRequiredCredentials ();
            result = this.extend (result, { 'ts': ts, 'nonce': nonce, 'sign': '', 'client_id': this.apiKey });
            const s = 'client_id=' + client_id + '&nonce=' + nonce + '&ts=' + ts;
            const v = this.hmac (this.encode (s), this.encode (this.secret), sha256);
            result['sign'] = v;
        }
        if (method === 'GET' && Object.keys (result).length > 0) {
            url += '?' + this.rawencode (result);
            result['url'] = url;
        }
        return result;
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        const marketId = this.safeString (ticker, 'symbol');
        const symbol = this.safeSymbol (marketId, market, undefined);
        const last = this.safeString (ticker, 'price');
        const baseVolume = this.safeString (ticker, 'volume'); // 数量
        const quoteVolume = this.safeString (ticker, 'amount'); // 金额
        return this.safeTicker ({
            'symbol': symbol,
            'info': ticker,
            'timestamp': 0,
            'datetime': '',
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
}
