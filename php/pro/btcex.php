<?php

namespace ccxt\pro;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\ExchangeError;
use ccxt\ArgumentsRequired;
use ccxt\NotSupported;
use React\Async;

class btcex extends \ccxt\async\btcex {

    use ClientTrait;

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'has' => array(
                'ws' => true,
                'watchBalance' => true,
                'watchTicker' => true,
                'watchTickers' => false,
                'watchTrades' => true,
                'watchMyTrades' => true,
                'watchOrders' => true,
                'watchOrderBook' => true,
                'watchOHLCV' => true,
            ),
            'urls' => array(
                'api' => array(
                    'ws' => 'wss://api.btcex.com/ws/api/v1',
                ),
            ),
            'options' => array(
            ),
            'streaming' => array(
                'ping' => array($this, 'ping'),
                'keepAlive' => 5000,
            ),
            'exceptions' => array(
            ),
            'timeframes' => array(
                '1m' => '1',
                '3m' => '3',
                '5m' => '4',
                '10m' => '10',
                '15m' => '15',
                '30m' => '30',
                '1h' => '60',
                '2h' => '120',
                '3h' => '180',
                '4h' => '240',
                '6h' => '360',
                '12h' => '720',
                '1d' => '1D',
            ),
        ));
    }

    public function request_id() {
        $requestId = $this->sum($this->safe_integer($this->options, 'requestId', 0), 1);
        $this->options['requestId'] = $requestId;
        return (string) $requestId;
    }

    public function watch_balance($params = array ()) {
        return Async\async(function () use ($params) {
            /**
             * query for balance and get the amount of funds available for trading or funds locked in orders
             * @see https://docs.btcex.com/#user-asset-asset_type
             * @param {array} $params extra parameters specific to the btcex api endpoint
             * @param {string} $params->type asset $type WALLET, BTC,ETH,MARGIN,SPOT,PERPETUAL
             * @return {array} a ~@link https://docs.ccxt.com/en/latest/manual.html?#balance-structure balance structure~
             */
            $token = Async\await($this->authenticate($params));
            $type = null;
            list($type, $params) = $this->handle_market_type_and_params('watchBalance', null, $params);
            $types = $this->safe_value($this->options, 'accountsByType', array());
            $assetType = $this->safe_string($types, $type, $type);
            $params = $this->omit($params, 'type');
            $messageHash = 'balancess';
            $url = $this->urls['api']['ws'];
            $subscribe = array(
                'jsonrpc' => '2.0',
                'id' => $this->request_id(),
                'method' => '/private/subscribe',
                'params' => array(
                    'access_token' => $token,
                    'channels' => array(
                        'user.asset.' . $assetType,
                    ),
                ),
            );
            $request = $this->deep_extend($subscribe, $params);
            return Async\await($this->watch($url, $messageHash, $request, $messageHash, $request));
        }) ();
    }

    public function handle_balance($client, $message) {
        //
        //     {
        //         "jsonrpc" => "2.0",
        //         "method" => "subscription",
        //         "params" => {
        //             "channel" => "user.asset.WALLET",
        //             "data" => {
        //                 "WALLET" => {
        //                     "total" => "5578184962",
        //                     "coupon" => "0",
        //                     "details" => array(
        //                         array(
        //                             "available" => "4999",
        //                             "freeze" => "0",
        //                             "coin_type" => "BTC",
        //                             "current_mark_price" => "38000"
        //                         ),
        //                         ...
        //                     )
        //                 }
        //             }
        //         }
        //     }
        //
        $params = $this->safe_value($message, 'params', array());
        $data = $this->safe_value($params, 'data', array());
        $messageHash = 'balancess';
        $this->balance = $this->parse_balance($data);
        $client->resolve ($this->balance, $messageHash);
    }

    public function watch_ohlcv($symbol, $timeframe = '1m', $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $timeframe, $since, $limit, $params) {
            /**
             * watches historical candlestick data containing the open, high, low, and close price, and the volume of a $market->
             * @see https://docs.btcex.com/#chart-trades-instrument_name-resolution
             * @param {string} $symbol unified $symbol of the $market to fetch OHLCV data for
             * @param {string} $timeframe the length of time each candle represents.
             * @param {int|null} $since timestamp in ms of the earliest candle to fetch
             * @param {int|null} $limit the maximum amount of candles to fetch
             * @param {array} $params extra parameters specific to the bitfinex2 api endpoint
             * @return {[[int]]} A list of candles ordered as timestamp, open, high, low, close, volume
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $instrumentName = $market['id'];
            if ($market['spot']) {
                $instrumentName = $market['baseId'] . '-' . $market['quoteId'];
            }
            $interval = $this->safe_string($this->timeframes, $timeframe, $timeframe);
            $messageHash = 'ohlcv:' . $symbol . ':' . $interval;
            $request = array(
                'jsonrpc' => '2.0',
                'id' => $this->request_id(),
                'method' => '/public/subscribe',
                'params' => array(
                    'channels' => array(
                        'chart.trades.' . $instrumentName . '.' . $interval,
                    ),
                ),
            );
            $request = $this->deep_extend($request, $params);
            $url = $this->urls['api']['ws'];
            $ohlcv = Async\await($this->watch($url, $messageHash, $request, $messageHash, $request));
            if ($this->newUpdates) {
                $limit = $ohlcv->getLimit ($symbol, $limit);
            }
            return $this->filter_by_since_limit($ohlcv, $since, $limit, 0, true);
        }) ();
    }

    public function handle_ohlcv($client, $message) {
        //
        //     {
        //         "params" => array(
        //             "data" => array(
        //                 "tick" => "1660095420",
        //                 "open" => "22890.30000000",
        //                 "high" => "22890.50000000",
        //                 "low" => "22886.50000000",
        //                 "close" => "22886.50000000",
        //                 "volume" => "314.46800000",
        //                 "cost" => "7197974.01690000"
        //             ),
        //             "channel" => "chart.trades.BTC-USDT-PERPETUAL.1"
        //         ),
        //         "method" => "subscription",
        //         "jsonrpc" => "2.0"
        //     }
        //
        $params = $this->safe_value($message, 'params');
        $channel = $this->safe_string($params, 'channel');
        $symbolInterval = mb_substr($channel, 13);
        $dotIndex = mb_strpos($symbolInterval, '.');
        $marketId = mb_substr($symbolInterval, 0, $dotIndex - 0);
        $timeframeId = mb_substr($symbolInterval, $dotIndex + 1);
        $timeframe = $this->find_timeframe($timeframeId);
        $symbol = $this->safe_symbol($marketId, null, '-');
        $messageHash = 'ohlcv:' . $symbol . ':' . $timeframeId;
        $data = $this->safe_value($params, 'data', array());
        $ohlcv = $this->parse_ohlcv($data);
        $this->ohlcvs[$symbol] = $this->safe_value($this->ohlcvs, $symbol, array());
        $stored = $this->safe_value($this->ohlcvs[$symbol], $timeframe);
        if ($stored === null) {
            $limit = $this->safe_integer($this->options, 'OHLCVLimit', 1000);
            $stored = new ArrayCacheByTimestamp ($limit);
            $this->ohlcvs[$symbol][$timeframe] = $stored;
        }
        $stored->append ($ohlcv);
        $client->resolve ($stored, $messageHash);
    }

    public function watch_ticker($symbol, $params = array ()) {
        return Async\async(function () use ($symbol, $params) {
            /**
             * watches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific $market
             * @see https://docs.btcex.com/#ticker-instrument_name-interval
             * @param {string} $symbol unified $symbol of the $market to fetch the ticker for
             * @param {array} $params extra parameters specific to the btcex api endpoint
             * @return {array} a {@link https://docs.ccxt.com/en/latest/manual.html#ticker-structure ticker structure}
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $instrumentName = $market['id'];
            if ($market['spot']) {
                $instrumentName = $market['baseId'] . '-' . $market['quoteId'];
            }
            $url = $this->urls['api']['ws'];
            $messageHash = 'ticker:' . $symbol;
            $request = array(
                'jsonrpc' => '2.0',
                'id' => $this->request_id(),
                'method' => '/public/subscribe',
                'params' => array(
                    'channels' => array(
                        'ticker.' . $instrumentName . '.raw',
                    ),
                ),
            );
            $request = $this->deep_extend($request, $params);
            return Async\await($this->watch($url, $messageHash, $request, $messageHash));
        }) ();
    }

    public function handle_ticker($client, $message) {
        //
        //     {
        //         "params" => array(
        //             "data" => array(
        //                 "timestamp" => "1660094543813",
        //                 "stats" => array(
        //                     "volume" => "630219.70300000000008822",
        //                     "price_change" => "-0.0378",
        //                     "low" => "22659.50000000",
        //                     "turnover" => "14648416962.26930706016719341",
        //                     "high" => "23919.00000000"
        //                 ),
        //                 "state" => "open",
        //                 "last_price" => "22890.00000000",
        //                 "instrument_name" => "BTC-USDT-PERPETUAL",
        //                 "best_bid_price" => "22888.60000000",
        //                 "best_bid_amount" => "33.38500000",
        //                 "best_ask_price" => "22889.40000000",
        //                 "best_ask_amount" => "5.45200000",
        //                 "mark_price" => "22890.5",
        //                 "underlying_price" => "22891",
        //                 "open_interest" => "33886.083"
        //             ),
        //             "channel" => "ticker.BTC-USDT-PERPETUAL.raw"
        //         ),
        //         "method" => "subscription",
        //         "jsonrpc" => "2.0"
        //     }
        //
        $params = $this->safe_value($message, 'params');
        $data = $this->safe_value($params, 'data');
        $ticker = $this->parse_ticker($data);
        $symbol = $this->safe_string($ticker, 'symbol');
        $messageHash = 'ticker:' . $symbol;
        $this->tickers[$symbol] = $ticker;
        $client->resolve ($ticker, $messageHash);
    }

    public function watch_trades($symbol, $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * get the list of most recent $trades for a particular $symbol
             * @see https://docs.btcex.com/#$trades-instrument_name-interval
             * @param {string} $symbol unified $symbol of the $market to fetch $trades for
             * @param {int|null} $since timestamp in ms of the earliest trade to fetch
             * @param {int|null} $limit the maximum amount of    $trades to fetch
             * @param {array} $params extra parameters specific to the btcex api endpoint
             * @return {[array]} a list of ~@link https://docs.ccxt.com/en/latest/manual.html?#public-$trades trade structures~
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $url = $this->urls['api']['ws'];
            $messageHash = 'trades:' . $symbol;
            $request = array(
                'jsonrpc' => '2.0',
                'id' => $this->request_id(),
                'method' => '/public/subscribe',
                'params' => array(
                    'channels' => [
                        'trades.' . $market['id'] . '.raw',
                    ],
                ),
            );
            $request = $this->deep_extend($request, $params);
            $trades = Async\await($this->watch($url, $messageHash, $request, $messageHash, $request));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($symbol, $limit);
            }
            return $this->filter_by_since_limit($trades, $since, $limit, 'timestamp', true);
        }) ();
    }

    public function handle_trades($client, $message) {
        //
        //     {
        //         "jsonrpc" => "2.0",
        //         "method" => "subscription",
        //         "params" => {
        //             "channel" => "trades.BTC-USDT-PERPETUAL.raw",
        //             "data" => [array(
        //                 "timestamp" => "1660093462553",
        //                 "price" => "22815.9",
        //                 "amount" => "4.479",
        //                 "iv" => "0",
        //                 "direction" => "sell",
        //                 "instrument_name" => "BTC-USDT-PERPETUAL",
        //                 "trade_id" => "227976617",
        //                 "mark_price" => "22812.7"
        //             )]
        //         }
        //     }
        //
        $params = $this->safe_value($message, 'params', array());
        $fullChannel = $this->safe_string($params, 'channel');
        $parts = explode('.', $fullChannel);
        $marketId = $parts[1];
        $symbol = $this->safe_symbol($marketId);
        $messageHash = 'trades:' . $symbol;
        $stored = $this->safe_value($this->trades, $symbol);
        if ($stored === null) {
            $limit = $this->safe_integer($this->options, 'tradesLimit', 1000);
            $stored = new ArrayCache ($limit);
            $this->trades[$symbol] = $stored;
        }
        $rawTrades = $this->safe_value($params, 'data', array());
        for ($i = 0; $i < count($rawTrades); $i++) {
            $rawTrade = $rawTrades[$i];
            $trade = $this->parse_trade($rawTrade, null);
            $stored->append ($trade);
        }
        $this->trades[$symbol] = $stored;
        $client->resolve ($stored, $messageHash);
    }

    public function watch_my_trades($symbol = null, $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * watch all $trades made by the user
             * @see https://docs.btcex.com/#user-$trades-instrument_name-interval
             * @param {string} $symbol unified $market $symbol
             * @param {int|null} $since the earliest time in ms to fetch $trades for
             * @param {int|null} $limit the maximum number of $trades structures to retrieve
             * @param {array} $params extra parameters specific to the bibox api endpoint
             * @return {[array]} a list of {@link https://docs.ccxt.com/en/latest/manual.html#trade-structure trade structures}
             */
            if ($symbol === null) {
                throw new ArgumentsRequired($this->id . ' watchMyTrades() requires a $symbol argument');
            }
            Async\await($this->load_markets());
            $token = Async\await($this->authenticate());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $url = $this->urls['api']['ws'];
            $messageHash = 'myTrades:' . $symbol;
            $request = array(
                'jsonrpc' => '2.0',
                'id' => $this->request_id(),
                'method' => '/private/subscribe',
                'params' => array(
                    'access_token' => $token,
                    'channels' => [
                        'user.trades.' . $market['id'] . '.raw',
                    ],
                ),
            );
            $trades = Async\await($this->watch($url, $messageHash, $request, $messageHash));
            if ($this->newUpdates) {
                $limit = $trades->getLimit ($symbol, $limit);
            }
            return $this->filter_by_symbol_since_limit($trades, $symbol, $since, $limit, true);
        }) ();
    }

    public function handle_my_trades($client, $message) {
        //
        //     {
        //         "jsonrpc" => "2.0",
        //         "method" => "subscription",
        //         "params" => {
        //             "channel" => "user.trades.BTC-14AUG20.raw",
        //             "data" => [array(
        //                 "direction" => "sell",
        //                 "amount" => "1",
        //                 "price" => "33000",
        //                 "iv" => "0",
        //                 "fee" => "0",
        //                 "timestamp" => 1626148488157,
        //                 "trade_id" => "1",
        //                 "order_id" => "160717710099746816",
        //                 "instrument_name" => "BTC-24SEP21",
        //                 "order_type" => "limit",
        //                 "fee_coin_type" => "USDT",
        //                 "index_price" => "33157.63"
        //             )]
        //         }
        //     }
        //
        $params = $this->safe_value($message, 'params', array());
        $channel = $this->safe_string($params, 'channel', '');
        $endIndex = mb_strpos($channel, '.raw');
        $marketId = mb_substr($channel, 12, $endIndex - 12);
        $symbol = $this->safe_symbol($marketId, null, '-');
        $rawTrades = $this->safe_value($params, 'data', array());
        $stored = $this->myTrades;
        if ($stored === null) {
            $limit = $this->safe_integer($this->options, 'tradesLimit', 1000);
            $stored = new ArrayCacheBySymbolById ($limit);
        }
        for ($i = 0; $i < count($rawTrades); $i++) {
            $rawTrade = $rawTrades[$i];
            $trade = $this->parse_trade($rawTrade);
            $stored->append ($trade);
        }
        $this->myTrades = $stored;
        $messageHash = 'myTrades:' . $symbol;
        $client->resolve ($stored, $messageHash);
    }

    public function watch_orders($symbol = null, $since = null, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $since, $limit, $params) {
            /**
             * watches information on multiple $orders made by the user
             * @see https://docs.btcex.com/#user-changes-kind-currency-interval
             * @param {string} $symbol unified $market $symbol of the $market $orders were made in
             * @param {int|null} $since the earliest time in ms to fetch $orders for
             * @param {int|null} $limit the maximum number of  orde structures to retrieve
             * @param {array} $params extra parameters specific to the btcex api endpoint
             * @return {[array]} a list of {@link https://docs.ccxt.com/en/latest/manual.html#order-structure order structures}
             */
            if ($symbol === null) {
                throw new ArgumentsRequired($this->id . 'watchesOrders() requires a symbol');
            }
            Async\await($this->load_markets());
            $token = Async\await($this->authenticate());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $url = $this->urls['api']['ws'];
            $message = array(
                'jsonrpc' => '2.0',
                'id' => $this->request_id(),
                'method' => '/private/subscribe',
                'params' => array(
                    'access_token' => $token,
                    'channels' => [
                        'user.orders.' . $market['id'] . '.raw',
                    ],
                ),
            );
            $messageHash = 'orders:' . $symbol;
            $request = $this->deep_extend($message, $params);
            $orders = Async\await($this->watch($url, $messageHash, $request, $messageHash));
            if ($this->newUpdates) {
                $limit = $orders->getLimit ($symbol, $limit);
            }
            return $this->filter_by_symbol_since_limit($orders, $symbol, $since, $limit, true);
        }) ();
    }

    public function handle_order($client, $message) {
        //
        //     {
        //         "jsonrpc" => "2.0",
        //         "method" => "subscription",
        //         "params" => {
        //             "channel" => "user.orders.BTC-14AUG20.raw",
        //             "data" => {
        //                 "amount" => "1",
        //                 "price" => "11895.00",
        //                 "direction" => "buy",
        //                 "version" => 0,
        //                 "order_state" => "filled",
        //                 "instrument_name" => "BTC-14AUG20",
        //                 "time_in_force" => "good_til_cancelled",
        //                 "last_update_timestamp" => 1597130534567,
        //                 "filled_amount" => "1",
        //                 "average_price" => "11770.00",
        //                 "order_id" => "39007591615041536",
        //                 "creation_timestamp" => 1597130534567,
        //                 "order_type" => "limit"
        //             }
        //     }
        //
        $params = $this->safe_value($message, 'params', array());
        $rawOrder = $this->safe_value($params, 'data', array());
        $cachedOrders = $this->orders;
        if ($cachedOrders === null) {
            $limit = $this->safe_integer($this->options, 'ordersLimit', 1000);
            $cachedOrders = new ArrayCacheBySymbolById ($limit);
        }
        $order = $this->parse_order($rawOrder);
        $symbol = $this->safe_string($order, 'symbol');
        $messageHash = 'orders:' . $symbol;
        $cachedOrders->append ($order);
        $this->orders = $cachedOrders;
        $client->resolve ($this->orders, $messageHash);
    }

    public function watch_order_book($symbol, $limit = null, $params = array ()) {
        return Async\async(function () use ($symbol, $limit, $params) {
            /**
             * watches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
             * @see https://docs.btcex.com/#book-instrument_name-interval
             * @param {string} $symbol unified $symbol of the $market to fetch the order book for
             * @param {int|null} $limit the maximum amount of order book entries to return
             * @param {arrayConstructor} $params extra parameters specific to the btcex api endpoint
             * @param {string|null} $params->type accepts l2 or l3 for level 2 or level 3 order book
             * @return {array} A dictionary of {@link https://docs.ccxt.com/en/latest/manual.html#order-book-structure order book structures} indexed by $market symbols
             */
            Async\await($this->load_markets());
            $market = $this->market($symbol);
            $symbol = $market['symbol'];
            $instrumentName = $market['id'];
            if ($market['spot']) {
                $instrumentName = $market['baseId'] . '-' . $market['quoteId'];
            }
            $url = $this->urls['api']['ws'];
            $params = $this->omit($params, 'type');
            $messageHash = 'orderbook:' . $symbol;
            $subscribe = array(
                'jsonrpc' => '2.0',
                'id' => $this->request_id(),
                'method' => '/public/subscribe',
                'params' => array(
                    'channels' => array(
                        'book.' . $instrumentName . '.raw',
                    ),
                ),
            );
            $request = $this->deep_extend($subscribe, $params);
            $orderbook = Async\await($this->watch($url, $messageHash, $request, $messageHash));
            return $orderbook->limit ();
        }) ();
    }

    public function handle_order_book($client, $message) {
        //
        //     {
        //         "params" => array(
        //             "data" => array(
        //                 "timestamp" => 1626056933600,
        //                 "change_id" => 1566764,
        //                 "asks" => array(
        //                     array(
        //                         "new",
        //                         "34227.122",
        //                         "0.00554"
        //                     ),
        //                     ...
        //                 ),
        //                 "bids" => array(
        //                     array(
        //                         "delete",
        //                         "34105.540",
        //                         "0"
        //                     ),
        //                     ...
        //                 ),
        //                 "instrument_name" => "BTC-USDT"
        //             ),
        //             "channel" => "book.BTC-USDT.raw"
        //         ),
        //         "method" => "subscription",
        //         "jsonrpc" => "2.0"
        //     }
        // `
        $params = $this->safe_value($message, 'params');
        $data = $this->safe_value($params, 'data');
        $marketId = $this->safe_string($data, 'instrument_name');
        $symbol = $this->safe_symbol($marketId, null, '-');
        $storedOrderBook = $this->safe_value($this->orderbooks, $symbol);
        $nonce = $this->safe_integer($storedOrderBook, 'nonce');
        $deltaNonce = $this->safe_integer($data, 'change_id');
        $messageHash = 'orderbook:' . $symbol;
        if ($nonce === null) {
            $cacheLength = count($storedOrderBook->cache);
            if ($cacheLength === 0) {
                $limit = 0;
                $this->spawn(array($this, 'load_order_book'), $client, $messageHash, $symbol, $limit);
            }
            $storedOrderBook->cache[] = $data;
            return;
        } elseif ($deltaNonce <= $nonce) {
            return;
        }
        $timestamp = $this->safe_integer($data, 'timestamp');
        $this->handle_delta($storedOrderBook, $data);
        $storedOrderBook['timestamp'] = $timestamp;
        $storedOrderBook['datetime'] = $this->iso8601($timestamp);
        $storedOrderBook['nonce'] = $deltaNonce;
        $client->resolve ($storedOrderBook, $messageHash);
    }

    public function get_cache_index($orderBook, $cache) {
        $firstElement = $cache[0];
        $lastChangeId = $this->safe_integer($firstElement, 'change_id');
        $nonce = $this->safe_integer($orderBook, 'nonce');
        if ($nonce < $lastChangeId - 1) {
            return -1;
        }
        for ($i = 0; $i < count($cache); $i++) {
            $delta = $cache[$i];
            $lastChangeId = $this->safe_integer($delta, 'change_id');
            if ($nonce === $lastChangeId - 1) {
                // $nonce is inside the $cache
                // array( d, d, n, d )
                return $i;
            }
        }
        return count($cache);
    }

    public function handle_delta($orderbook, $delta) {
        $bids = $this->safe_value($delta, 'bids', array());
        $asks = $this->safe_value($delta, 'asks', array());
        $storedBids = $orderbook['bids'];
        $storedAsks = $orderbook['asks'];
        $this->handle_bid_asks($storedBids, $bids);
        $this->handle_bid_asks($storedAsks, $asks);
    }

    public function handle_bid_asks($bookSide, $bidAsks) {
        for ($i = 0; $i < count($bidAsks); $i++) {
            $bidAsk = $this->parse_bid_ask($bidAsks[$i], 1, 2);
            $bookSide->storeArray ($bidAsk);
        }
    }

    public function handle_user($client, $message) {
        $params = $this->safe_value($message, 'params');
        $fullChannel = $this->safe_string($params, 'channel');
        $sliceUser = mb_substr($fullChannel, 5);
        $endIndex = mb_strpos($sliceUser, '.');
        $userChannel = mb_substr($sliceUser, 0, $endIndex - 0);
        $handlers = array(
            'asset' => array($this, 'handle_balance'),
            'orders' => array($this, 'handle_order'),
            'trades' => array($this, 'handle_my_trades'),
        );
        $handler = $this->safe_value($handlers, $userChannel);
        if ($handler !== null) {
            return $handler($client, $message);
        }
        throw new NotSupported($this->id . ' received an unsupported $message => ' . $this->json($message));
    }

    public function handle_error_message($client, $message) {
        //
        //     {
        //         id => '1',
        //         jsonrpc => '2.0',
        //         usIn => 1660140064049,
        //         usOut => 1660140064051,
        //         usDiff => 2,
        //         $error => array( code => 10000, $message => 'Authentication Failure' )
        //     }
        //
        $error = $this->safe_value($message, 'error', array());
        throw new ExchangeError($this->id . ' $error => ' . $this->json($error));
    }

    public function handle_authenticate($client, $message) {
        //
        //     {
        //         id => '1',
        //         jsonrpc => '2.0',
        //         usIn => 1660140846671,
        //         usOut => 1660140846688,
        //         usDiff => 17,
        //         $result => {
        //           access_token => 'xxxxxx43jIXYrF3VSm90ar+f5n447M3ll82AiFO58L85pxb/DbVf6Bn4ZyBX1i1tM/KYFBJ234ZkrUkwImUIEu8vY1PBh5JqaaaaaeGnao=',
        //           token_type => 'bearer',
        //           refresh_token => '/I56sUOB/zwpwo8X8Q0Z234bW8Lz1YNlXOXSP6C+ZJDWR+49CjVPr0Z3PVXoL3BOB234WxXtTid+YmNjQ8OqGn1MM9pQL5TKZ97s49SvaRc=',
        //           expires_in => 604014,
        //           scope => 'account:read_write block_trade:read_write trade:read_write wallet:read_write',
        //           m => '00000000006e446c6b44694759735570786e5668387335431274546e633867474d647772717a463924a6d3746756951334b637459653970576d63693143e6e335972584e48594c74674c4d416872564a4d56424c347438737938736f4645747263315374454e73324e546d346e5651792b69696279336647347737413d3d'
        //         }
        //     }
        //
        $result = $this->safe_value($message, 'result', array());
        $expiresIn = $this->safe_number($result, 'expires_in', 0);
        $expiresAt = ($this->seconds() . $expiresIn) * 1000;
        $this->options['expiresAt'] = $expiresAt;
        $future = $client->future ('authenticated');
        $future->resolve ($message);
        return $message;
    }

    public function handle_subscription($client, $message) {
        $channels = $this->safe_value($message, 'result', array());
        for ($i = 0; $i < count($channels); $i++) {
            $fullChannel = $channels[$i];
            $parts = explode('.', $fullChannel);
            $channel = $this->safe_string($parts, 0);
            $marketId = $this->safe_string($parts, 1);
            if ($channel === 'book') {
                $symbol = $this->safe_symbol($marketId, null, '-');
                $this->orderbooks[$symbol] = $this->order_book(array());
                // get full depth book
            }
        }
    }

    public function handle_pong($client, $message) {
        $client->lastPong = $this->milliseconds();
    }

    public function handle_message($client, $message) {
        if ($message === 'PONG') {
            $this->handle_pong($client, $message);
            return;
        }
        $error = $this->safe_value($message, 'error');
        if ($error !== null) {
            return $this->handle_error_message($client, $message);
        }
        $result = $this->safe_value($message, 'result', array());
        $accessToken = $this->safe_string($result, 'access_token');
        if ($accessToken !== null) {
            return $this->handle_authenticate($client, $message);
        }
        $method = $this->safe_string($message, 'method');
        if ($method === 'subscription') {
            $params = $this->safe_value($message, 'params');
            $fullChannel = $this->safe_string($params, 'channel');
            $parts = explode('.', $fullChannel);
            $channel = $this->safe_string($parts, 0);
            $handlers = array(
                'ticker' => array($this, 'handle_ticker'),
                'trades' => array($this, 'handle_trades'),
                'chart' => array($this, 'handle_ohlcv'),
                'balances' => array($this, 'handle_balance'),
                'trading' => array($this, 'handle_order'),
                'user' => array($this, 'handle_user'),
                'book' => array($this, 'handle_order_book'),
            );
            $handler = $this->safe_value($handlers, $channel);
            if ($handler !== null) {
                return $handler($client, $message);
            }
        } elseif (is_array($message) && array_key_exists('result', $message)) {
            $this->handle_subscription($client, $message);
        }
        return $message;
    }

    public function authenticate($params = array ()) {
        return Async\async(function () use ($params) {
            $url = $this->urls['api']['ws'];
            $client = $this->client($url);
            $future = $client->future ('authenticated');
            $method = 'authenticated';
            $authenticated = $this->safe_value($client->subscriptions, $method);
            $expiresAt = $this->safe_number($this->options, 'expiresAt');
            $time = $this->milliseconds();
            if ($authenticated === null || $expiresAt <= $time) {
                $request = array(
                    'jsonrpc' => '2.0',
                    'id' => $this->request_id(),
                    'method' => '/public/auth',
                    'params' => array(
                        'grant_type' => 'client_credentials',
                        'client_id' => $this->apiKey,
                        'client_secret' => $this->secret,
                    ),
                );
                $this->spawn(array($this, 'watch'), $url, $method, $request, $method);
            }
            return Async\await($future);
        }) ();
    }

    public function ping($client) {
        return 'PING';
    }
}
