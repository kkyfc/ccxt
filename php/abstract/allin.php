<?php

namespace ccxt\abstract;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


abstract class allin extends \ccxt\Exchange {
    public function spotpublic_get_open_v1_tickers_market($params = array()) {
        return $this->request('/open/v1/tickers/market', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotpublic_get_open_v1_depth_market($params = array()) {
        return $this->request('/open/v1/depth/market', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotpublic_get_open_v1_trade_market($params = array()) {
        return $this->request('/open/v1/trade/market', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotpublic_get_open_v1_kline_market($params = array()) {
        return $this->request('/open/v1/kline/market', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotpublic_get_open_v1_tickers_exchange_info($params = array()) {
        return $this->request('/open/v1/tickers/exchange_info', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_tickers($params = array()) {
        return $this->request('/open/v1/tickers', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_balance($params = array()) {
        return $this->request('/open/v1/balance', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_timestamp($params = array()) {
        return $this->request('/open/v1/timestamp', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_kline($params = array()) {
        return $this->request('/open/v1/kline', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_depth($params = array()) {
        return $this->request('/open/v1/depth', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_tickers_trade($params = array()) {
        return $this->request('/open/v1/tickers/trade', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_orders_last($params = array()) {
        return $this->request('/open/v1/orders/last', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_orders($params = array()) {
        return $this->request('/open/v1/orders', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_orders_detail($params = array()) {
        return $this->request('/open/v1/orders/detail', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_orders_detailmore($params = array()) {
        return $this->request('/open/v1/orders/detailmore', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_get_open_v1_orders_fee_rate($params = array()) {
        return $this->request('/open/v1/orders/fee-rate', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_post_open_v1_orders_place($params = array()) {
        return $this->request('/open/v1/orders/place', 'spotPrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_post_open_v1_orders_cancel($params = array()) {
        return $this->request('/open/v1/orders/cancel', 'spotPrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function spotprivate_post_open_v1_orders_batcancel($params = array()) {
        return $this->request('/open/v1/orders/batcancel', 'spotPrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurepublic_get_open_api_v2_market_kline($params = array()) {
        return $this->request('/open/api/v2/market/kline', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurepublic_get_open_api_v2_market_list($params = array()) {
        return $this->request('/open/api/v2/market/list', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurepublic_get_open_api_v2_market_deals($params = array()) {
        return $this->request('/open/api/v2/market/deals', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurepublic_get_open_api_v2_market_depth($params = array()) {
        return $this->request('/open/api/v2/market/depth', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurepublic_get_open_api_v2_market_state($params = array()) {
        return $this->request('/open/api/v2/market/state', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurepublic_get_open_api_v2_market_state_all($params = array()) {
        return $this->request('/open/api/v2/market/state/all', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_order_deals($params = array()) {
        return $this->request('/open/api/v2/order/deals', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_order_finished($params = array()) {
        return $this->request('/open/api/v2/order/finished', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_order_detail($params = array()) {
        return $this->request('/open/api/v2/order/detail', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_order_pending($params = array()) {
        return $this->request('/open/api/v2/order/pending', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_order_stop_pending($params = array()) {
        return $this->request('/open/api/v2/order/stop/pending', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_order_stop_finished($params = array()) {
        return $this->request('/open/api/v2/order/stop/finished', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_setting_leverage($params = array()) {
        return $this->request('/open/api/v2/setting/leverage', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_asset_query($params = array()) {
        return $this->request('/open/api/v2/asset/query', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_asset_history($params = array()) {
        return $this->request('/open/api/v2/asset/history', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_position_pending($params = array()) {
        return $this->request('/open/api/v2/position/pending', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_get_open_api_v2_position_margin($params = array()) {
        return $this->request('/open/api/v2/position/margin', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_position_margin($params = array()) {
        return $this->request('/open/api/v2/position/margin', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_order_market($params = array()) {
        return $this->request('/open/api/v2/order/market', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_order_cancel_all($params = array()) {
        return $this->request('/open/api/v2/order/cancel/all', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_order_cancel($params = array()) {
        return $this->request('/open/api/v2/order/cancel', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_order_limit($params = array()) {
        return $this->request('/open/api/v2/order/limit', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_order_stop($params = array()) {
        return $this->request('/open/api/v2/order/stop', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_order_stop_cancel($params = array()) {
        return $this->request('/open/api/v2/order/stop/cancel', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_order_stop_cancel_all($params = array()) {
        return $this->request('/open/api/v2/order/stop/cancel/all', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_setting_leverage($params = array()) {
        return $this->request('/open/api/v2/setting/leverage', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_position_close_limit($params = array()) {
        return $this->request('/open/api/v2/position/close/limit', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_position_close_market($params = array()) {
        return $this->request('/open/api/v2/position/close/market', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futureprivate_post_open_api_v2_position_close_stop($params = array()) {
        return $this->request('/open/api/v2/position/close/stop', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function spotPublicGetOpenV1TickersMarket($params = array()) {
        return $this->request('/open/v1/tickers/market', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPublicGetOpenV1DepthMarket($params = array()) {
        return $this->request('/open/v1/depth/market', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPublicGetOpenV1TradeMarket($params = array()) {
        return $this->request('/open/v1/trade/market', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPublicGetOpenV1KlineMarket($params = array()) {
        return $this->request('/open/v1/kline/market', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPublicGetOpenV1TickersExchangeInfo($params = array()) {
        return $this->request('/open/v1/tickers/exchange_info', 'spotPublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1Tickers($params = array()) {
        return $this->request('/open/v1/tickers', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1Balance($params = array()) {
        return $this->request('/open/v1/balance', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1Timestamp($params = array()) {
        return $this->request('/open/v1/timestamp', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1Kline($params = array()) {
        return $this->request('/open/v1/kline', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1Depth($params = array()) {
        return $this->request('/open/v1/depth', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1TickersTrade($params = array()) {
        return $this->request('/open/v1/tickers/trade', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1OrdersLast($params = array()) {
        return $this->request('/open/v1/orders/last', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1Orders($params = array()) {
        return $this->request('/open/v1/orders', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1OrdersDetail($params = array()) {
        return $this->request('/open/v1/orders/detail', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1OrdersDetailmore($params = array()) {
        return $this->request('/open/v1/orders/detailmore', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivateGetOpenV1OrdersFeeRate($params = array()) {
        return $this->request('/open/v1/orders/fee-rate', 'spotPrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function spotPrivatePostOpenV1OrdersPlace($params = array()) {
        return $this->request('/open/v1/orders/place', 'spotPrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function spotPrivatePostOpenV1OrdersCancel($params = array()) {
        return $this->request('/open/v1/orders/cancel', 'spotPrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function spotPrivatePostOpenV1OrdersBatcancel($params = array()) {
        return $this->request('/open/v1/orders/batcancel', 'spotPrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePublicGetOpenApiV2MarketKline($params = array()) {
        return $this->request('/open/api/v2/market/kline', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePublicGetOpenApiV2MarketList($params = array()) {
        return $this->request('/open/api/v2/market/list', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePublicGetOpenApiV2MarketDeals($params = array()) {
        return $this->request('/open/api/v2/market/deals', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePublicGetOpenApiV2MarketDepth($params = array()) {
        return $this->request('/open/api/v2/market/depth', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePublicGetOpenApiV2MarketState($params = array()) {
        return $this->request('/open/api/v2/market/state', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePublicGetOpenApiV2MarketStateAll($params = array()) {
        return $this->request('/open/api/v2/market/state/all', 'futurePublic', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2OrderDeals($params = array()) {
        return $this->request('/open/api/v2/order/deals', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2OrderFinished($params = array()) {
        return $this->request('/open/api/v2/order/finished', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2OrderDetail($params = array()) {
        return $this->request('/open/api/v2/order/detail', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2OrderPending($params = array()) {
        return $this->request('/open/api/v2/order/pending', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2OrderStopPending($params = array()) {
        return $this->request('/open/api/v2/order/stop/pending', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2OrderStopFinished($params = array()) {
        return $this->request('/open/api/v2/order/stop/finished', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2SettingLeverage($params = array()) {
        return $this->request('/open/api/v2/setting/leverage', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2AssetQuery($params = array()) {
        return $this->request('/open/api/v2/asset/query', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2AssetHistory($params = array()) {
        return $this->request('/open/api/v2/asset/history', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2PositionPending($params = array()) {
        return $this->request('/open/api/v2/position/pending', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivateGetOpenApiV2PositionMargin($params = array()) {
        return $this->request('/open/api/v2/position/margin', 'futurePrivate', 'GET', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2PositionMargin($params = array()) {
        return $this->request('/open/api/v2/position/margin', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2OrderMarket($params = array()) {
        return $this->request('/open/api/v2/order/market', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2OrderCancelAll($params = array()) {
        return $this->request('/open/api/v2/order/cancel/all', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2OrderCancel($params = array()) {
        return $this->request('/open/api/v2/order/cancel', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2OrderLimit($params = array()) {
        return $this->request('/open/api/v2/order/limit', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2OrderStop($params = array()) {
        return $this->request('/open/api/v2/order/stop', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2OrderStopCancel($params = array()) {
        return $this->request('/open/api/v2/order/stop/cancel', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2OrderStopCancelAll($params = array()) {
        return $this->request('/open/api/v2/order/stop/cancel/all', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2SettingLeverage($params = array()) {
        return $this->request('/open/api/v2/setting/leverage', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2PositionCloseLimit($params = array()) {
        return $this->request('/open/api/v2/position/close/limit', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2PositionCloseMarket($params = array()) {
        return $this->request('/open/api/v2/position/close/market', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
    public function futurePrivatePostOpenApiV2PositionCloseStop($params = array()) {
        return $this->request('/open/api/v2/position/close/stop', 'futurePrivate', 'POST', $params, null, null, array("cost" => 0));
    }
}
