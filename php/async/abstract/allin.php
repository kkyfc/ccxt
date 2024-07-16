<?php

namespace ccxt\async\abstract;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


abstract class allin extends \ccxt\async\Exchange {
    public function public_get_open_v1_tickers_market($params = array()) {
        return $this->request('/open/v1/tickers/market', 'public', 'GET', $params, null, null, array("cost" => 0));
    }
    public function public_get_open_v1_depth_market($params = array()) {
        return $this->request('/open/v1/depth/market', 'public', 'GET', $params, null, null, array("cost" => 0));
    }
    public function public_get_open_v1_trade_market($params = array()) {
        return $this->request('/open/v1/trade/market', 'public', 'GET', $params, null, null, array("cost" => 0));
    }
    public function public_get_open_v1_kline_market($params = array()) {
        return $this->request('/open/v1/kline/market', 'public', 'GET', $params, null, null, array("cost" => 0));
    }
    public function private_get_open_v1_tickers_exchange_info($params = array()) {
        return $this->request('/open/v1/tickers/exchange_info', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_tickers($params = array()) {
        return $this->request('/open/v1/tickers', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_balance($params = array()) {
        return $this->request('/open/v1/balance', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_timestamp($params = array()) {
        return $this->request('/open/v1/timestamp', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_kline($params = array()) {
        return $this->request('/open/v1/kline', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_depth($params = array()) {
        return $this->request('/open/v1/depth', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_tickers_trade($params = array()) {
        return $this->request('/open/v1/tickers/trade', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_orders_last($params = array()) {
        return $this->request('/open/v1/orders/last', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_orders($params = array()) {
        return $this->request('/open/v1/orders', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_orders_detail($params = array()) {
        return $this->request('/open/v1/orders/detail', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_orders_detailmore($params = array()) {
        return $this->request('/open/v1/orders/detailmore', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_get_open_v1_orders_fee_rate($params = array()) {
        return $this->request('/open/v1/orders/fee-rate', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function private_post_open_v1_orders_place($params = array()) {
        return $this->request('/open/v1/orders/place', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_open_v1_orders_cancel($params = array()) {
        return $this->request('/open/v1/orders/cancel', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function private_post_open_v1_orders_batcancel($params = array()) {
        return $this->request('/open/v1/orders/batcancel', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function publicGetOpenV1TickersMarket($params = array()) {
        return $this->request('/open/v1/tickers/market', 'public', 'GET', $params, null, null, array("cost" => 0));
    }
    public function publicGetOpenV1DepthMarket($params = array()) {
        return $this->request('/open/v1/depth/market', 'public', 'GET', $params, null, null, array("cost" => 0));
    }
    public function publicGetOpenV1TradeMarket($params = array()) {
        return $this->request('/open/v1/trade/market', 'public', 'GET', $params, null, null, array("cost" => 0));
    }
    public function publicGetOpenV1KlineMarket($params = array()) {
        return $this->request('/open/v1/kline/market', 'public', 'GET', $params, null, null, array("cost" => 0));
    }
    public function privateGetOpenV1TickersExchangeInfo($params = array()) {
        return $this->request('/open/v1/tickers/exchange_info', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1Tickers($params = array()) {
        return $this->request('/open/v1/tickers', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1Balance($params = array()) {
        return $this->request('/open/v1/balance', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1Timestamp($params = array()) {
        return $this->request('/open/v1/timestamp', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1Kline($params = array()) {
        return $this->request('/open/v1/kline', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1Depth($params = array()) {
        return $this->request('/open/v1/depth', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1TickersTrade($params = array()) {
        return $this->request('/open/v1/tickers/trade', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1OrdersLast($params = array()) {
        return $this->request('/open/v1/orders/last', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1Orders($params = array()) {
        return $this->request('/open/v1/orders', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1OrdersDetail($params = array()) {
        return $this->request('/open/v1/orders/detail', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1OrdersDetailmore($params = array()) {
        return $this->request('/open/v1/orders/detailmore', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privateGetOpenV1OrdersFeeRate($params = array()) {
        return $this->request('/open/v1/orders/fee-rate', 'private', 'GET', $params, null, null, array("cost" => 1));
    }
    public function privatePostOpenV1OrdersPlace($params = array()) {
        return $this->request('/open/v1/orders/place', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostOpenV1OrdersCancel($params = array()) {
        return $this->request('/open/v1/orders/cancel', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
    public function privatePostOpenV1OrdersBatcancel($params = array()) {
        return $this->request('/open/v1/orders/batcancel', 'private', 'POST', $params, null, null, array("cost" => 1));
    }
}
