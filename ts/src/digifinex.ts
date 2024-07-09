
//  ---------------------------------------------------------------------------

import Exchange from './abstract/digifinex.js';
import { AccountSuspended, BadRequest, BadResponse, NetworkError, DDoSProtection, NotSupported, AuthenticationError, PermissionDenied, ExchangeError, InsufficientFunds, InvalidOrder, InvalidNonce, OrderNotFound, InvalidAddress, RateLimitExceeded, BadSymbol, ArgumentsRequired } from './base/errors.js';
import { TICK_SIZE } from './base/functions/number.js';
import { Precise } from './base/Precise.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import type { FundingRateHistory, Int, OHLCV, Order, OrderSide, OrderType, OrderRequest, Trade, Balances, Str, Transaction, Ticker, OrderBook, Tickers, Strings, Market, Currency, TransferEntry, Num, MarginModification, TradingFeeInterface, Currencies, CrossBorrowRate, CrossBorrowRates, Dict, TransferEntries, LeverageTier, LeverageTiers, int } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class digifinex
 * @augments Exchange
 */
export default class digifinex extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'digifinex',
            'name': 'DigiFinex',
            'countries': [ 'SG' ],
            'version': 'v3',
            'rateLimit': 900, // 300 for posts
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': true,
                'swap': true,
                'future': false,
                'option': false,
                'addMargin': true,
                'cancelOrder': true,
                'cancelOrders': true,
                'createMarketBuyOrderWithCost': true,
                'createMarketOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': true,
                'createOrders': true,
                'createPostOnlyOrder': true,
                'createReduceOnlyOrder': true,
                'createStopLimitOrder': false,
                'createStopMarketOrder': false,
                'createStopOrder': false,
                'fetchBalance': true,
                'fetchBorrowInterest': true,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchCrossBorrowRate': true,
                'fetchCrossBorrowRates': true,
                'fetchCurrencies': true,
                'fetchDepositAddress': true,
                'fetchDeposits': true,
                'fetchDepositWithdrawFee': 'emulated',
                'fetchDepositWithdrawFees': true,
                'fetchFundingHistory': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchLedger': true,
                'fetchLeverage': false,
                'fetchLeverageTiers': true,
                'fetchMarginMode': false,
                'fetchMarketLeverageTiers': true,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchPosition': true,
                'fetchPositionMode': false,
                'fetchPositions': true,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchStatus': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': false,
                'fetchTransfers': true,
                'fetchWithdrawals': true,
                'reduceMargin': true,
                'setLeverage': true,
                'setMargin': false,
                'setMarginMode': true,
                'setPositionMode': false,
                'transfer': true,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '4h': '240',
                '12h': '720',
                '1d': '1D',
                '1w': '1W',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/51840849/87443315-01283a00-c5fe-11ea-8628-c2a0feaf07ac.jpg',
                'api': {
                    'rest': 'https://openapi.digifinex.com',
                },
                'www': 'https://www.digifinex.com',
                'doc': [
                    'https://docs.digifinex.com',
                ],
                'fees': 'https://digifinex.zendesk.com/hc/en-us/articles/360000328422-Fee-Structure-on-DigiFinex',
                'referral': 'https://www.digifinex.com/en-ww/from/DhOzBg?channelCode=ljaUPp',
            },
            'api': {
                'public': {
                    'spot': {
                        'get': [
                            '{market}/symbols',
                            'kline',
                            'margin/currencies',
                            'margin/symbols',
                            'markets',
                            'order_book',
                            'ping',
                            'spot/symbols',
                            'time',
                            'trades',
                            'trades/symbols',
                            'ticker',
                            'currencies',
                        ],
                    },
                    'swap': {
                        'get': [
                            'public/api_weight',
                            'public/candles',
                            'public/candles_history',
                            'public/depth',
                            'public/funding_rate',
                            'public/funding_rate_history',
                            'public/instrument',
                            'public/instruments',
                            'public/ticker',
                            'public/tickers',
                            'public/time',
                            'public/trades',
                        ],
                    },
                },
                'private': {
                    'spot': {
                        'get': [
                            '{market}/financelog',
                            '{market}/mytrades',
                            '{market}/order',
                            '{market}/order/detail',
                            '{market}/order/current',
                            '{market}/order/history',
                            'margin/assets',
                            'margin/financelog',
                            'margin/mytrades',
                            'margin/order',
                            'margin/order/current',
                            'margin/order/history',
                            'margin/positions',
                            'otc/financelog',
                            'spot/assets',
                            'spot/financelog',
                            'spot/mytrades',
                            'spot/order',
                            'spot/order/current',
                            'spot/order/history',
                            'deposit/address',
                            'deposit/history',
                            'withdraw/history',
                        ],
                        'post': [
                            '{market}/order/cancel',
                            '{market}/order/new',
                            '{market}/order/batch_new',
                            'margin/order/cancel',
                            'margin/order/new',
                            'margin/position/close',
                            'spot/order/cancel',
                            'spot/order/new',
                            'transfer',
                            'withdraw/new',
                            'withdraw/cancel',
                        ],
                    },
                    'swap': {
                        'get': [
                            'account/balance',
                            'account/positions',
                            'account/finance_record',
                            'account/trading_fee_rate',
                            'account/transfer_record',
                            'account/funding_fee',
                            'trade/history_orders',
                            'trade/history_trades',
                            'trade/open_orders',
                            'trade/order_info',
                        ],
                        'post': [
                            'account/leverage',
                            'account/position_mode',
                            'account/position_margin',
                            'trade/batch_cancel_order',
                            'trade/batch_order',
                            'trade/cancel_order',
                            'trade/order_place',
                            'follow/sponsor_order',
                            'follow/close_order',
                            'follow/cancel_order',
                            'follow/user_center_current',
                            'follow/user_center_history',
                            'follow/expert_current_open_order',
                            'follow/add_algo',
                            'follow/cancel_algo',
                            'follow/account_available',
                            'follow/plan_task',
                            'follow/instrument_list',
                        ],
                    },
                },
            },
            'fees': {
                'trading': {
                    'tierBased': true,
                    'percentage': true,
                    'maker': this.parseNumber ('0.002'),
                    'taker': this.parseNumber ('0.002'),
                },
            },
            'precisionMode': TICK_SIZE,
            'exceptions': {
                'exact': {
                    '10001': [ BadRequest, "Wrong request method, please check it's a GET ot POST request" ],
                    '10002': [ AuthenticationError, 'Invalid ApiKey' ],
                    '10003': [ AuthenticationError, "Sign doesn't match" ],
                    '10004': [ BadRequest, 'Illegal request parameters' ],
                    '10005': [ DDoSProtection, 'Request frequency exceeds the limit' ],
                    '10006': [ PermissionDenied, 'Unauthorized to execute this request' ],
                    '10007': [ PermissionDenied, 'IP address Unauthorized' ],
                    '10008': [ InvalidNonce, 'Timestamp for this request is invalid, timestamp must within 1 minute' ],
                    '10009': [ NetworkError, 'Unexist endpoint, please check endpoint URL' ],
                    '10011': [ AccountSuspended, 'ApiKey expired. Please go to client side to re-create an ApiKey' ],
                    '20001': [ PermissionDenied, 'Trade is not open for this trading pair' ],
                    '20002': [ PermissionDenied, 'Trade of this trading pair is suspended' ],
                    '20003': [ InvalidOrder, 'Invalid price or amount' ],
                    '20007': [ InvalidOrder, 'Price precision error' ],
                    '20008': [ InvalidOrder, 'Amount precision error' ],
                    '20009': [ InvalidOrder, 'Amount is less than the minimum requirement' ],
                    '20010': [ InvalidOrder, 'Cash Amount is less than the minimum requirement' ],
                    '20011': [ InsufficientFunds, 'Insufficient balance' ],
                    '20012': [ BadRequest, 'Invalid trade type, valid value: buy/sell)' ],
                    '20013': [ InvalidOrder, 'No order info found' ],
                    '20014': [ BadRequest, 'Invalid date, Valid format: 2018-07-25)' ],
                    '20015': [ BadRequest, 'Date exceeds the limit' ],
                    '20018': [ PermissionDenied, 'Your trading rights have been banned by the system' ],
                    '20019': [ BadSymbol, 'Wrong trading pair symbol. Correct format:"usdt_btc". Quote asset is in the front' ],
                    '20020': [ DDoSProtection, "You have violated the API operation trading rules and temporarily forbid trading. At present, we have certain restrictions on the user's transaction rate and withdrawal rate." ],
                    '50000': [ ExchangeError, 'Exception error' ],
                    '20021': [ BadRequest, 'Invalid currency' ],
                    '20022': [ BadRequest, 'The ending timestamp must be larger than the starting timestamp' ],
                    '20023': [ BadRequest, 'Invalid transfer type' ],
                    '20024': [ BadRequest, 'Invalid amount' ],
                    '20025': [ BadRequest, 'This currency is not transferable at the moment' ],
                    '20026': [ InsufficientFunds, 'Transfer amount exceed your balance' ],
                    '20027': [ PermissionDenied, 'Abnormal account status' ],
                    '20028': [ PermissionDenied, 'Blacklist for transfer' ],
                    '20029': [ PermissionDenied, 'Transfer amount exceed your daily limit' ],
                    '20030': [ BadRequest, 'You have no position on this trading pair' ],
                    '20032': [ PermissionDenied, 'Withdrawal limited' ],
                    '20033': [ BadRequest, 'Wrong Withdrawal ID' ],
                    '20034': [ PermissionDenied, 'Withdrawal service of this crypto has been closed' ],
                    '20035': [ PermissionDenied, 'Withdrawal limit' ],
                    '20036': [ ExchangeError, 'Withdrawal cancellation failed' ],
                    '20037': [ InvalidAddress, 'The withdrawal address, Tag or chain type is not included in the withdrawal management list' ],
                    '20038': [ InvalidAddress, 'The withdrawal address is not on the white list' ],
                    '20039': [ ExchangeError, "Can't be canceled in current status" ],
                    '20040': [ RateLimitExceeded, 'Withdraw too frequently; limitation: 3 times a minute, 100 times a day' ],
                    '20041': [ PermissionDenied, 'Beyond the daily withdrawal limit' ],
                    '20042': [ BadSymbol, 'Current trading pair does not support API trading' ],
                    '400002': [ BadRequest, 'Invalid Parameter' ],
                },
                'broad': {
                },
            },
            'options': {
                'defaultType': 'spot',
                'types': [ 'spot', 'margin', 'otc' ],
                'createMarketBuyOrderRequiresPrice': true,
                'accountsByType': {
                    'spot': '1',
                    'margin': '2',
                    'OTC': '3',
                },
                'networks': {
                    'ARBITRUM': 'Arbitrum',
                    'AVALANCEC': 'AVAX-CCHAIN',
                    'AVALANCEX': 'AVAX-XCHAIN',
                    'BEP20': 'BEP20',
                    'BSC': 'BEP20',
                    'CARDANO': 'Cardano',
                    'CELO': 'Celo',
                    'CHILIZ': 'Chiliz',
                    'COSMOS': 'COSMOS',
                    'CRC20': 'Crypto.com',
                    'CRONOS': 'Crypto.com',
                    'DOGECOIN': 'DogeChain',
                    'ERC20': 'ERC20',
                    'ETH': 'ERC20',
                    'ETHW': 'ETHW',
                    'IOTA': 'MIOTA',
                    'KLAYTN': 'KLAY',
                    'MATIC': 'Polygon',
                    'METIS': 'MetisDAO',
                    'MOONBEAM': 'GLMR',
                    'MOONRIVER': 'Moonriver',
                    'OPTIMISM': 'OPETH',
                    'POLYGON': 'Polygon',
                    'RIPPLE': 'XRP',
                    'SOLANA': 'SOL', // SOL & SPL
                    'STELLAR': 'Stella', // XLM
                    'TERRACLASSIC': 'TerraClassic',
                    'TERRA': 'Terra',
                    'TON': 'Ton',
                    'TRC20': 'TRC20',
                    'TRON': 'TRC20',
                    'TRX': 'TRC20',
                    'VECHAIN': 'Vechain', // VET
                },
            },
            'commonCurrencies': {
                'BHT': 'Black House Test',
                'EPS': 'Epanus',
                'FREE': 'FreeRossDAO',
                'MBN': 'Mobilian Coin',
                'TEL': 'TEL666',
            },
        });
    }

    async fetchCurrencies (params = {}): Promise<Currencies> {
        /**
         * @method
         * @name digifinex#fetchCurrencies
         * @description fetches all available currencies on an exchange
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an associative dictionary of currencies
         */
        const response = await this.publicSpotGetCurrencies (params);
        //
        //     {
        //         "data":[
        //             {
        //                 "deposit_status":1,
        //                 "min_deposit_amount":10,
        //                 "withdraw_fee_rate":0,
        //                 "min_withdraw_amount":10,
        //                 "min_withdraw_fee":5,
        //                 "currency":"USDT",
        //                 "withdraw_status":0,
        //                 "chain":"OMNI"
        //             },
        //             {
        //                 "deposit_status":1,
        //                 "min_deposit_amount":10,
        //                 "withdraw_fee_rate":0,
        //                 "min_withdraw_amount":10,
        //                 "min_withdraw_fee":3,
        //                 "currency":"USDT",
        //                 "withdraw_status":1,
        //                 "chain":"ERC20"
        //             },
        //             {
        //                 "deposit_status":0,
        //                 "min_deposit_amount":0,
        //                 "withdraw_fee_rate":0,
        //                 "min_withdraw_amount":0,
        //                 "min_withdraw_fee":0,
        //                 "currency":"DGF13",
        //                 "withdraw_status":0,
        //                 "chain":""
        //             },
        //         ],
        //         "code":200
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        const result: Dict = {};
        for (let i = 0; i < data.length; i++) {
            const currency = data[i];
            const id = this.safeString (currency, 'currency');
            const code = this.safeCurrencyCode (id);
            const depositStatus = this.safeInteger (currency, 'deposit_status', 1);
            const withdrawStatus = this.safeInteger (currency, 'withdraw_status', 1);
            const deposit = depositStatus > 0;
            const withdraw = withdrawStatus > 0;
            const active = deposit && withdraw;
            const feeString = this.safeString (currency, 'min_withdraw_fee'); // withdraw_fee_rate was zero for all currencies, so this was the worst case scenario
            const minWithdrawString = this.safeString (currency, 'min_withdraw_amount');
            const minDepositString = this.safeString (currency, 'min_deposit_amount');
            const minDeposit = this.parseNumber (minDepositString);
            const minWithdraw = this.parseNumber (minWithdrawString);
            const fee = this.parseNumber (feeString);
            // define precision with temporary way
            const minFoundPrecision = Precise.stringMin (feeString, Precise.stringMin (minDepositString, minWithdrawString));
            const precision = this.parseNumber (minFoundPrecision);
            const networkId = this.safeString (currency, 'chain');
            let networkCode = undefined;
            if (networkId !== undefined) {
                networkCode = this.networkIdToCode (networkId);
            }
            const network: Dict = {
                'info': currency,
                'id': networkId,
                'network': networkCode,
                'active': active,
                'fee': fee,
                'precision': precision,
                'deposit': deposit,
                'withdraw': withdraw,
                'limits': {
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'withdraw': {
                        'min': minWithdraw,
                        'max': undefined,
                    },
                    'deposit': {
                        'min': minDeposit,
                        'max': undefined,
                    },
                },
            };
            if (code in result) {
                if (Array.isArray (result[code]['info'])) {
                    result[code]['info'].push (currency);
                } else {
                    result[code]['info'] = [ result[code]['info'], currency ];
                }
                if (withdraw) {
                    result[code]['withdraw'] = true;
                    result[code]['limits']['withdraw']['min'] = Math.min (result[code]['limits']['withdraw']['min'], minWithdraw);
                }
                if (deposit) {
                    result[code]['deposit'] = true;
                    result[code]['limits']['deposit']['min'] = Math.min (result[code]['limits']['deposit']['min'], minDeposit);
                }
                if (active) {
                    result[code]['active'] = true;
                }
            } else {
                result[code] = {
                    'id': id,
                    'code': code,
                    'info': currency,
                    'type': undefined,
                    'name': undefined,
                    'active': active,
                    'deposit': deposit,
                    'withdraw': withdraw,
                    'fee': this.parseNumber (feeString),
                    'precision': undefined,
                    'limits': {
                        'amount': {
                            'min': undefined,
                            'max': undefined,
                        },
                        'withdraw': {
                            'min': minWithdraw,
                            'max': undefined,
                        },
                        'deposit': {
                            'min': minDeposit,
                            'max': undefined,
                        },
                    },
                    'networks': {},
                };
            }
            if (networkId !== undefined) {
                result[code]['networks'][networkId] = network;
            } else {
                result[code]['active'] = active;
                result[code]['fee'] = this.parseNumber (feeString);
                result[code]['deposit'] = deposit;
                result[code]['withdraw'] = withdraw;
                result[code]['limits'] = {
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'withdraw': {
                        'min': minWithdraw,
                        'max': undefined,
                    },
                    'deposit': {
                        'min': minDeposit,
                        'max': undefined,
                    },
                };
            }
            result[code]['precision'] = (result[code]['precision'] === undefined) ? precision : Math.max (result[code]['precision'], precision);
        }
        return result;
    }

    async fetchMarkets (params = {}): Promise<Market[]> {
        /**
         * @method
         * @name digifinex#fetchMarkets
         * @description retrieves data on all markets for digifinex
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} an array of objects representing market data
         */
        const options = this.safeValue (this.options, 'fetchMarkets', {});
        const method = this.safeString (options, 'method', 'fetch_markets_v2');
        if (method === 'fetch_markets_v2') {
            return await this.fetchMarketsV2 (params);
        }
        return await this.fetchMarketsV1 (params);
    }

    async fetchMarketsV2 (params = {}) {
        const defaultType = this.safeString (this.options, 'defaultType');
        const [ marginMode, query ] = this.handleMarginModeAndParams ('fetchMarketsV2', params);
        const promisesRaw = [];
        if (marginMode !== undefined) {
            promisesRaw.push (this.publicSpotGetMarginSymbols (query));
        } else {
            promisesRaw.push (this.publicSpotGetTradesSymbols (query));
        }
        promisesRaw.push (this.publicSwapGetPublicInstruments (params));
        const promises = await Promise.all (promisesRaw);
        const spotMarkets = promises[0];
        const swapMarkets = promises[1];
        //
        // spot and margin
        //
        //     {
        //         "symbol_list":[
        //             {
        //                 "order_types":["LIMIT","MARKET"],
        //                 "quote_asset":"USDT",
        //                 "minimum_value":2,
        //                 "amount_precision":4,
        //                 "status":"TRADING",
        //                 "minimum_amount":0.0001,
        //                 "symbol":"BTC_USDT",
        //                 "is_allow":1,
        //                 "zone":"MAIN",
        //                 "base_asset":"BTC",
        //                 "price_precision":2
        //             }
        //         ],
        //         "code":0
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "instrument_id": "BTCUSDTPERP",
        //                 "type": "REAL",
        //                 "contract_type": "PERPETUAL",
        //                 "base_currency": "BTC",
        //                 "quote_currency": "USDT",
        //                 "clear_currency": "USDT",
        //                 "contract_value": "0.001",
        //                 "contract_value_currency": "BTC",
        //                 "is_inverse": false,
        //                 "is_trading": true,
        //                 "status": "ONLINE",
        //                 "price_precision": 4,
        //                 "tick_size": "0.0001",
        //                 "min_order_amount": 1,
        //                 "open_max_limits": [
        //                     {
        //                         "leverage": "50",
        //                         "max_limit": "1000000"
        //                     }
        //                 ]
        //             },
        //         ]
        //     }
        //
        const spotData = this.safeValue (spotMarkets, 'symbol_list', []);
        const swapData = this.safeValue (swapMarkets, 'data', []);
        const response = this.arrayConcat (spotData, swapData);
        const result = [];
        for (let i = 0; i < response.length; i++) {
            const market = response[i];
            const id = this.safeString2 (market, 'symbol', 'instrument_id');
            const baseId = this.safeString2 (market, 'base_asset', 'base_currency');
            const quoteId = this.safeString2 (market, 'quote_asset', 'quote_currency');
            const settleId = this.safeString (market, 'clear_currency');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            const settle = this.safeCurrencyCode (settleId);
            //
            // The status is documented in the exchange API docs as follows:
            // TRADING, HALT (delisted), BREAK (trading paused)
            // https://docs.digifinex.vip/en-ww/v3/#/public/spot/symbols
            // However, all spot markets actually have status === 'HALT'
            // despite that they appear to be active on the exchange website.
            // Apparently, we can't trust this status.
            // const status = this.safeString (market, 'status');
            // const active = (status === 'TRADING');
            //
            let isAllowed = this.safeInteger (market, 'is_allow', 1);
            let type = (defaultType === 'margin') ? 'margin' : 'spot';
            const spot = settle === undefined;
            const swap = !spot;
            const margin = (marginMode !== undefined) ? true : undefined;
            let symbol = base + '/' + quote;
            let isInverse = undefined;
            let isLinear = undefined;
            if (swap) {
                type = 'swap';
                symbol = base + '/' + quote + ':' + settle;
                isInverse = this.safeValue (market, 'is_inverse');
                isLinear = (!isInverse) ? true : false;
                const isTrading = this.safeValue (market, 'isTrading');
                if (isTrading) {
                    isAllowed = 1;
                }
            }
            result.push ({
                'id': id,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'settle': settle,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': settleId,
                'type': type,
                'spot': spot,
                'margin': margin,
                'swap': swap,
                'future': false,
                'option': false,
                'active': isAllowed ? true : false,
                'contract': swap,
                'linear': isLinear,
                'inverse': isInverse,
                'contractSize': this.safeNumber (market, 'contract_value'),
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.parseNumber (this.parsePrecision (this.safeString (market, 'amount_precision'))),
                    'price': this.parseNumber (this.parsePrecision (this.safeString (market, 'price_precision'))),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': this.safeNumber2 (market, 'minimum_amount', 'min_order_amount'),
                        'max': undefined,
                    },
                    'price': {
                        'min': this.safeNumber (market, 'tick_size'),
                        'max': undefined,
                    },
                    'cost': {
                        'min': this.safeNumber (market, 'minimum_value'),
                        'max': undefined,
                    },
                },
                'created': undefined,
                'info': market,
            });
        }
        return result;
    }

    async fetchMarketsV1 (params = {}) {
        const response = await this.publicSpotGetMarkets (params);
        //
        //     {
        //         "data": [
        //             {
        //                 "volume_precision":4,
        //                 "price_precision":2,
        //                 "market":"btc_usdt",
        //                 "min_amount":2,
        //                 "min_volume":0.0001
        //             },
        //         ],
        //         "date":1564507456,
        //         "code":0
        //     }
        //
        const markets = this.safeValue (response, 'data', []);
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            const id = this.safeString (market, 'market');
            const [ baseId, quoteId ] = id.split ('_');
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            result.push ({
                'id': id,
                'symbol': base + '/' + quote,
                'base': base,
                'quote': quote,
                'settle': undefined,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': undefined,
                'type': 'spot',
                'spot': true,
                'margin': undefined,
                'swap': false,
                'future': false,
                'option': false,
                'active': undefined,
                'contract': false,
                'linear': undefined,
                'inverse': undefined,
                'contractSize': undefined,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'price': this.parseNumber (this.parsePrecision (this.safeString (market, 'price_precision'))),
                    'amount': this.parseNumber (this.parsePrecision (this.safeString (market, 'volume_precision'))),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': this.safeNumber (market, 'min_volume'),
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': this.safeNumber (market, 'min_amount'),
                        'max': undefined,
                    },
                },
                'info': market,
            });
        }
        return result;
    }

    parseBalance (response): Balances {
        //
        // spot and margin
        //
        //     {
        //         "currency": "BTC",
        //         "free": 4723846.89208129,
        //         "total": 0
        //     }
        //
        // swap
        //
        //     {
        //         "equity": "0",
        //         "currency": "BTC",
        //         "margin": "0",
        //         "frozen_margin": "0",
        //         "frozen_money": "0",
        //         "margin_ratio": "0",
        //         "realized_pnl": "0",
        //         "avail_balance": "0",
        //         "unrealized_pnl": "0",
        //         "time_stamp": 1661487402396
        //     }
        //
        const result: Dict = { 'info': response };
        for (let i = 0; i < response.length; i++) {
            const balance = response[i];
            const currencyId = this.safeString (balance, 'currency');
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            const free = this.safeString2 (balance, 'free', 'avail_balance');
            const total = this.safeString2 (balance, 'total', 'equity');
            account['free'] = free;
            account['used'] = Precise.stringSub (total, free);
            account['total'] = total;
            result[code] = account;
        }
        return this.safeBalance (result);
    }

    async fetchBalance (params = {}): Promise<Balances> {
        /**
         * @method
         * @name digifinex#fetchBalance
         * @description query for balance and get the amount of funds available for trading or funds locked in orders
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#spot-account-assets
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#margin-assets
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#accountbalance
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
         */
        await this.loadMarkets ();
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchBalance', undefined, params);
        const [ marginMode, query ] = this.handleMarginModeAndParams ('fetchBalance', params);
        let response = undefined;
        if (marginMode !== undefined || marketType === 'margin') {
            marketType = 'margin';
            response = await this.privateSpotGetMarginAssets (query);
        } else if (marketType === 'spot') {
            response = await this.privateSpotGetSpotAssets (query);
        } else if (marketType === 'swap') {
            response = await this.privateSwapGetAccountBalance (query);
        } else {
            throw new NotSupported (this.id + ' fetchBalance() not support this market type');
        }
        //
        // spot and margin
        //
        //     {
        //         "code": 0,
        //         "list": [
        //             {
        //                 "currency": "BTC",
        //                 "free": 4723846.89208129,
        //                 "total": 0
        //             },
        //             ...
        //         ]
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "equity": "0",
        //                 "currency": "BTC",
        //                 "margin": "0",
        //                 "frozen_margin": "0",
        //                 "frozen_money": "0",
        //                 "margin_ratio": "0",
        //                 "realized_pnl": "0",
        //                 "avail_balance": "0",
        //                 "unrealized_pnl": "0",
        //                 "time_stamp": 1661487402396
        //             },
        //             ...
        //         ]
        //     }
        //
        const balanceRequest = (marketType === 'swap') ? 'data' : 'list';
        const balances = this.safeValue (response, balanceRequest, []);
        return this.parseBalance (balances);
    }

    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        /**
         * @method
         * @name digifinex#fetchOrderBook
         * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#get-orderbook
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#orderbook
         * @param {string} symbol unified symbol of the market to fetch the order book for
         * @param {int} [limit] the maximum amount of order book entries to return
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const [ marketType, query ] = this.handleMarketTypeAndParams ('fetchOrderBook', market, params);
        const request: Dict = {};
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let response = undefined;
        if (marketType === 'swap') {
            request['instrument_id'] = market['id'];
            response = await this.publicSwapGetPublicDepth (this.extend (request, query));
        } else {
            request['symbol'] = market['id'];
            response = await this.publicSpotGetOrderBook (this.extend (request, query));
        }
        //
        // spot
        //
        //     {
        //         "bids": [
        //             [9605.77,0.0016],
        //             [9605.46,0.0003],
        //             [9602.04,0.0127],
        //         ],
        //         "asks": [
        //             [9627.22,0.025803],
        //             [9627.12,0.168543],
        //             [9626.52,0.0011529],
        //         ],
        //         "date":1564509499,
        //         "code":0
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "instrument_id": "BTCUSDTPERP",
        //             "timestamp": 1667975290425,
        //             "asks": [
        //                 ["18384.7",3492],
        //                 ["18402.7",5000],
        //                 ["18406.7",5000],
        //             ],
        //             "bids": [
        //                 ["18366.2",4395],
        //                 ["18364.3",3070],
        //                 ["18359.4",5000],
        //             ]
        //         }
        //     }
        //
        let timestamp = undefined;
        let orderBook = undefined;
        if (marketType === 'swap') {
            orderBook = this.safeValue (response, 'data', {});
            timestamp = this.safeInteger (orderBook, 'timestamp');
        } else {
            orderBook = response;
            timestamp = this.safeTimestamp (response, 'date');
        }
        return this.parseOrderBook (orderBook, market['symbol'], timestamp);
    }

    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        /**
         * @method
         * @name digifinex#fetchTickers
         * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#ticker-price
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#tickers
         * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const first = this.safeString (symbols, 0);
        let market = undefined;
        if (first !== undefined) {
            market = this.market (first);
        }
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchTickers', market, params);
        const request: Dict = {};
        let response = undefined;
        if (type === 'swap') {
            response = await this.publicSwapGetPublicTickers (this.extend (request, params));
        } else {
            response = await this.publicSpotGetTicker (this.extend (request, params));
        }
        //
        // spot
        //
        //    {
        //        "ticker": [{
        //            "vol": 40717.4461,
        //            "change": -1.91,
        //            "base_vol": 392447999.65374,
        //            "sell": 9592.23,
        //            "last": 9592.22,
        //            "symbol": "btc_usdt",
        //            "low": 9476.24,
        //            "buy": 9592.03,
        //            "high": 9793.87
        //        }],
        //        "date": 1589874294,
        //        "code": 0
        //    }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "instrument_id": "SUSHIUSDTPERP",
        //                 "index_price": "1.1297",
        //                 "mark_price": "1.1289",
        //                 "max_buy_price": "1.1856",
        //                 "min_sell_price": "1.0726",
        //                 "best_bid": "1.1278",
        //                 "best_bid_size": "500",
        //                 "best_ask": "1.1302",
        //                 "best_ask_size": "471",
        //                 "high_24h": "1.2064",
        //                 "open_24h": "1.1938",
        //                 "low_24h": "1.1239",
        //                 "last": "1.1302",
        //                 "last_qty": "29",
        //                 "volume_24h": "4946163",
        //                 "price_change_percent": "-0.053275255486681085",
        //                 "open_interest": "-",
        //                 "timestamp": 1663222782100
        //             },
        //             ...
        //         ]
        //     }
        //
        const result: Dict = {};
        const tickers = this.safeValue2 (response, 'ticker', 'data', []);
        const date = this.safeInteger (response, 'date');
        for (let i = 0; i < tickers.length; i++) {
            const rawTicker = this.extend ({
                'date': date,
            }, tickers[i]);
            const ticker = this.parseTicker (rawTicker);
            const symbol = ticker['symbol'];
            result[symbol] = ticker;
        }
        return this.filterByArrayTickers (result, 'symbol', symbols);
    }

    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        /**
         * @method
         * @name digifinex#fetchTicker
         * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#ticker-price
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#ticker
         * @param {string} symbol unified symbol of the market to fetch the ticker for
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {};
        let response = undefined;
        if (market['swap']) {
            request['instrument_id'] = market['id'];
            response = await this.publicSwapGetPublicTicker (this.extend (request, params));
        } else {
            request['symbol'] = market['id'];
            response = await this.publicSpotGetTicker (this.extend (request, params));
        }
        //
        // spot
        //
        //    {
        //        "ticker": [{
        //            "vol": 40717.4461,
        //            "change": -1.91,
        //            "base_vol": 392447999.65374,
        //            "sell": 9592.23,
        //            "last": 9592.22,
        //            "symbol": "btc_usdt",
        //            "low": 9476.24,
        //            "buy": 9592.03,
        //            "high": 9793.87
        //        }],
        //        "date": 1589874294,
        //        "code": 0
        //    }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "instrument_id": "BTCUSDTPERP",
        //             "index_price": "20141.9967",
        //             "mark_price": "20139.3404",
        //             "max_buy_price": "21146.4838",
        //             "min_sell_price": "19132.2725",
        //             "best_bid": "20140.0998",
        //             "best_bid_size": "3116",
        //             "best_ask": "20140.0999",
        //             "best_ask_size": "9004",
        //             "high_24h": "20410.6496",
        //             "open_24h": "20308.6998",
        //             "low_24h": "19600",
        //             "last": "20140.0999",
        //             "last_qty": "2",
        //             "volume_24h": "49382816",
        //             "price_change_percent": "-0.008301855936636448",
        //             "open_interest": "-",
        //             "timestamp": 1663221614998
        //         }
        //     }
        //
        const date = this.safeInteger (response, 'date');
        const tickers = this.safeValue (response, 'ticker', []);
        const data = this.safeValue (response, 'data', {});
        const firstTicker = this.safeValue (tickers, 0, {});
        let result = undefined;
        if (market['swap']) {
            result = data;
        } else {
            result = this.extend ({ 'date': date }, firstTicker);
        }
        return this.parseTicker (result, market);
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        //
        // spot: fetchTicker, fetchTickers
        //
        //     {
        //         "last":0.021957,
        //         "symbol": "btc_usdt",
        //         "base_vol":2249.3521732227,
        //         "change":-0.6,
        //         "vol":102443.5111,
        //         "sell":0.021978,
        //         "low":0.021791,
        //         "buy":0.021946,
        //         "high":0.022266,
        //         "date"1564518452, // injected from fetchTicker/fetchTickers
        //     }
        //
        // swap: fetchTicker, fetchTickers
        //
        //     {
        //         "instrument_id": "BTCUSDTPERP",
        //         "index_price": "20141.9967",
        //         "mark_price": "20139.3404",
        //         "max_buy_price": "21146.4838",
        //         "min_sell_price": "19132.2725",
        //         "best_bid": "20140.0998",
        //         "best_bid_size": "3116",
        //         "best_ask": "20140.0999",
        //         "best_ask_size": "9004",
        //         "high_24h": "20410.6496",
        //         "open_24h": "20308.6998",
        //         "low_24h": "19600",
        //         "last": "20140.0999",
        //         "last_qty": "2",
        //         "volume_24h": "49382816",
        //         "price_change_percent": "-0.008301855936636448",
        //         "open_interest": "-",
        //         "timestamp": 1663221614998
        //     }
        //
        const indexPrice = this.safeNumber (ticker, 'index_price');
        const marketType = (indexPrice !== undefined) ? 'contract' : 'spot';
        const marketId = this.safeStringUpper2 (ticker, 'symbol', 'instrument_id');
        const symbol = this.safeSymbol (marketId, market, undefined, marketType);
        market = this.safeMarket (marketId, market, undefined, marketType);
        let timestamp = this.safeTimestamp (ticker, 'date');
        if (market['swap']) {
            timestamp = this.safeInteger (ticker, 'timestamp');
        }
        const last = this.safeString (ticker, 'last');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString2 (ticker, 'high', 'high_24h'),
            'low': this.safeString2 (ticker, 'low', 'low_24h'),
            'bid': this.safeString2 (ticker, 'buy', 'best_bid'),
            'bidVolume': this.safeString (ticker, 'best_bid_size'),
            'ask': this.safeString2 (ticker, 'sell', 'best_ask'),
            'askVolume': this.safeString (ticker, 'best_ask_size'),
            'vwap': undefined,
            'open': this.safeString (ticker, 'open_24h'),
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': this.safeString2 (ticker, 'change', 'price_change_percent'),
            'average': undefined,
            'baseVolume': this.safeString2 (ticker, 'vol', 'volume_24h'),
            'quoteVolume': this.safeString (ticker, 'base_vol'),
            'info': ticker,
        }, market);
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        //
        // spot: fetchTrades
        //
        //     {
        //         "date":1564520003,
        //         "id":1596149203,
        //         "amount":0.7073,
        //         "type":"buy",
        //         "price":0.02193,
        //     }
        //
        // swap: fetchTrades
        //
        //     {
        //         "instrument_id": "BTCUSDTPERP",
        //         "trade_id": "1595190773677035521",
        //         "direction": "4",
        //         "volume": "4",
        //         "price": "16188.3",
        //         "trade_time": 1669158092314
        //     }
        //
        // spot: fetchMyTrades
        //
        //     {
        //         "symbol": "BTC_USDT",
        //         "order_id": "6707cbdcda0edfaa7f4ab509e4cbf966",
        //         "id": 28457,
        //         "price": 0.1,
        //         "amount": 0,
        //         "fee": 0.096,
        //         "fee_currency": "USDT",
        //         "timestamp": 1499865549,
        //         "side": "buy", // or "side": "sell_market"
        //         "is_maker": true
        //     }
        //
        // swap: fetchMyTrades
        //
        //     {
        //         "trade_id": "1590136768424841218",
        //         "instrument_id": "BTCUSDTPERP",
        //         "order_id": "1590136768156405760",
        //         "type": 1,
        //         "order_type": 8,
        //         "price": "18514.5",
        //         "size": "1",
        //         "fee": "0.00925725",
        //         "close_profit": "0",
        //         "leverage": "20",
        //         "trade_type": 0,
        //         "match_role": 1,
        //         "trade_time": 1667953123562
        //     }
        //
        const id = this.safeString2 (trade, 'id', 'trade_id');
        const orderId = this.safeString (trade, 'order_id');
        const priceString = this.safeString (trade, 'price');
        const amountString = this.safeStringN (trade, [ 'amount', 'volume', 'size' ]);
        const marketId = this.safeStringUpper2 (trade, 'symbol', 'instrument_id');
        const symbol = this.safeSymbol (marketId, market);
        if (market === undefined) {
            market = this.safeMarket (marketId);
        }
        let timestamp = this.safeTimestamp2 (trade, 'date', 'timestamp');
        let side = this.safeString2 (trade, 'type', 'side');
        let type = undefined;
        let takerOrMaker = undefined;
        if (market['type'] === 'swap') {
            timestamp = this.safeInteger (trade, 'trade_time');
            const orderType = this.safeString (trade, 'order_type');
            const tradeRole = this.safeString (trade, 'match_role');
            const direction = this.safeString (trade, 'direction');
            if (orderType !== undefined) {
                type = (orderType === '0') ? 'limit' : undefined;
            }
            if (tradeRole === '1') {
                takerOrMaker = 'taker';
            } else if (tradeRole === '2') {
                takerOrMaker = 'maker';
            } else {
                takerOrMaker = undefined;
            }
            if ((side === '1') || (direction === '1')) {
                // side = 'open long';
                side = 'buy';
            } else if ((side === '2') || (direction === '2')) {
                // side = 'open short';
                side = 'sell';
            } else if ((side === '3') || (direction === '3')) {
                // side = 'close long';
                side = 'sell';
            } else if ((side === '4') || (direction === '4')) {
                // side = 'close short';
                side = 'buy';
            }
        } else {
            const parts = side.split ('_');
            side = this.safeString (parts, 0);
            type = this.safeString (parts, 1);
            if (type === undefined) {
                type = 'limit';
            }
            const isMaker = this.safeValue (trade, 'is_maker');
            takerOrMaker = isMaker ? 'maker' : 'taker';
        }
        let fee = undefined;
        const feeCostString = this.safeString (trade, 'fee');
        if (feeCostString !== undefined) {
            const feeCurrencyId = this.safeString (trade, 'fee_currency');
            let feeCurrencyCode = undefined;
            if (feeCurrencyId !== undefined) {
                feeCurrencyCode = this.safeCurrencyCode (feeCurrencyId);
            }
            fee = {
                'cost': feeCostString,
                'currency': feeCurrencyCode,
            };
        }
        return this.safeTrade ({
            'id': id,
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'type': type,
            'order': orderId,
            'side': side,
            'price': priceString,
            'amount': amountString,
            'cost': undefined,
            'takerOrMaker': takerOrMaker,
            'fee': fee,
        }, market);
    }

    async fetchTime (params = {}) {
        /**
         * @method
         * @name digifinex#fetchTime
         * @description fetches the current integer timestamp in milliseconds from the exchange server
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {int} the current integer timestamp in milliseconds from the exchange server
         */
        const response = await this.publicSpotGetTime (params);
        //
        //     {
        //         "server_time": 1589873762,
        //         "code": 0
        //     }
        //
        return this.safeTimestamp (response, 'server_time');
    }

    async fetchStatus (params = {}) {
        /**
         * @method
         * @name digifinex#fetchStatus
         * @description the latest known information on the availability of the exchange API
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [status structure]{@link https://docs.ccxt.com/#/?id=exchange-status-structure}
         */
        const response = await this.publicSpotGetPing (params);
        //
        //     {
        //         "msg": "pong",
        //         "code": 0
        //     }
        //
        const code = this.safeInteger (response, 'code');
        const status = (code === 0) ? 'ok' : 'maintenance';
        return {
            'status': status,
            'updated': undefined,
            'eta': undefined,
            'url': undefined,
            'info': response,
        };
    }

    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        /**
         * @method
         * @name digifinex#fetchTrades
         * @description get the list of most recent trades for a particular symbol
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#get-recent-trades
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#recenttrades
         * @param {string} symbol unified symbol of the market to fetch trades for
         * @param {int} [since] timestamp in ms of the earliest trade to fetch
         * @param {int} [limit] the maximum amount of trades to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {};
        if (limit !== undefined) {
            request['limit'] = market['swap'] ? Math.min (limit, 100) : limit;
        }
        let response = undefined;
        if (market['swap']) {
            request['instrument_id'] = market['id'];
            response = await this.publicSwapGetPublicTrades (this.extend (request, params));
        } else {
            request['symbol'] = market['id'];
            response = await this.publicSpotGetTrades (this.extend (request, params));
        }
        //
        // spot
        //
        //     {
        //         "data":[
        //             {
        //                 "date":1564520003,
        //                 "id":1596149203,
        //                 "amount":0.7073,
        //                 "type":"buy",
        //                 "price":0.02193,
        //             },
        //             {
        //                 "date":1564520002,
        //                 "id":1596149165,
        //                 "amount":0.3232,
        //                 "type":"sell",
        //                 "price":0.021927,
        //             },
        //         ],
        //         "code": 0,
        //         "date": 1564520003,
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "instrument_id": "BTCUSDTPERP",
        //                 "trade_id": "1595190773677035521",
        //                 "direction": "4",
        //                 "volume": "4",
        //                 "price": "16188.3",
        //                 "trade_time": 1669158092314
        //             },
        //             ...
        //         ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseTrades (data, market, since, limit);
    }

    parseOHLCV (ohlcv, market: Market = undefined): OHLCV {
        //
        //     [
        //         1556712900,
        //         2205.899,
        //         0.029967,
        //         0.02997,
        //         0.029871,
        //         0.029927
        //     ]
        //
        if (market['swap']) {
            return [
                this.safeInteger (ohlcv, 0),
                this.safeNumber (ohlcv, 1), // open
                this.safeNumber (ohlcv, 2), // high
                this.safeNumber (ohlcv, 3), // low
                this.safeNumber (ohlcv, 4), // close
                this.safeNumber (ohlcv, 5), // volume
            ];
        } else {
            return [
                this.safeTimestamp (ohlcv, 0),
                this.safeNumber (ohlcv, 5), // open
                this.safeNumber (ohlcv, 3), // high
                this.safeNumber (ohlcv, 4), // low
                this.safeNumber (ohlcv, 2), // close
                this.safeNumber (ohlcv, 1), // volume
            ];
        }
    }

    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        /**
         * @method
         * @name digifinex#fetchOHLCV
         * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#get-candles-data
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#recentcandle
         * @param {string} symbol unified symbol of the market to fetch OHLCV data for
         * @param {string} timeframe the length of time each candle represents
         * @param {int} [since] timestamp in ms of the earliest candle to fetch
         * @param {int} [limit] the maximum amount of candles to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {};
        let response = undefined;
        if (market['swap']) {
            request['instrument_id'] = market['id'];
            request['granularity'] = timeframe;
            if (limit !== undefined) {
                request['limit'] = Math.min (limit, 100);
            }
            response = await this.publicSwapGetPublicCandles (this.extend (request, params));
        } else {
            request['symbol'] = market['id'];
            request['period'] = this.safeString (this.timeframes, timeframe, timeframe);
            if (since !== undefined) {
                const startTime = this.parseToInt (since / 1000);
                request['start_time'] = startTime;
                if (limit !== undefined) {
                    const duration = this.parseTimeframe (timeframe);
                    request['end_time'] = this.sum (startTime, limit * duration);
                }
            } else if (limit !== undefined) {
                const endTime = this.seconds ();
                const duration = this.parseTimeframe (timeframe);
                const auxLimit = limit; // in c# -limit is mutating the arg
                request['start_time'] = this.sum (endTime, -auxLimit * duration);
            }
            response = await this.publicSpotGetKline (this.extend (request, params));
        }
        //
        // spot
        //
        //     {
        //         "code":0,
        //         "data":[
        //             [1556712900,2205.899,0.029967,0.02997,0.029871,0.029927],
        //             [1556713800,1912.9174,0.029992,0.030014,0.029955,0.02996],
        //             [1556714700,1556.4795,0.029974,0.030019,0.029969,0.02999],
        //         ]
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "instrument_id": "BTCUSDTPERP",
        //             "granularity": "1m",
        //             "candles": [
        //                 [1588089660000,"6900","6900","6900","6900","0","0"],
        //                 [1588089720000,"6900","6900","6900","6900","0","0"],
        //                 [1588089780000,"6900","6900","6900","6900","0","0"],
        //             ]
        //         }
        //     }
        //
        let candles = undefined;
        if (market['swap']) {
            const data = this.safeValue (response, 'data', {});
            candles = this.safeValue (data, 'candles', []);
        } else {
            candles = this.safeValue (response, 'data', []);
        }
        return this.parseOHLCVs (candles, market, timeframe, since, limit);
    }

    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#createOrder
         * @description create a trade order
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#create-new-order
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#orderplace
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much you want to trade in units of the base currency, spot market orders use the quote currency, swap requires the number of contracts
         * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.timeInForce] "GTC", "IOC", "FOK", or "PO"
         * @param {bool} [params.postOnly] true or false
         * @param {bool} [params.reduceOnly] true or false
         * @param {string} [params.marginMode] 'cross' or 'isolated', for spot margin trading
         * @param {float} [params.cost] *spot market buy only* the quote quantity that can be used as an alternative for the amount
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marginResult = this.handleMarginModeAndParams ('createOrder', params);
        const marginMode = marginResult[0];
        const request = this.createOrderRequest (symbol, type, side, amount, price, params);
        let response = undefined;
        if (market['swap']) {
            response = await this.privateSwapPostTradeOrderPlace (request);
        } else {
            if (marginMode !== undefined) {
                response = await this.privateSpotPostMarginOrderNew (request);
            } else {
                response = await this.privateSpotPostSpotOrderNew (request);
            }
        }
        //
        // spot and margin
        //
        //     {
        //         "code": 0,
        //         "order_id": "198361cecdc65f9c8c9bb2fa68faec40"
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": "1590873693003714560"
        //     }
        //
        const order = this.parseOrder (response, market);
        order['symbol'] = market['symbol'];
        order['type'] = type;
        order['side'] = side;
        order['amount'] = amount;
        order['price'] = price;
        return order;
    }

    async createOrders (orders: OrderRequest[], params = {}) {
        /**
         * @method
         * @name digifinex#createOrders
         * @description create a list of trade orders (all orders should be of the same symbol)
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#create-multiple-order
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#batchorder
         * @param {Array} orders list of orders to create, each object should contain the parameters required by createOrder, namely symbol, type, side, amount, price and params
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const ordersRequests = [];
        let symbol = undefined;
        let marginMode = undefined;
        for (let i = 0; i < orders.length; i++) {
            const rawOrder = orders[i];
            const marketId = this.safeString (rawOrder, 'symbol');
            if (symbol === undefined) {
                symbol = marketId;
            } else {
                if (symbol !== marketId) {
                    throw new BadRequest (this.id + ' createOrders() requires all orders to have the same symbol');
                }
            }
            const type = this.safeString (rawOrder, 'type');
            const side = this.safeString (rawOrder, 'side');
            const amount = this.safeValue (rawOrder, 'amount');
            const price = this.safeValue (rawOrder, 'price');
            const orderParams = this.safeValue (rawOrder, 'params', {});
            const marginResult = this.handleMarginModeAndParams ('createOrders', orderParams);
            const currentMarginMode = marginResult[0];
            if (currentMarginMode !== undefined) {
                if (marginMode === undefined) {
                    marginMode = currentMarginMode;
                } else {
                    if (marginMode !== currentMarginMode) {
                        throw new BadRequest (this.id + ' createOrders() requires all orders to have the same margin mode (isolated or cross)');
                    }
                }
            }
            const orderRequest = this.createOrderRequest (marketId, type, side, amount, price, orderParams);
            ordersRequests.push (orderRequest);
        }
        const market = this.market (symbol);
        const request: Dict = {};
        let response = undefined;
        if (market['swap']) {
            response = await this.privateSwapPostTradeBatchOrder (ordersRequests);
        } else {
            request['market'] = (marginMode !== undefined) ? 'margin' : 'spot';
            request['symbol'] = market['id'];
            request['list'] = this.json (ordersRequests);
            response = await this.privateSpotPostMarketOrderBatchNew (request);
        }
        //
        // spot
        //
        //     {
        //         "code": 0,
        //         "order_ids": [
        //             "064290fbe2d26e7b28d7e6c0a5cf70a5",
        //             "24c8f9b73d81e4d9d8d7e3280281c258"
        //         ]
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             "1720297963537829888",
        //             "1720297963537829889"
        //         ]
        //     }
        //
        let data = [];
        if (market['swap']) {
            data = this.safeValue (response, 'data', []);
        } else {
            data = this.safeValue (response, 'order_ids', []);
        }
        const result = [];
        for (let i = 0; i < orders.length; i++) {
            const rawOrder = orders[i];
            const individualOrder: Dict = {};
            individualOrder['order_id'] = data[i];
            individualOrder['instrument_id'] = market['id'];
            individualOrder['amount'] = this.safeNumber (rawOrder, 'amount');
            individualOrder['price'] = this.safeNumber (rawOrder, 'price');
            result.push (individualOrder);
        }
        return this.parseOrders (result, market);
    }

    createOrderRequest (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        /**
         * @method
         * @ignore
         * @name digifinex#createOrderRequest
         * @description helper function to build request
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much you want to trade in units of the base currency, spot market orders use the quote currency, swap requires the number of contracts
         * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} request to be sent to the exchange
         */
        const market = this.market (symbol);
        let marketType = undefined;
        let marginMode = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('createOrderRequest', market, params);
        [ marginMode, params ] = this.handleMarginModeAndParams ('createOrderRequest', params);
        if (marginMode !== undefined) {
            marketType = 'margin';
        }
        const request: Dict = {};
        const swap = (marketType === 'swap');
        const isMarketOrder = (type === 'market');
        const isLimitOrder = (type === 'limit');
        const marketIdRequest = swap ? 'instrument_id' : 'symbol';
        request[marketIdRequest] = market['id'];
        let postOnly = this.isPostOnly (isMarketOrder, false, params);
        let postOnlyParsed = undefined;
        if (swap) {
            const reduceOnly = this.safeBool (params, 'reduceOnly', false);
            const timeInForce = this.safeString (params, 'timeInForce');
            let orderType = undefined;
            if (side === 'buy') {
                const requestType = (reduceOnly) ? 4 : 1;
                request['type'] = requestType;
            } else {
                const requestType = (reduceOnly) ? 3 : 2;
                request['type'] = requestType;
            }
            if (isLimitOrder) {
                orderType = 0;
            }
            if (timeInForce === 'FOK') {
                orderType = isMarketOrder ? 15 : 9;
            } else if (timeInForce === 'IOC') {
                orderType = isMarketOrder ? 13 : 4;
            } else if ((timeInForce === 'GTC') || (isMarketOrder)) {
                orderType = 14;
            } else if (timeInForce === 'PO') {
                postOnly = true;
            }
            if (price !== undefined) {
                request['price'] = this.priceToPrecision (symbol, price);
            }
            request['order_type'] = orderType;
            request['size'] = amount;  // swap orders require the amount to be the number of contracts
            params = this.omit (params, [ 'reduceOnly', 'timeInForce' ]);
        } else {
            postOnlyParsed = (postOnly === true) ? 1 : 2;
            request['market'] = marketType;
            let suffix = '';
            if (type === 'market') {
                suffix = '_market';
            } else {
                request['price'] = this.priceToPrecision (symbol, price);
            }
            request['type'] = side + suffix;
            // limit orders require the amount in the base currency, market orders require the amount in the quote currency
            let quantity = undefined;
            let createMarketBuyOrderRequiresPrice = true;
            [ createMarketBuyOrderRequiresPrice, params ] = this.handleOptionAndParams (params, 'createOrderRequest', 'createMarketBuyOrderRequiresPrice', true);
            if (isMarketOrder && (side === 'buy')) {
                const cost = this.safeNumber (params, 'cost');
                params = this.omit (params, 'cost');
                if (cost !== undefined) {
                    quantity = this.costToPrecision (symbol, cost);
                } else if (createMarketBuyOrderRequiresPrice) {
                    if (price === undefined) {
                        throw new InvalidOrder (this.id + ' createOrder() requires a price argument for market buy orders on spot markets to calculate the total amount to spend (amount * price), alternatively set the createMarketBuyOrderRequiresPrice option or param to false and pass the cost to spend in the amount argument');
                    } else {
                        const amountString = this.numberToString (amount);
                        const priceString = this.numberToString (price);
                        const costRequest = this.parseNumber (Precise.stringMul (amountString, priceString));
                        quantity = this.costToPrecision (symbol, costRequest);
                    }
                } else {
                    quantity = this.costToPrecision (symbol, amount);
                }
            } else {
                quantity = this.amountToPrecision (symbol, amount);
            }
            request['amount'] = quantity;
        }
        if (postOnly) {
            if (postOnlyParsed) {
                request['post_only'] = postOnlyParsed;
            } else {
                request['post_only'] = postOnly;
            }
        }
        params = this.omit (params, [ 'postOnly' ]);
        return this.extend (request, params);
    }

    async createMarketBuyOrderWithCost (symbol: string, cost: number, params = {}) {
        /**
         * @method
         * @name digifinex#createMarketBuyOrderWithCost
         * @description create a market buy order by providing the symbol and cost
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#create-new-order
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {float} cost how much you want to trade in units of the quote currency
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['spot']) {
            throw new NotSupported (this.id + ' createMarketBuyOrderWithCost() supports spot orders only');
        }
        params['createMarketBuyOrderRequiresPrice'] = false;
        return await this.createOrder (symbol, 'market', 'buy', cost, undefined, params);
    }

    async cancelOrder (id: string, symbol: Str = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#cancelOrder
         * @description cancels an open order
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#cancel-order
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#cancelorder
         * @param {string} id order id
         * @param {string} symbol not used by digifinex cancelOrder ()
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        id = id.toString ();
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('cancelOrder', market, params);
        const request: Dict = {
            'order_id': id,
        };
        if (marketType === 'swap') {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
            }
            request['instrument_id'] = market['id'];
        } else {
            request['market'] = marketType;
        }
        const [ marginMode, query ] = this.handleMarginModeAndParams ('cancelOrder', params);
        let response = undefined;
        if (marginMode !== undefined || marketType === 'margin') {
            marketType = 'margin';
            response = await this.privateSpotPostMarginOrderCancel (this.extend (request, query));
        } else if (marketType === 'spot') {
            response = await this.privateSpotPostSpotOrderCancel (this.extend (request, query));
        } else if (marketType === 'swap') {
            response = await this.privateSwapPostTradeCancelOrder (this.extend (request, query));
        } else {
            throw new NotSupported (this.id + ' cancelOrder() not support this market type');
        }
        //
        // spot and margin
        //
        //     {
        //         "code": 0,
        //         "success": [
        //             "198361cecdc65f9c8c9bb2fa68faec40",
        //             "3fb0d98e51c18954f10d439a9cf57de0"
        //         ],
        //         "error": [
        //             "78a7104e3c65cc0c5a212a53e76d0205"
        //         ]
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": "1590923061186531328"
        //     }
        //
        if ((marketType === 'spot') || (marketType === 'margin')) {
            const canceledOrders = this.safeValue (response, 'success', []);
            const numCanceledOrders = canceledOrders.length;
            if (numCanceledOrders !== 1) {
                throw new OrderNotFound (this.id + ' cancelOrder() ' + id + ' not found');
            }
            const orders = this.parseCancelOrders (response);
            return this.safeDict (orders, 0);
        } else {
            return this.safeOrder ({
                'info': response,
                'orderId': this.safeString (response, 'data'),
            });
        }
    }

    parseCancelOrders (response) {
        const success = this.safeList (response, 'success');
        const error = this.safeList (response, 'error');
        const result = [];
        for (let i = 0; i < success.length; i++) {
            const order = success[i];
            result.push (this.safeOrder ({
                'info': order,
                'id': order,
                'status': 'canceled',
            }));
        }
        for (let i = 0; i < error.length; i++) {
            const order = error[i];
            result.push (this.safeOrder ({
                'info': order,
                'id': this.safeString2 (order, 'order-id', 'order_id'),
                'status': 'failed',
                'clientOrderId': this.safeString (order, 'client-order-id'),
            }));
        }
        return result;
    }

    async cancelOrders (ids, symbol: Str = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#cancelOrders
         * @description cancel multiple orders
         * @param {string[]} ids order ids
         * @param {string} symbol not used by digifinex cancelOrders ()
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        const defaultType = this.safeString (this.options, 'defaultType', 'spot');
        const orderType = this.safeString (params, 'type', defaultType);
        params = this.omit (params, 'type');
        const request: Dict = {
            'market': orderType,
            'order_id': ids.join (','),
        };
        const response = await this.privateSpotPostSpotOrderCancel (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "success": [
        //             "198361cecdc65f9c8c9bb2fa68faec40",
        //             "3fb0d98e51c18954f10d439a9cf57de0"
        //         ],
        //         "error": [
        //             "78a7104e3c65cc0c5a212a53e76d0205"
        //         ]
        //     }
        //
        return this.parseCancelOrders (response);
    }

    parseOrderStatus (status: Str) {
        const statuses: Dict = {
            '0': 'open',
            '1': 'open', // partially filled
            '2': 'closed',
            '3': 'canceled',
            '4': 'canceled', // partially filled and canceled
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        //
        // spot: createOrder
        //
        //     {
        //         "code": 0,
        //         "order_id": "198361cecdc65f9c8c9bb2fa68faec40"
        //     }
        //
        // swap: createOrder
        //
        //     {
        //         "code": 0,
        //         "data": "1590873693003714560"
        //     }
        //
        // spot and swap: createOrders
        //
        //     {
        //         "order_id": "d64d92a5e0a120f792f385485bc3d95b",
        //         "instrument_id": "BTC_USDT",
        //         "amount": 0.0001,
        //         "price": 27000
        //     }
        //
        // spot: fetchOrder, fetchOpenOrders, fetchOrders
        //
        //     {
        //         "symbol": "BTC_USDT",
        //         "order_id": "dd3164b333a4afa9d5730bb87f6db8b3",
        //         "created_date": 1562303547,
        //         "finished_date": 0,
        //         "price": 0.1,
        //         "amount": 1,
        //         "cash_amount": 1,
        //         "executed_amount": 0,
        //         "avg_price": 0,
        //         "status": 1,
        //         "type": "buy",
        //         "kind": "margin"
        //     }
        //
        // swap: fetchOrder, fetchOpenOrders, fetchOrders
        //
        //     {
        //         "order_id": "1590898207657824256",
        //         "instrument_id": "BTCUSDTPERP",
        //         "margin_mode": "crossed",
        //         "contract_val": "0.001",
        //         "type": 1,
        //         "order_type": 0,
        //         "price": "14000",
        //         "size": "6",
        //         "filled_qty": "0",
        //         "price_avg": "0",
        //         "fee": "0",
        //         "state": 0,
        //         "leverage": "20",
        //         "turnover": "0",
        //         "has_stop": 0,
        //         "insert_time": 1668134664828,
        //         "time_stamp": 1668134664828
        //     }
        //
        let timestamp = undefined;
        let lastTradeTimestamp = undefined;
        let timeInForce = undefined;
        let type = undefined;
        let side = this.safeString (order, 'type');
        const marketId = this.safeString2 (order, 'symbol', 'instrument_id');
        const symbol = this.safeSymbol (marketId, market);
        market = this.market (symbol);
        if (market['type'] === 'swap') {
            const orderType = this.safeInteger (order, 'order_type');
            if (orderType !== undefined) {
                if ((orderType === 9) || (orderType === 10) || (orderType === 11) || (orderType === 12) || (orderType === 15)) {
                    timeInForce = 'FOK';
                } else if ((orderType === 1) || (orderType === 2) || (orderType === 3) || (orderType === 4) || (orderType === 13)) {
                    timeInForce = 'IOC';
                } else if ((orderType === 6) || (orderType === 7) || (orderType === 8) || (orderType === 14)) {
                    timeInForce = 'GTC';
                }
                if ((orderType === 0) || (orderType === 1) || (orderType === 4) || (orderType === 5) || (orderType === 9) || (orderType === 10)) {
                    type = 'limit';
                } else {
                    type = 'market';
                }
            }
            if (side === '1') {
                side = 'open long';
            } else if (side === '2') {
                side = 'open short';
            } else if (side === '3') {
                side = 'close long';
            } else if (side === '4') {
                side = 'close short';
            }
            timestamp = this.safeInteger (order, 'insert_time');
            lastTradeTimestamp = this.safeInteger (order, 'time_stamp');
        } else {
            timestamp = this.safeTimestamp (order, 'created_date');
            lastTradeTimestamp = this.safeTimestamp (order, 'finished_date');
            if (side !== undefined) {
                const parts = side.split ('_');
                const numParts = parts.length;
                if (numParts > 1) {
                    side = parts[0];
                    type = parts[1];
                } else {
                    type = 'limit';
                }
            }
        }
        return this.safeOrder ({
            'info': order,
            'id': this.safeString2 (order, 'order_id', 'data'),
            'clientOrderId': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': timeInForce,
            'postOnly': undefined,
            'side': side,
            'price': this.safeNumber (order, 'price'),
            'stopPrice': undefined,
            'triggerPrice': undefined,
            'amount': this.safeNumber2 (order, 'amount', 'size'),
            'filled': this.safeNumber2 (order, 'executed_amount', 'filled_qty'),
            'remaining': undefined,
            'cost': undefined,
            'average': this.safeNumber2 (order, 'avg_price', 'price_avg'),
            'status': this.parseOrderStatus (this.safeString2 (order, 'status', 'state')),
            'fee': {
                'cost': this.safeNumber (order, 'fee'),
            },
            'trades': undefined,
        }, market);
    }

    async fetchOpenOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        /**
         * @method
         * @name digifinex#fetchOpenOrders
         * @description fetch all unfilled currently open orders
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#current-active-orders
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#openorder
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch open orders for
         * @param {int} [limit] the maximum number of  open orders structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchOpenOrders', market, params);
        const [ marginMode, query ] = this.handleMarginModeAndParams ('fetchOpenOrders', params);
        const request: Dict = {};
        const swap = (marketType === 'swap');
        if (swap) {
            if (since !== undefined) {
                request['start_timestamp'] = since;
            }
            if (limit !== undefined) {
                request['limit'] = limit;
            }
        } else {
            request['market'] = marketType;
        }
        if (market !== undefined) {
            const marketIdRequest = swap ? 'instrument_id' : 'symbol';
            request[marketIdRequest] = market['id'];
        }
        let response = undefined;
        if (marginMode !== undefined || marketType === 'margin') {
            marketType = 'margin';
            response = await this.privateSpotGetMarginOrderCurrent (this.extend (request, query));
        } else if (marketType === 'spot') {
            response = await this.privateSpotGetSpotOrderCurrent (this.extend (request, query));
        } else if (marketType === 'swap') {
            response = await this.privateSwapGetTradeOpenOrders (this.extend (request, query));
        } else {
            throw new NotSupported (this.id + ' fetchOpenOrders() not support this market type');
        }
        //
        // spot and margin
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "symbol": "BTC_USDT",
        //                 "order_id": "dd3164b333a4afa9d5730bb87f6db8b3",
        //                 "created_date": 1562303547,
        //                 "finished_date": 0,
        //                 "price": 0.1,
        //                 "amount": 1,
        //                 "cash_amount": 1,
        //                 "executed_amount": 0,
        //                 "avg_price": 0,
        //                 "status": 1,
        //                 "type": "buy",
        //                 "kind": "margin"
        //             }
        //         ]
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "order_id": "1590898207657824256",
        //                 "instrument_id": "BTCUSDTPERP",
        //                 "margin_mode": "crossed",
        //                 "contract_val": "0.001",
        //                 "type": 1,
        //                 "order_type": 0,
        //                 "price": "14000",
        //                 "size": "6",
        //                 "filled_qty": "0",
        //                 "price_avg": "0",
        //                 "fee": "0",
        //                 "state": 0,
        //                 "leverage": "20",
        //                 "turnover": "0",
        //                 "has_stop": 0,
        //                 "insert_time": 1668134664828,
        //                 "time_stamp": 1668134664828
        //             },
        //             ...
        //         ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseOrders (data, market, since, limit);
    }

    async fetchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        /**
         * @method
         * @name digifinex#fetchOrders
         * @description fetches information on multiple orders made by the user
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#get-all-orders-including-history-orders
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#historyorder
         * @param {string} symbol unified market symbol of the market orders were made in
         * @param {int} [since] the earliest time in ms to fetch orders for
         * @param {int} [limit] the maximum number of order structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchOrders', market, params);
        const [ marginMode, query ] = this.handleMarginModeAndParams ('fetchOrders', params);
        const request: Dict = {};
        if (marketType === 'swap') {
            if (since !== undefined) {
                request['start_timestamp'] = since;
            }
        } else {
            request['market'] = marketType;
            if (since !== undefined) {
                request['start_time'] = this.parseToInt (since / 1000); // default 3 days from now, max 30 days
            }
        }
        if (market !== undefined) {
            const marketIdRequest = (marketType === 'swap') ? 'instrument_id' : 'symbol';
            request[marketIdRequest] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let response = undefined;
        if (marginMode !== undefined || marketType === 'margin') {
            marketType = 'margin';
            response = await this.privateSpotGetMarginOrderHistory (this.extend (request, query));
        } else if (marketType === 'spot') {
            response = await this.privateSpotGetSpotOrderHistory (this.extend (request, query));
        } else if (marketType === 'swap') {
            response = await this.privateSwapGetTradeHistoryOrders (this.extend (request, query));
        } else {
            throw new NotSupported (this.id + ' fetchOrders() not support this market type');
        }
        //
        // spot and margin
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "symbol": "BTC_USDT",
        //                 "order_id": "dd3164b333a4afa9d5730bb87f6db8b3",
        //                 "created_date": 1562303547,
        //                 "finished_date": 0,
        //                 "price": 0.1,
        //                 "amount": 1,
        //                 "cash_amount": 1,
        //                 "executed_amount": 0,
        //                 "avg_price": 0,
        //                 "status": 1,
        //                 "type": "buy",
        //                 "kind": "margin"
        //             }
        //         ]
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "order_id": "1590136768156405760",
        //                 "instrument_id": "BTCUSDTPERP",
        //                 "margin_mode": "crossed",
        //                 "contract_val": "0.001",
        //                 "type": 1,
        //                 "order_type": 8,
        //                 "price": "18660.2",
        //                 "size": "1",
        //                 "filled_qty": "1",
        //                 "price_avg": "18514.5",
        //                 "fee": "0.00925725",
        //                 "state": 2,
        //                 "leverage": "20",
        //                 "turnover": "18.5145",
        //                 "has_stop": 0,
        //                 "insert_time": 1667953123526,
        //                 "time_stamp": 1667953123596
        //             },
        //             ...
        //         ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseOrders (data, market, since, limit);
    }

    async fetchOrder (id: string, symbol: Str = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#fetchOrder
         * @description fetches information on an order made by the user
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#get-order-status
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#orderinfo
         * @param {string} id order id
         * @param {string} symbol unified symbol of the market the order was made in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
         */
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchOrder', market, params);
        const [ marginMode, query ] = this.handleMarginModeAndParams ('fetchOrder', params);
        const request: Dict = {
            'order_id': id,
        };
        if (marketType === 'swap') {
            if (market !== undefined) {
                request['instrument_id'] = market['id'];
            }
        } else {
            request['market'] = marketType;
        }
        let response = undefined;
        if ((marginMode !== undefined) || (marketType === 'margin')) {
            marketType = 'margin';
            response = await this.privateSpotGetMarginOrder (this.extend (request, query));
        } else if (marketType === 'spot') {
            response = await this.privateSpotGetSpotOrder (this.extend (request, query));
        } else if (marketType === 'swap') {
            response = await this.privateSwapGetTradeOrderInfo (this.extend (request, query));
        } else {
            throw new NotSupported (this.id + ' fetchOrder() not support this market type');
        }
        //
        // spot and margin
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "symbol": "BTC_USDT",
        //                 "order_id": "dd3164b333a4afa9d5730bb87f6db8b3",
        //                 "created_date": 1562303547,
        //                 "finished_date": 0,
        //                 "price": 0.1,
        //                 "amount": 1,
        //                 "cash_amount": 1,
        //                 "executed_amount": 0,
        //                 "avg_price": 0,
        //                 "status": 1,
        //                 "type": "buy",
        //                 "kind": "margin"
        //             }
        //         ]
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "order_id": "1590923061186531328",
        //             "instrument_id": "ETHUSDTPERP",
        //             "margin_mode": "crossed",
        //             "contract_val": "0.01",
        //             "type": 1,
        //             "order_type": 0,
        //             "price": "900",
        //             "size": "6",
        //             "filled_qty": "0",
        //             "price_avg": "0",
        //             "fee": "0",
        //             "state": 0,
        //             "leverage": "20",
        //             "turnover": "0",
        //             "has_stop": 0,
        //             "insert_time": 1668140590372,
        //             "time_stamp": 1668140590372
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data');
        const order = (marketType === 'swap') ? data : this.safeValue (data, 0);
        if (order === undefined) {
            throw new OrderNotFound (this.id + ' fetchOrder() order ' + id.toString () + ' not found');
        }
        return this.parseOrder (order, market);
    }

    async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#fetchMyTrades
         * @description fetch all trades made by the user
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#customer-39-s-trades
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#historytrade
         * @param {string} symbol unified market symbol
         * @param {int} [since] the earliest time in ms to fetch trades for
         * @param {int} [limit] the maximum number of trades structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
         */
        await this.loadMarkets ();
        let market = undefined;
        const request: Dict = {};
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchMyTrades', market, params);
        const [ marginMode, query ] = this.handleMarginModeAndParams ('fetchMyTrades', params);
        if (marketType === 'swap') {
            if (since !== undefined) {
                request['start_timestamp'] = since;
            }
        } else {
            request['market'] = marketType;
            if (since !== undefined) {
                request['start_time'] = this.parseToInt (since / 1000); // default 3 days from now, max 30 days
            }
        }
        const marketIdRequest = (marketType === 'swap') ? 'instrument_id' : 'symbol';
        if (symbol !== undefined) {
            request[marketIdRequest] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let response = undefined;
        if (marginMode !== undefined || marketType === 'margin') {
            marketType = 'margin';
            response = await this.privateSpotGetMarginMytrades (this.extend (request, query));
        } else if (marketType === 'spot') {
            response = await this.privateSpotGetSpotMytrades (this.extend (request, query));
        } else if (marketType === 'swap') {
            response = await this.privateSwapGetTradeHistoryTrades (this.extend (request, query));
        } else {
            throw new NotSupported (this.id + ' fetchMyTrades() not support this market type');
        }
        //
        // spot and margin
        //
        //      {
        //          "list":[
        //              {
        //                  "timestamp":1639506068,
        //                  "is_maker":false,
        //                  "id":"8975951332",
        //                  "amount":31.83,
        //                  "side":"sell_market",
        //                  "symbol":"DOGE_USDT",
        //                  "fee_currency":"USDT",
        //                  "fee":0.01163774826
        //                  ,"order_id":"32b169792f4a7a19e5907dc29fc123d4",
        //                  "price":0.182811
        //                }
        //             ],
        //           "code": 0
        //      }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "trade_id": "1590136768424841218",
        //                 "instrument_id": "BTCUSDTPERP",
        //                 "order_id": "1590136768156405760",
        //                 "type": 1,
        //                 "order_type": 8,
        //                 "price": "18514.5",
        //                 "size": "1",
        //                 "fee": "0.00925725",
        //                 "close_profit": "0",
        //                 "leverage": "20",
        //                 "trade_type": 0,
        //                 "match_role": 1,
        //                 "trade_time": 1667953123562
        //             },
        //             ...
        //         ]
        //     }
        //
        const responseRequest = (marketType === 'swap') ? 'data' : 'list';
        const data = this.safeList (response, responseRequest, []);
        return this.parseTrades (data, market, since, limit);
    }

    parseLedgerEntryType (type) {
        const types: Dict = {};
        return this.safeString (types, type, type);
    }

    parseLedgerEntry (item: Dict, currency: Currency = undefined) {
        //
        // spot and margin
        //
        //     {
        //         "currency_mark": "BTC",
        //         "type": 100234,
        //         "num": -10,
        //         "balance": 0.1,
        //         "time": 1546272000
        //     }
        //
        // swap
        //
        //     {
        //         "currency": "USDT",
        //         "finance_type": 17,
        //         "change": "-3.01",
        //         "timestamp": 1650809432000
        //     }
        //
        const type = this.parseLedgerEntryType (this.safeString2 (item, 'type', 'finance_type'));
        const code = this.safeCurrencyCode (this.safeString2 (item, 'currency_mark', 'currency'), currency);
        const amount = this.safeNumber2 (item, 'num', 'change');
        const after = this.safeNumber (item, 'balance');
        let timestamp = this.safeTimestamp (item, 'time');
        if (timestamp === undefined) {
            timestamp = this.safeInteger (item, 'timestamp');
        }
        return {
            'info': item,
            'id': undefined,
            'direction': undefined,
            'account': undefined,
            'referenceId': undefined,
            'referenceAccount': undefined,
            'type': type,
            'currency': code,
            'amount': amount,
            'before': undefined,
            'after': after,
            'status': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'fee': undefined,
        };
    }

    async fetchLedger (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#fetchLedger
         * @description fetch the history of changes, actions done by the user or operations that altered balance of the user
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#spot-margin-otc-financial-logs
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#bills
         * @param {string} code unified currency code, default is undefined
         * @param {int} [since] timestamp in ms of the earliest ledger entry, default is undefined
         * @param {int} [limit] max number of ledger entrys to return, default is undefined
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [ledger structure]{@link https://docs.ccxt.com/#/?id=ledger-structure}
         */
        await this.loadMarkets ();
        const request: Dict = {};
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchLedger', undefined, params);
        const [ marginMode, query ] = this.handleMarginModeAndParams ('fetchLedger', params);
        if (marketType === 'swap') {
            if (since !== undefined) {
                request['start_timestamp'] = since;
            }
        } else {
            request['market'] = marketType;
            if (since !== undefined) {
                request['start_time'] = this.parseToInt (since / 1000); // default 3 days from now, max 30 days
            }
        }
        const currencyIdRequest = (marketType === 'swap') ? 'currency' : 'currency_mark';
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
            request[currencyIdRequest] = currency['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let response = undefined;
        if (marginMode !== undefined || marketType === 'margin') {
            marketType = 'margin';
            response = await this.privateSpotGetMarginFinancelog (this.extend (request, query));
        } else if (marketType === 'spot') {
            response = await this.privateSpotGetSpotFinancelog (this.extend (request, query));
        } else if (marketType === 'swap') {
            response = await this.privateSwapGetAccountFinanceRecord (this.extend (request, query));
        } else {
            throw new NotSupported (this.id + ' fetchLedger() not support this market type');
        }
        //
        // spot and margin
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "total": 521,
        //             "finance": [
        //                 {
        //                     "currency_mark": "BTC",
        //                     "type": 100234,
        //                     "num": 28457,
        //                     "balance": 0.1,
        //                     "time": 1546272000
        //                 }
        //             ]
        //         }
        //     }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "currency": "USDT",
        //                 "finance_type": 17,
        //                 "change": "3.01",
        //                 "timestamp": 1650809432000
        //             },
        //         ]
        //     }
        //
        let ledger = undefined;
        if (marketType === 'swap') {
            ledger = this.safeValue (response, 'data', []);
        } else {
            const data = this.safeValue (response, 'data', {});
            ledger = this.safeValue (data, 'finance', []);
        }
        return this.parseLedger (ledger, currency, since, limit);
    }

    parseDepositAddress (depositAddress, currency: Currency = undefined) {
        //
        //     {
        //         "addressTag":"",
        //         "address":"0xf1104d9f8624f89775a3e9d480fc0e75a8ef4373",
        //         "currency":"USDT",
        //         "chain":"ERC20"
        //     }
        //
        const address = this.safeString (depositAddress, 'address');
        const tag = this.safeString (depositAddress, 'addressTag');
        const currencyId = this.safeStringUpper (depositAddress, 'currency');
        const code = this.safeCurrencyCode (currencyId);
        return {
            'info': depositAddress,
            'currency': code,
            'address': address,
            'tag': tag,
            'network': undefined,
        };
    }

    async fetchDepositAddress (code: string, params = {}) {
        /**
         * @method
         * @name digifinex#fetchDepositAddress
         * @description fetch the deposit address for a currency associated with this account
         * @param {string} code unified currency code
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
         */
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'currency': currency['id'],
        };
        const response = await this.privateSpotGetDepositAddress (this.extend (request, params));
        //
        //     {
        //         "data":[
        //             {
        //                 "addressTag":"",
        //                 "address":"0xf1104d9f8624f89775a3e9d480fc0e75a8ef4373",
        //                 "currency":"USDT",
        //                 "chain":"ERC20"
        //             }
        //         ],
        //         "code":200
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        const addresses = this.parseDepositAddresses (data, [ currency['code'] ]);
        const address = this.safeValue (addresses, code);
        if (address === undefined) {
            throw new InvalidAddress (this.id + ' fetchDepositAddress() did not return an address for ' + code + ' - create the deposit address in the user settings on the exchange website first.');
        }
        return address;
    }

    async fetchTransactionsByType (type, code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        let currency = undefined;
        const request: Dict = {
            // 'currency': currency['id'],
            // 'from': 'fromId', // When direct is' prev ', from is 1, returning from old to new ascending, when direct is' next ', from is the ID of the most recent record, returned from the old descending order
            // 'size': 100, // default 100, max 500
            // 'direct': 'prev', // "prev" ascending, "next" descending
        };
        if (code !== undefined) {
            currency = this.currency (code);
            request['currency'] = currency['id'];
        }
        if (limit !== undefined) {
            request['size'] = Math.min (500, limit);
        }
        let response = undefined;
        if (type === 'deposit') {
            response = await this.privateSpotGetDepositHistory (this.extend (request, params));
        } else {
            response = await this.privateSpotGetWithdrawHistory (this.extend (request, params));
        }
        //
        //     {
        //         "code": 200,
        //         "data": [
        //             {
        //                 "id": 1171,
        //                 "currency": "xrp",
        //                 "hash": "ed03094b84eafbe4bc16e7ef766ee959885ee5bcb265872baaa9c64e1cf86c2b",
        //                 "chain": "",
        //                 "amount": 7.457467,
        //                 "address": "rae93V8d2mdoUQHwBDBdM4NHCMehRJAsbm",
        //                 "memo": "100040",
        //                 "fee": 0,
        //                 "state": "safe",
        //                 "created_date": "2020-04-20 11:23:00",
        //                 "finished_date": "2020-04-20 13:23:00"
        //             },
        //         ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseTransactions (data, currency, since, limit, { 'type': type });
    }

    async fetchDeposits (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        /**
         * @method
         * @name digifinex#fetchDeposits
         * @description fetch all deposits made to an account
         * @param {string} code unified currency code
         * @param {int} [since] the earliest time in ms to fetch deposits for
         * @param {int} [limit] the maximum number of deposits structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        return await this.fetchTransactionsByType ('deposit', code, since, limit, params);
    }

    async fetchWithdrawals (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        /**
         * @method
         * @name digifinex#fetchWithdrawals
         * @description fetch all withdrawals made from an account
         * @param {string} code unified currency code
         * @param {int} [since] the earliest time in ms to fetch withdrawals for
         * @param {int} [limit] the maximum number of withdrawals structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        return await this.fetchTransactionsByType ('withdrawal', code, since, limit, params);
    }

    parseTransactionStatus (status: Str) {
        // deposit state includes: 1 (in deposit), 2 (to be confirmed), 3 (successfully deposited), 4 (stopped)
        // withdrawal state includes: 1 (application in progress), 2 (to be confirmed), 3 (completed), 4 (rejected)
        const statuses: Dict = {
            '1': 'pending', // in Progress
            '2': 'pending', // to be confirmed
            '3': 'ok', // Completed
            '4': 'failed', // Rejected
        };
        return this.safeString (statuses, status, status);
    }

    parseTransaction (transaction: Dict, currency: Currency = undefined): Transaction {
        //
        // withdraw
        //
        //     {
        //         "code": 200,
        //         "withdraw_id": 700
        //     }
        //
        // fetchDeposits, fetchWithdrawals
        //
        //     {
        //         "id": 1171,
        //         "currency": "xrp",
        //         "hash": "ed03094b84eafbe4bc16e7ef766ee959885ee5bcb265872baaa9c64e1cf86c2b",
        //         "chain": "",
        //         "amount": 7.457467,
        //         "address": "rae93V8d2mdoUQHwBDBdM4NHCMehRJAsbm",
        //         "memo": "100040",
        //         "fee": 0,
        //         "state": "safe",
        //         "created_date": "2020-04-20 11:23:00",
        //         "finished_date": "2020-04-20 13:23:00"
        //     }
        //
        const id = this.safeString2 (transaction, 'id', 'withdraw_id');
        const address = this.safeString (transaction, 'address');
        const tag = this.safeString (transaction, 'memo');
        const txid = this.safeString (transaction, 'hash');
        const currencyId = this.safeStringUpper (transaction, 'currency');
        const code = this.safeCurrencyCode (currencyId, currency);
        const timestamp = this.parse8601 (this.safeString (transaction, 'created_date'));
        const updated = this.parse8601 (this.safeString (transaction, 'finished_date'));
        const status = this.parseTransactionStatus (this.safeString (transaction, 'state'));
        const amount = this.safeNumber (transaction, 'amount');
        const feeCost = this.safeNumber (transaction, 'fee');
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = { 'currency': code, 'cost': feeCost };
        }
        const network = this.safeString (transaction, 'chain');
        return {
            'info': transaction,
            'id': id,
            'txid': txid,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'network': network,
            'address': address,
            'addressTo': address,
            'addressFrom': undefined,
            'tag': tag,
            'tagTo': tag,
            'tagFrom': undefined,
            'type': undefined,
            'amount': amount,
            'currency': code,
            'status': status,
            'updated': updated,
            'internal': undefined,
            'comment': undefined,
            'fee': fee,
        };
    }

    parseTransferStatus (status: Str): Str {
        const statuses: Dict = {
            '0': 'ok',
        };
        return this.safeString (statuses, status, status);
    }

    parseTransfer (transfer: Dict, currency: Currency = undefined): TransferEntry {
        //
        // transfer
        //
        //     {
        //         "code": 0
        //     }
        //
        // fetchTransfers
        //
        //     {
        //         "transfer_id": 130524,
        //         "type": 1,
        //         "currency": "USDT",
        //         "amount": "24",
        //         "timestamp": 1666505659000
        //     }
        //
        let fromAccount = undefined;
        let toAccount = undefined;
        const type = this.safeInteger (transfer, 'type');
        if (type === 1) {
            fromAccount = 'spot';
            toAccount = 'swap';
        } else if (type === 2) {
            fromAccount = 'swap';
            toAccount = 'spot';
        }
        const timestamp = this.safeInteger (transfer, 'timestamp');
        return {
            'info': transfer,
            'id': this.safeString (transfer, 'transfer_id'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'currency': this.safeCurrencyCode (this.safeString (transfer, 'currency'), currency),
            'amount': this.safeNumber (transfer, 'amount'),
            'fromAccount': fromAccount,
            'toAccount': toAccount,
            'status': this.parseTransferStatus (this.safeString (transfer, 'code')),
        };
    }

    async transfer (code: string, amount: number, fromAccount: string, toAccount:string, params = {}): Promise<TransferEntry> {
        /**
         * @method
         * @name digifinex#transfer
         * @description transfer currency internally between wallets on the same account
         * @param {string} code unified currency code
         * @param {float} amount amount to transfer
         * @param {string} fromAccount account to transfer from
         * @param {string} toAccount account to transfer to
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/#/?id=transfer-structure}
         */
        await this.loadMarkets ();
        const currency = this.currency (code);
        const accountsByType = this.safeValue (this.options, 'accountsByType', {});
        const fromId = this.safeString (accountsByType, fromAccount, fromAccount);
        const toId = this.safeString (accountsByType, toAccount, toAccount);
        const request: Dict = {
            'currency_mark': currency['id'],
            'num': this.currencyToPrecision (code, amount),
            'from': fromId, // 1 = SPOT, 2 = MARGIN, 3 = OTC
            'to': toId, // 1 = SPOT, 2 = MARGIN, 3 = OTC
        };
        const response = await this.privateSpotPostTransfer (this.extend (request, params));
        //
        //     {
        //         "code": 0
        //     }
        //
        return this.parseTransfer (response, currency);
    }

    async withdraw (code: string, amount: number, address: string, tag = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#withdraw
         * @description make a withdrawal
         * @param {string} code unified currency code
         * @param {float} amount the amount to withdraw
         * @param {string} address the address to withdraw to
         * @param {string} tag
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
         */
        [ tag, params ] = this.handleWithdrawTagAndParams (tag, params);
        this.checkAddress (address);
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            // 'chain': 'ERC20', 'OMNI', 'TRC20', // required for USDT
            'address': address,
            'amount': this.currencyToPrecision (code, amount),
            'currency': currency['id'],
        };
        if (tag !== undefined) {
            request['memo'] = tag;
        }
        const response = await this.privateSpotPostWithdrawNew (this.extend (request, params));
        //
        //     {
        //         "code": 200,
        //         "withdraw_id": 700
        //     }
        //
        return this.parseTransaction (response, currency);
    }

    async fetchBorrowInterest (code: Str = undefined, symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        const response = await this.privateSpotGetMarginPositions (this.extend (request, params));
        //
        //     {
        //         "margin": "45.71246418952618",
        //         "code": 0,
        //         "margin_rate": "7.141978570340037",
        //         "positions": [
        //             {
        //                 "amount": 0.0006103,
        //                 "side": "go_long",
        //                 "entry_price": 31428.72,
        //                 "liquidation_rate": 0.3,
        //                 "liquidation_price": 10225.335481159,
        //                 "unrealized_roe": -0.0076885829266987,
        //                 "symbol": "BTC_USDT",
        //                 "unrealized_pnl": -0.049158102631999,
        //                 "leverage_ratio": 3
        //             }
        //         ],
        //         "unrealized_pnl": "-0.049158102631998504"
        //     }
        //
        const rows = this.safeValue (response, 'positions');
        const interest = this.parseBorrowInterests (rows, market);
        return this.filterByCurrencySinceLimit (interest, code, since, limit);
    }

    parseBorrowInterest (info: Dict, market: Market = undefined) {
        //
        //     {
        //         "amount": 0.0006103,
        //         "side": "go_long",
        //         "entry_price": 31428.72,
        //         "liquidation_rate": 0.3,
        //         "liquidation_price": 10225.335481159,
        //         "unrealized_roe": -0.0076885829266987,
        //         "symbol": "BTC_USDT",
        //         "unrealized_pnl": -0.049158102631999,
        //         "leverage_ratio": 3
        //     }
        //
        const marketId = this.safeString (info, 'symbol');
        const amountString = this.safeString (info, 'amount');
        const leverageString = this.safeString (info, 'leverage_ratio');
        const amountInvested = Precise.stringDiv (amountString, leverageString);
        const amountBorrowed = Precise.stringSub (amountString, amountInvested);
        const currency = (market === undefined) ? undefined : market['base'];
        const symbol = this.safeSymbol (marketId, market);
        return {
            'account': symbol,
            'symbol': symbol,
            'currency': currency,
            'interest': undefined,
            'interestRate': 0.001, // all interest rates on digifinex are 0.1%
            'amountBorrowed': this.parseNumber (amountBorrowed),
            'timestamp': undefined,
            'datetime': undefined,
            'info': info,
        };
    }

    async fetchCrossBorrowRate (code: string, params = {}): Promise<CrossBorrowRate> {
        /**
         * @method
         * @name digifinex#fetchCrossBorrowRate
         * @description fetch the rate of interest to borrow a currency for margin trading
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#margin-assets
         * @param {string} code unified currency code
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [borrow rate structure]{@link https://github.com/ccxt/ccxt/wiki/Manual#borrow-rate-structure}
         */
        await this.loadMarkets ();
        const request: Dict = {};
        const response = await this.privateSpotGetMarginAssets (this.extend (request, params));
        //
        //     {
        //         "list": [
        //             {
        //                 "valuation_rate": 1,
        //                 "total": 1.92012186174,
        //                 "free": 1.92012186174,
        //                 "currency": "USDT"
        //             },
        //         ],
        //         "total": 45.133305540922,
        //         "code": 0,
        //         "unrealized_pnl": 0,
        //         "free": 45.133305540922,
        //         "equity": 45.133305540922
        //     }
        //
        const data = this.safeValue (response, 'list', []);
        let result = [];
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            if (this.safeString (entry, 'currency') === code) {
                result = entry;
            }
        }
        const currency = this.currency (code);
        return this.parseBorrowRate (result, currency);
    }

    async fetchCrossBorrowRates (params = {}): Promise<CrossBorrowRates> {
        /**
         * @method
         * @name digifinex#fetchCrossBorrowRates
         * @description fetch the borrow interest rates of all currencies
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#margin-assets
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a list of [borrow rate structures]{@link https://docs.ccxt.com/#/?id=borrow-rate-structure}
         */
        await this.loadMarkets ();
        const response = await this.privateSpotGetMarginAssets (params);
        //
        //     {
        //         "list": [
        //             {
        //                 "valuation_rate": 1,
        //                 "total": 1.92012186174,
        //                 "free": 1.92012186174,
        //                 "currency": "USDT"
        //             },
        //         ],
        //         "total": 45.133305540922,
        //         "code": 0,
        //         "unrealized_pnl": 0,
        //         "free": 45.133305540922,
        //         "equity": 45.133305540922
        //     }
        //
        const result = this.safeValue (response, 'list', []);
        return this.parseBorrowRates (result, 'currency');
    }

    parseBorrowRate (info, currency: Currency = undefined) {
        //
        //     {
        //         "valuation_rate": 1,
        //         "total": 1.92012186174,
        //         "free": 1.92012186174,
        //         "currency": "USDT"
        //     }
        //
        const timestamp = this.milliseconds ();
        const currencyId = this.safeString (info, 'currency');
        return {
            'currency': this.safeCurrencyCode (currencyId, currency),
            'rate': 0.001, // all interest rates on digifinex are 0.1%
            'period': 86400000,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'info': info,
        };
    }

    parseBorrowRates (info, codeKey) {
        //
        //     {
        //         "valuation_rate": 1,
        //         "total": 1.92012186174,
        //         "free": 1.92012186174,
        //         "currency": "USDT"
        //     },
        //
        const result: Dict = {};
        for (let i = 0; i < info.length; i++) {
            const item = info[i];
            const currency = this.safeString (item, codeKey);
            const code = this.safeCurrencyCode (currency);
            const borrowRate = this.parseBorrowRate (item);
            result[code] = borrowRate;
        }
        return result as any;
    }

    async fetchFundingRate (symbol: string, params = {}) {
        /**
         * @method
         * @name digifinex#fetchFundingRate
         * @description fetch the current funding rate
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#currentfundingrate
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [funding rate structure]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['swap']) {
            throw new BadSymbol (this.id + ' fetchFundingRate() supports swap contracts only');
        }
        const request: Dict = {
            'instrument_id': market['id'],
        };
        const response = await this.publicSwapGetPublicFundingRate (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "instrument_id": "BTCUSDTPERP",
        //             "funding_rate": "-0.00012",
        //             "funding_time": 1662710400000,
        //             "next_funding_rate": "0.0001049907085171607",
        //             "next_funding_time": 1662739200000
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        return this.parseFundingRate (data, market) as any;
    }

    parseFundingRate (contract, market: Market = undefined) {
        //
        //     {
        //         "instrument_id": "BTCUSDTPERP",
        //         "funding_rate": "-0.00012",
        //         "funding_time": 1662710400000,
        //         "next_funding_rate": "0.0001049907085171607",
        //         "next_funding_time": 1662739200000
        //     }
        //
        const marketId = this.safeString (contract, 'instrument_id');
        const timestamp = this.safeInteger (contract, 'funding_time');
        const nextTimestamp = this.safeInteger (contract, 'next_funding_time');
        return {
            'info': contract,
            'symbol': this.safeSymbol (marketId, market),
            'markPrice': undefined,
            'indexPrice': undefined,
            'interestRate': undefined,
            'estimatedSettlePrice': undefined,
            'timestamp': undefined,
            'datetime': undefined,
            'fundingRate': this.safeNumber (contract, 'funding_rate'),
            'fundingTimestamp': timestamp,
            'fundingDatetime': this.iso8601 (timestamp),
            'nextFundingRate': this.safeString (contract, 'next_funding_rate'),
            'nextFundingTimestamp': nextTimestamp,
            'nextFundingDatetime': this.iso8601 (nextTimestamp),
            'previousFundingRate': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
        };
    }

    async fetchFundingRateHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#fetchFundingRateHistory
         * @description fetches historical funding rate prices
         * @param {string} symbol unified symbol of the market to fetch the funding rate history for
         * @param {int} [since] timestamp in ms of the earliest funding rate to fetch
         * @param {int} [limit] the maximum amount of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure} to fetch
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure}
         */
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchFundingRateHistory() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['swap']) {
            throw new BadSymbol (this.id + ' fetchFundingRateHistory() supports swap contracts only');
        }
        const request: Dict = {
            'instrument_id': market['id'],
        };
        if (since !== undefined) {
            request['start_timestamp'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.publicSwapGetPublicFundingRateHistory (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "instrument_id": "BTCUSDTPERP",
        //             "funding_rates": [
        //                 {
        //                     "rate": "-0.00375",
        //                     "time": 1607673600000
        //                 },
        //                 ...
        //             ]
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        const result = this.safeValue (data, 'funding_rates', []);
        const rates = [];
        for (let i = 0; i < result.length; i++) {
            const entry = result[i];
            const marketId = this.safeString (data, 'instrument_id');
            const symbolInner = this.safeSymbol (marketId);
            const timestamp = this.safeInteger (entry, 'time');
            rates.push ({
                'info': entry,
                'symbol': symbolInner,
                'fundingRate': this.safeNumber (entry, 'rate'),
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
            });
        }
        const sorted = this.sortBy (rates, 'timestamp');
        return this.filterBySymbolSinceLimit (sorted, symbol, since, limit) as FundingRateHistory[];
    }

    async fetchTradingFee (symbol: string, params = {}): Promise<TradingFeeInterface> {
        /**
         * @method
         * @name digifinex#fetchTradingFee
         * @description fetch the trading fees for a market
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#tradingfee
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [fee structure]{@link https://docs.ccxt.com/#/?id=fee-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['swap']) {
            throw new BadRequest (this.id + ' fetchTradingFee() supports swap markets only');
        }
        const request: Dict = {
            'instrument_id': market['id'],
        };
        const response = await this.privateSwapGetAccountTradingFeeRate (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "instrument_id": "BTCUSDTPERP",
        //             "taker_fee_rate": "0.0005",
        //             "maker_fee_rate": "0.0003"
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        return this.parseTradingFee (data, market);
    }

    parseTradingFee (fee: Dict, market: Market = undefined): TradingFeeInterface {
        //
        //     {
        //         "instrument_id": "BTCUSDTPERP",
        //         "taker_fee_rate": "0.0005",
        //         "maker_fee_rate": "0.0003"
        //     }
        //
        const marketId = this.safeString (fee, 'instrument_id');
        const symbol = this.safeSymbol (marketId, market);
        return {
            'info': fee,
            'symbol': symbol,
            'maker': this.safeNumber (fee, 'maker_fee_rate'),
            'taker': this.safeNumber (fee, 'taker_fee_rate'),
            'percentage': undefined,
            'tierBased': undefined,
        };
    }

    async fetchPositions (symbols: Strings = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#fetchPositions
         * @description fetch all open positions
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#margin-positions
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#positions
         * @param {string[]|undefined} symbols list of unified market symbols
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [position structures]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const request: Dict = {};
        let market = undefined;
        let marketType = undefined;
        if (symbols !== undefined) {
            let symbol = undefined;
            if (Array.isArray (symbols)) {
                const symbolsLength = symbols.length;
                if (symbolsLength > 1) {
                    throw new BadRequest (this.id + ' fetchPositions() symbols argument cannot contain more than 1 symbol');
                }
                symbol = symbols[0];
            } else {
                symbol = symbols;
            }
            market = this.market (symbol);
        }
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchPositions', market, params);
        const [ marginMode, query ] = this.handleMarginModeAndParams ('fetchPositions', params);
        if (marginMode !== undefined) {
            marketType = 'margin';
        }
        if (market !== undefined) {
            const marketIdRequest = (marketType === 'swap') ? 'instrument_id' : 'symbol';
            request[marketIdRequest] = market['id'];
        }
        let response = undefined;
        if (marketType === 'spot' || marketType === 'margin') {
            response = await this.privateSpotGetMarginPositions (this.extend (request, query));
        } else if (marketType === 'swap') {
            response = await this.privateSwapGetAccountPositions (this.extend (request, query));
        } else {
            throw new NotSupported (this.id + ' fetchPositions() not support this market type');
        }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "instrument_id": "BTCUSDTPERP",
        //                 "margin_mode": "crossed",
        //                 "avail_position": "1",
        //                 "avg_cost": "18369.3",
        //                 "last": "18404.7",
        //                 "leverage": "20",
        //                 "liquidation_price": "451.12820512820264",
        //                 "maint_margin_ratio": "0.005",
        //                 "margin": "0.918465",
        //                 "position": "1",
        //                 "realized_pnl": "0",
        //                 "unrealized_pnl": "0.03410000000000224",
        //                 "unrealized_pnl_rate": "0.03712716325608732",
        //                 "side": "long",
        //                 "open_outstanding": "0",
        //                 "risk_score": "0.495049504950495",
        //                 "margin_ratio": "0.4029464788983229",
        //                 "timestamp": 1667960497145
        //             },
        //             ...
        //         ]
        //     }
        //
        // margin
        //
        //     {
        //         "margin": "77.71534772983289",
        //         "code": 0,
        //         "margin_rate": "10.284503769497306",
        //         "positions": [
        //             {
        //                 "amount": 0.0010605,
        //                 "side": "go_long",
        //                 "entry_price": 18321.39,
        //                 "liquidation_rate": 0.3,
        //                 "liquidation_price": -52754.371758471,
        //                 "unrealized_roe": -0.002784390267332,
        //                 "symbol": "BTC_USDT",
        //                 "unrealized_pnl": -0.010820048189999,
        //                 "leverage_ratio": 5
        //             },
        //             ...
        //         ],
        //         "unrealized_pnl": "-0.10681600018999979"
        //     }
        //
        const positionRequest = (marketType === 'swap') ? 'data' : 'positions';
        const positions = this.safeValue (response, positionRequest, []);
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            result.push (this.parsePosition (positions[i], market));
        }
        return this.filterByArrayPositions (result, 'symbol', symbols, false);
    }

    async fetchPosition (symbol: string, params = {}) {
        /**
         * @method
         * @name digifinex#fetchPosition
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#margin-positions
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#positions
         * @description fetch data on a single open contract trade position
         * @param {string} symbol unified market symbol of the market the position is held in
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {};
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchPosition', market, params);
        const [ marginMode, query ] = this.handleMarginModeAndParams ('fetchPosition', params);
        if (marginMode !== undefined) {
            marketType = 'margin';
        }
        const marketIdRequest = (marketType === 'swap') ? 'instrument_id' : 'symbol';
        request[marketIdRequest] = market['id'];
        let response = undefined;
        if (marketType === 'spot' || marketType === 'margin') {
            response = await this.privateSpotGetMarginPositions (this.extend (request, query));
        } else if (marketType === 'swap') {
            response = await this.privateSwapGetAccountPositions (this.extend (request, query));
        } else {
            throw new NotSupported (this.id + ' fetchPosition() not support this market type');
        }
        //
        // swap
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "instrument_id": "BTCUSDTPERP",
        //                 "margin_mode": "crossed",
        //                 "avail_position": "1",
        //                 "avg_cost": "18369.3",
        //                 "last": "18388.9",
        //                 "leverage": "20",
        //                 "liquidation_price": "383.38712921065553",
        //                 "maint_margin_ratio": "0.005",
        //                 "margin": "0.918465",
        //                 "position": "1",
        //                 "realized_pnl": "0",
        //                 "unrealized_pnl": "0.021100000000004115",
        //                 "unrealized_pnl_rate": "0.02297311274790451",
        //                 "side": "long",
        //                 "open_outstanding": "0",
        //                 "risk_score": "0.4901960784313725",
        //                 "margin_ratio": "0.40486964045976204",
        //                 "timestamp": 1667960241758
        //             }
        //         ]
        //     }
        //
        // margin
        //
        //     {
        //         "margin": "77.71534772983289",
        //         "code": 0,
        //         "margin_rate": "10.284503769497306",
        //         "positions": [
        //             {
        //                 "amount": 0.0010605,
        //                 "side": "go_long",
        //                 "entry_price": 18321.39,
        //                 "liquidation_rate": 0.3,
        //                 "liquidation_price": -52754.371758471,
        //                 "unrealized_roe": -0.002784390267332,
        //                 "symbol": "BTC_USDT",
        //                 "unrealized_pnl": -0.010820048189999,
        //                 "leverage_ratio": 5
        //             }
        //         ],
        //         "unrealized_pnl": "-0.10681600018999979"
        //     }
        //
        const dataRequest = (marketType === 'swap') ? 'data' : 'positions';
        const data = this.safeValue (response, dataRequest, []);
        const position = this.parsePosition (data[0], market);
        if (marketType === 'swap') {
            return position;
        } else {
            position['collateral'] = this.safeNumber (response, 'margin');
            position['marginRatio'] = this.safeNumber (response, 'margin_rate');
            return position;
        }
    }

    parsePosition (position: Dict, market: Market = undefined) {
        //
        // swap
        //
        //     {
        //         "instrument_id": "BTCUSDTPERP",
        //         "margin_mode": "crossed",
        //         "avail_position": "1",
        //         "avg_cost": "18369.3",
        //         "last": "18388.9",
        //         "leverage": "20",
        //         "liquidation_price": "383.38712921065553",
        //         "maint_margin_ratio": "0.005",
        //         "margin": "0.918465",
        //         "position": "1",
        //         "realized_pnl": "0",
        //         "unrealized_pnl": "0.021100000000004115",
        //         "unrealized_pnl_rate": "0.02297311274790451",
        //         "side": "long",
        //         "open_outstanding": "0",
        //         "risk_score": "0.4901960784313725",
        //         "margin_ratio": "0.40486964045976204",
        //         "timestamp": 1667960241758
        //     }
        //
        // margin
        //
        //     {
        //         "amount": 0.0010605,
        //         "side": "go_long",
        //         "entry_price": 18321.39,
        //         "liquidation_rate": 0.3,
        //         "liquidation_price": -52754.371758471,
        //         "unrealized_roe": -0.002784390267332,
        //         "symbol": "BTC_USDT",
        //         "unrealized_pnl": -0.010820048189999,
        //         "leverage_ratio": 5
        //     }
        //
        const marketId = this.safeString2 (position, 'instrument_id', 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        let marginMode = this.safeString (position, 'margin_mode');
        if (marginMode !== undefined) {
            marginMode = (marginMode === 'crossed') ? 'cross' : 'isolated';
        } else {
            marginMode = 'crossed';
        }
        const timestamp = this.safeInteger (position, 'timestamp');
        let side = this.safeString (position, 'side');
        if (side === 'go_long') {
            side = 'long';
        } else if (side === 'go_short') {
            side = 'short';
        }
        return this.safePosition ({
            'info': position,
            'id': undefined,
            'symbol': symbol,
            'notional': this.safeNumber (position, 'amount'),
            'marginMode': marginMode,
            'liquidationPrice': this.safeNumber (position, 'liquidation_price'),
            'entryPrice': this.safeNumber2 (position, 'avg_cost', 'entry_price'),
            'unrealizedPnl': this.safeNumber (position, 'unrealized_pnl'),
            'contracts': this.safeNumber (position, 'avail_position'),
            'contractSize': this.safeNumber (market, 'contractSize'),
            'markPrice': this.safeNumber (position, 'last'),
            'side': side,
            'hedged': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'maintenanceMargin': this.safeNumber (position, 'margin'),
            'maintenanceMarginPercentage': this.safeNumber (position, 'maint_margin_ratio'),
            'collateral': undefined,
            'initialMargin': undefined,
            'initialMarginPercentage': undefined,
            'leverage': this.safeNumber2 (position, 'leverage', 'leverage_ratio'),
            'marginRatio': this.safeNumber (position, 'margin_ratio'),
            'percentage': undefined,
            'stopLossPrice': undefined,
            'takeProfitPrice': undefined,
        });
    }

    async setLeverage (leverage: Int, symbol: Str = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#setLeverage
         * @description set the level of leverage for a market
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#setleverage
         * @param {float} leverage the rate of leverage
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.marginMode] either 'cross' or 'isolated', default is cross
         * @param {string} [params.side] either 'long' or 'short', required for isolated markets only
         * @returns {object} response from the exchange
         */
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' setLeverage() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (market['type'] !== 'swap') {
            throw new BadSymbol (this.id + ' setLeverage() supports swap contracts only');
        }
        if ((leverage < 1) || (leverage > 100)) {
            throw new BadRequest (this.id + ' leverage should be between 1 and 100');
        }
        const request: Dict = {
            'instrument_id': market['id'],
            'leverage': leverage,
        };
        const defaultMarginMode = this.safeString2 (this.options, 'marginMode', 'defaultMarginMode');
        let marginMode = this.safeStringLower2 (params, 'marginMode', 'defaultMarginMode', defaultMarginMode);
        if (marginMode !== undefined) {
            marginMode = (marginMode === 'cross') ? 'crossed' : 'isolated';
            request['margin_mode'] = marginMode;
            params = this.omit (params, [ 'marginMode', 'defaultMarginMode' ]);
        }
        if (marginMode === 'isolated') {
            const side = this.safeString (params, 'side');
            if (side !== undefined) {
                request['side'] = side;
                params = this.omit (params, 'side');
            } else {
                this.checkRequiredArgument ('setLeverage', side, 'side', [ 'long', 'short' ]);
            }
        }
        return await this.privateSwapPostAccountLeverage (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "instrument_id": "BTCUSDTPERP",
        //             "leverage": 30,
        //             "margin_mode": "crossed",
        //             "side": "both"
        //         }
        //     }
        //
    }

    async fetchTransfers (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<TransferEntries> {
        /**
         * @method
         * @name digifinex#fetchTransfers
         * @description fetch the transfer history, only transfers between spot and swap accounts are supported
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#transferrecord
         * @param {string} code unified currency code of the currency transferred
         * @param {int} [since] the earliest time in ms to fetch transfers for
         * @param {int} [limit] the maximum number of  transfers to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object[]} a list of [transfer structures]{@link https://docs.ccxt.com/#/?id=transfer-structure}
         */
        await this.loadMarkets ();
        let currency = undefined;
        const request: Dict = {};
        if (code !== undefined) {
            currency = this.safeCurrencyCode (code);
            request['currency'] = currency['id'];
        }
        if (since !== undefined) {
            request['start_timestamp'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit; // default 20 max 100
        }
        const response = await this.privateSwapGetAccountTransferRecord (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "transfer_id": 130524,
        //                 "type": 1,
        //                 "currency": "USDT",
        //                 "amount": "24",
        //                 "timestamp": 1666505659000
        //             },
        //             ...
        //         ]
        //     }
        //
        const transfers = this.safeList (response, 'data', []);
        return this.parseTransfers (transfers, currency, since, limit);
    }

    async fetchLeverageTiers (symbols: Strings = undefined, params = {}): Promise<LeverageTiers> {
        /**
         * @method
         * @name digifinex#fetchLeverageTiers
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#instruments
         * @description retrieve information on the maximum leverage, for different trade sizes
         * @param {string[]|undefined} symbols a list of unified market symbols
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a dictionary of [leverage tiers structures]{@link https://docs.ccxt.com/#/?id=leverage-tiers-structure}, indexed by market symbols
         */
        await this.loadMarkets ();
        const response = await this.publicSwapGetPublicInstruments (params);
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "instrument_id": "BTCUSDTPERP",
        //                 "type": "REAL",
        //                 "contract_type": "PERPETUAL",
        //                 "base_currency": "BTC",
        //                 "quote_currency": "USDT",
        //                 "clear_currency": "USDT",
        //                 "contract_value": "0.001",
        //                 "contract_value_currency": "BTC",
        //                 "is_inverse": false,
        //                 "is_trading": true,
        //                 "status": "ONLINE",
        //                 "price_precision": 1,
        //                 "tick_size": "0.1",
        //                 "min_order_amount": 1,
        //                 "open_max_limits": [
        //                     {
        //                         "leverage": "50",
        //                         "max_limit": "1000000"
        //                     },
        //                 ]
        //             },
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        symbols = this.marketSymbols (symbols);
        return this.parseLeverageTiers (data, symbols, 'instrument_id');
    }

    async fetchMarketLeverageTiers (symbol: string, params = {}): Promise<LeverageTier[]> {
        /**
         * @method
         * @name digifinex#fetchMarketLeverageTiers
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#instrument
         * @description retrieve information on the maximum leverage, for different trade sizes for a single market
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a [leverage tiers structure]{@link https://docs.ccxt.com/#/?id=leverage-tiers-structure}
         */
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['swap']) {
            throw new BadRequest (this.id + ' fetchMarketLeverageTiers() supports swap markets only');
        }
        const request: Dict = {
            'instrument_id': market['id'],
        };
        const response = await this.publicSwapGetPublicInstrument (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "instrument_id": "BTCUSDTPERP",
        //             "type": "REAL",
        //             "contract_type": "PERPETUAL",
        //             "base_currency": "BTC",
        //             "quote_currency": "USDT",
        //             "clear_currency": "USDT",
        //             "contract_value": "0.001",
        //             "contract_value_currency": "BTC",
        //             "is_inverse": false,
        //             "is_trading": true,
        //             "status": "ONLINE",
        //             "price_precision": 1,
        //             "tick_size": "0.1",
        //             "min_order_amount": 1,
        //             "open_max_limits": [
        //                 {
        //                     "leverage": "50",
        //                     "max_limit": "1000000"
        //                 }
        //             ]
        //         }
        //     }
        //
        const data = this.safeValue (response, 'data', {});
        return this.parseMarketLeverageTiers (data, market);
    }

    parseMarketLeverageTiers (info, market: Market = undefined): LeverageTier[] {
        //
        //     {
        //         "instrument_id": "BTCUSDTPERP",
        //         "type": "REAL",
        //         "contract_type": "PERPETUAL",
        //         "base_currency": "BTC",
        //         "quote_currency": "USDT",
        //         "clear_currency": "USDT",
        //         "contract_value": "0.001",
        //         "contract_value_currency": "BTC",
        //         "is_inverse": false,
        //         "is_trading": true,
        //         "status": "ONLINE",
        //         "price_precision": 1,
        //         "tick_size": "0.1",
        //         "min_order_amount": 1,
        //         "open_max_limits": [
        //             {
        //                 "leverage": "50",
        //                 "max_limit": "1000000"
        //             }
        //         ]
        //     }
        //
        const tiers = [];
        const brackets = this.safeValue (info, 'open_max_limits', {});
        for (let i = 0; i < brackets.length; i++) {
            const tier = brackets[i];
            const marketId = this.safeString (info, 'instrument_id');
            market = this.safeMarket (marketId);
            tiers.push ({
                'tier': this.sum (i, 1),
                'currency': market['settle'],
                'minNotional': undefined,
                'maxNotional': this.safeNumber (tier, 'max_limit'),
                'maintenanceMarginRate': undefined,
                'maxLeverage': this.safeNumber (tier, 'leverage'),
                'info': tier,
            });
        }
        return tiers;
    }

    handleMarginModeAndParams (methodName, params = {}, defaultValue = undefined) {
        /**
         * @ignore
         * @method
         * @description marginMode specified by params["marginMode"], this.options["marginMode"], this.options["defaultMarginMode"], params["margin"] = true or this.options["defaultType"] = 'margin'
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {Array} the marginMode in lowercase
         */
        const defaultType = this.safeString (this.options, 'defaultType');
        const isMargin = this.safeBool (params, 'margin', false);
        let marginMode = undefined;
        [ marginMode, params ] = super.handleMarginModeAndParams (methodName, params, defaultValue);
        if (marginMode !== undefined) {
            if (marginMode !== 'cross') {
                throw new NotSupported (this.id + ' only cross margin is supported');
            }
        } else {
            if ((defaultType === 'margin') || (isMargin === true)) {
                marginMode = 'cross';
            }
        }
        return [ marginMode, params ];
    }

    async fetchDepositWithdrawFees (codes: Strings = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#fetchDepositWithdrawFees
         * @description fetch deposit and withdraw fees
         * @see https://docs.digifinex.com/en-ww/spot/v3/rest.html#get-currency-deposit-and-withdrawal-information
         * @param {string[]|undefined} codes not used by fetchDepositWithdrawFees ()
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} a list of [fee structures]{@link https://docs.ccxt.com/#/?id=fee-structure}
         */
        await this.loadMarkets ();
        const response = await this.publicSpotGetCurrencies (params);
        //
        //   {
        //       "data": [
        //           {
        //               "deposit_status": 0,
        //               "min_withdraw_fee": 5,
        //               "withdraw_fee_currency": "USDT",
        //               "chain": "OMNI",
        //               "withdraw_fee_rate": 0,
        //               "min_withdraw_amount": 10,
        //               "currency": "USDT",
        //               "withdraw_status": 0,
        //               "min_deposit_amount": 10
        //           },
        //           {
        //               "deposit_status": 1,
        //               "min_withdraw_fee": 5,
        //               "withdraw_fee_currency": "USDT",
        //               "chain": "ERC20",
        //               "withdraw_fee_rate": 0,
        //               "min_withdraw_amount": 10,
        //               "currency": "USDT",
        //               "withdraw_status": 1,
        //               "min_deposit_amount": 10
        //           },
        //       ],
        //       "code": 200,
        //   }
        //
        const data = this.safeList (response, 'data');
        return this.parseDepositWithdrawFees (data, codes);
    }

    parseDepositWithdrawFees (response, codes = undefined, currencyIdKey = undefined) {
        //
        //     [
        //         {
        //             "deposit_status": 0,
        //             "min_withdraw_fee": 5,
        //             "withdraw_fee_currency": "USDT",
        //             "chain": "OMNI",
        //             "withdraw_fee_rate": 0,
        //             "min_withdraw_amount": 10,
        //             "currency": "USDT",
        //             "withdraw_status": 0,
        //             "min_deposit_amount": 10
        //         },
        //         {
        //             "deposit_status": 1,
        //             "min_withdraw_fee": 5,
        //             "withdraw_fee_currency": "USDT",
        //             "chain": "ERC20",
        //             "withdraw_fee_rate": 0,
        //             "min_withdraw_amount": 10,
        //             "currency": "USDT",
        //             "withdraw_status": 1,
        //             "min_deposit_amount": 10
        //         },
        //     ]
        //
        const depositWithdrawFees: Dict = {};
        codes = this.marketCodes (codes);
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const currencyId = this.safeString (entry, 'currency');
            const code = this.safeCurrencyCode (currencyId);
            if ((codes === undefined) || (this.inArray (code, codes))) {
                const depositWithdrawFee = this.safeValue (depositWithdrawFees, code);
                if (depositWithdrawFee === undefined) {
                    depositWithdrawFees[code] = this.depositWithdrawFee ({});
                    depositWithdrawFees[code]['info'] = [];
                }
                depositWithdrawFees[code]['info'].push (entry);
                const networkId = this.safeString (entry, 'chain');
                const withdrawFee = this.safeValue (entry, 'min_withdraw_fee');
                const withdrawResult: Dict = {
                    'fee': withdrawFee,
                    'percentage': (withdrawFee !== undefined) ? false : undefined,
                };
                const depositResult: Dict = {
                    'fee': undefined,
                    'percentage': undefined,
                };
                if (networkId !== undefined) {
                    const networkCode = this.networkIdToCode (networkId);
                    depositWithdrawFees[code]['networks'][networkCode] = {
                        'withdraw': withdrawResult,
                        'deposit': depositResult,
                    };
                } else {
                    depositWithdrawFees[code]['withdraw'] = withdrawResult;
                    depositWithdrawFees[code]['deposit'] = depositResult;
                }
            }
        }
        const depositWithdrawCodes = Object.keys (depositWithdrawFees);
        for (let i = 0; i < depositWithdrawCodes.length; i++) {
            const code = depositWithdrawCodes[i];
            const currency = this.currency (code);
            depositWithdrawFees[code] = this.assignDefaultDepositWithdrawFees (depositWithdrawFees[code], currency);
        }
        return depositWithdrawFees;
    }

    async addMargin (symbol: string, amount: number, params = {}): Promise<MarginModification> {
        /**
         * @method
         * @name digifinex#addMargin
         * @description add margin to a position
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#positionmargin
         * @param {string} symbol unified market symbol
         * @param {float} amount amount of margin to add
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} params.side the position side: 'long' or 'short'
         * @returns {object} a [margin structure]{@link https://docs.ccxt.com/#/?id=margin-structure}
         */
        const side = this.safeString (params, 'side');
        this.checkRequiredArgument ('addMargin', side, 'side', [ 'long', 'short' ]);
        return await this.modifyMarginHelper (symbol, amount, 1, params);
    }

    async reduceMargin (symbol: string, amount: number, params = {}): Promise<MarginModification> {
        /**
         * @method
         * @name digifinex#reduceMargin
         * @description remove margin from a position
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#positionmargin
         * @param {string} symbol unified market symbol
         * @param {float} amount the amount of margin to remove
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} params.side the position side: 'long' or 'short'
         * @returns {object} a [margin structure]{@link https://docs.ccxt.com/#/?id=margin-structure}
         */
        const side = this.safeString (params, 'side');
        this.checkRequiredArgument ('reduceMargin', side, 'side', [ 'long', 'short' ]);
        return await this.modifyMarginHelper (symbol, amount, 2, params);
    }

    async modifyMarginHelper (symbol: string, amount, type, params = {}): Promise<MarginModification> {
        await this.loadMarkets ();
        const side = this.safeString (params, 'side');
        const market = this.market (symbol);
        const request: Dict = {
            'instrument_id': market['id'],
            'amount': this.numberToString (amount),
            'type': type,
            'side': side,
        };
        const response = await this.privateSwapPostAccountPositionMargin (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "data": {
        //             "instrument_id": "BTCUSDTPERP",
        //             "side": "long",
        //             "type": 1,
        //             "amount": "3.6834"
        //         }
        //     }
        //
        const code = this.safeInteger (response, 'code');
        const status = (code === 0) ? 'ok' : 'failed';
        const data = this.safeValue (response, 'data', {});
        return this.extend (this.parseMarginModification (data, market), {
            'status': status,
        });
    }

    parseMarginModification (data: Dict, market: Market = undefined): MarginModification {
        //
        //     {
        //         "instrument_id": "BTCUSDTPERP",
        //         "side": "long",
        //         "type": 1,
        //         "amount": "3.6834"
        //     }
        //
        const marketId = this.safeString (data, 'instrument_id');
        const rawType = this.safeInteger (data, 'type');
        return {
            'info': data,
            'symbol': this.safeSymbol (marketId, market, undefined, 'swap'),
            'type': (rawType === 1) ? 'add' : 'reduce',
            'marginMode': 'isolated',
            'amount': this.safeNumber (data, 'amount'),
            'total': undefined,
            'code': market['settle'],
            'status': undefined,
            'timestamp': undefined,
            'datetime': undefined,
        };
    }

    async fetchFundingHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#fetchFundingHistory
         * @description fetch the history of funding payments paid and received on this account
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#funding-fee
         * @param {string} [symbol] unified market symbol
         * @param {int} [since] the earliest time in ms to fetch funding history for
         * @param {int} [limit] the maximum number of funding history structures to retrieve
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {int} [params.until] timestamp in ms of the latest funding payment
         * @returns {object} a [funding history structure]{@link https://docs.ccxt.com/#/?id=funding-history-structure}
         */
        await this.loadMarkets ();
        let request: Dict = {};
        [ request, params ] = this.handleUntilOption ('end_timestamp', request, params);
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['instrument_id'] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        if (since !== undefined) {
            request['start_timestamp'] = since;
        }
        const response = await this.privateSwapGetAccountFundingFee (this.extend (request, params));
        //
        //     {
        //         "code": 0,
        //         "data": [
        //             {
        //                 "instrument_id": "BTCUSDTPERP",
        //                 "currency": "USDT",
        //                 "amount": "-0.000342814",
        //                 "timestamp": 1698768009440
        //             }
        //         ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseIncomes (data, market, since, limit);
    }

    parseIncome (income, market: Market = undefined) {
        //
        //     {
        //         "instrument_id": "BTCUSDTPERP",
        //         "currency": "USDT",
        //         "amount": "-0.000342814",
        //         "timestamp": 1698768009440
        //     }
        //
        const marketId = this.safeString (income, 'instrument_id');
        const currencyId = this.safeString (income, 'currency');
        const timestamp = this.safeInteger (income, 'timestamp');
        return {
            'info': income,
            'symbol': this.safeSymbol (marketId, market, undefined, 'swap'),
            'code': this.safeCurrencyCode (currencyId),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'id': undefined,
            'amount': this.safeNumber (income, 'amount'),
        };
    }

    async setMarginMode (marginMode: string, symbol: Str = undefined, params = {}) {
        /**
         * @method
         * @name digifinex#setMarginMode
         * @description set margin mode to 'cross' or 'isolated'
         * @see https://docs.digifinex.com/en-ww/swap/v2/rest.html#positionmode
         * @param {string} marginMode 'cross' or 'isolated'
         * @param {string} symbol unified market symbol
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} response from the exchange
         */
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' setMarginMode() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        marginMode = marginMode.toLowerCase ();
        if (marginMode === 'cross') {
            marginMode = 'crossed';
        }
        const request: Dict = {
            'instrument_id': market['id'],
            'margin_mode': marginMode,
        };
        return await this.privateSwapPostAccountPositionMode (this.extend (request, params));
    }

    sign (path, api = [], method = 'GET', params = {}, headers = undefined, body = undefined) {
        const signed = api[0] === 'private';
        const endpoint = api[1];
        const pathPart = (endpoint === 'spot') ? '/v3' : '/swap/v2';
        const request = '/' + this.implodeParams (path, params);
        const payload = pathPart + request;
        let url = this.urls['api']['rest'] + payload;
        const query = this.omit (params, this.extractParams (path));
        let urlencoded = undefined;
        if (signed && (pathPart === '/swap/v2') && (method === 'POST')) {
            urlencoded = JSON.stringify (params);
        } else {
            urlencoded = this.urlencode (this.keysort (query));
        }
        if (signed) {
            let auth = undefined;
            let nonce = undefined;
            if (pathPart === '/swap/v2') {
                nonce = this.milliseconds ().toString ();
                auth = nonce + method + payload;
                if (method === 'GET') {
                    if (urlencoded) {
                        auth += '?' + urlencoded;
                    }
                } else if (method === 'POST') {
                    auth += urlencoded;
                }
            } else {
                nonce = this.nonce ().toString ();
                auth = urlencoded;
            }
            const signature = this.hmac (this.encode (auth), this.encode (this.secret), sha256);
            if (method === 'GET') {
                if (urlencoded) {
                    url += '?' + urlencoded;
                }
            } else if (method === 'POST') {
                headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                };
                if (urlencoded) {
                    body = urlencoded;
                }
            }
            headers = {
                'ACCESS-KEY': this.apiKey,
                'ACCESS-SIGN': signature,
                'ACCESS-TIMESTAMP': nonce,
            };
        } else {
            if (urlencoded) {
                url += '?' + urlencoded;
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (statusCode: int, statusText: string, url: string, method: string, responseHeaders: Dict, responseBody, response, requestHeaders, requestBody) {
        if (!response) {
            return undefined; // fall back to default error handler
        }
        const code = this.safeString (response, 'code');
        if ((code === '0') || (code === '200')) {
            return undefined; // no error
        }
        const feedback = this.id + ' ' + responseBody;
        if (code === undefined) {
            throw new BadResponse (feedback);
        }
        const unknownError = [ ExchangeError, feedback ];
        const [ ExceptionClass, message ] = this.safeValue (this.exceptions['exact'], code, unknownError);
        throw new ExceptionClass (message);
    }
}
