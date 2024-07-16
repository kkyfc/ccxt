from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_open_v1_tickers_market = publicGetOpenV1TickersMarket = Entry('/open/v1/tickers/market', 'public', 'GET', {'cost': 0})
    public_get_open_v1_depth_market = publicGetOpenV1DepthMarket = Entry('/open/v1/depth/market', 'public', 'GET', {'cost': 0})
    public_get_open_v1_trade_market = publicGetOpenV1TradeMarket = Entry('/open/v1/trade/market', 'public', 'GET', {'cost': 0})
    public_get_open_v1_kline_market = publicGetOpenV1KlineMarket = Entry('/open/v1/kline/market', 'public', 'GET', {'cost': 0})
    private_get_open_v1_tickers_exchange_info = privateGetOpenV1TickersExchangeInfo = Entry('/open/v1/tickers/exchange_info', 'private', 'GET', {'cost': 1})
    private_get_open_v1_tickers = privateGetOpenV1Tickers = Entry('/open/v1/tickers', 'private', 'GET', {'cost': 1})
    private_get_open_v1_balance = privateGetOpenV1Balance = Entry('/open/v1/balance', 'private', 'GET', {'cost': 1})
    private_get_open_v1_timestamp = privateGetOpenV1Timestamp = Entry('/open/v1/timestamp', 'private', 'GET', {'cost': 1})
    private_get_open_v1_kline = privateGetOpenV1Kline = Entry('/open/v1/kline', 'private', 'GET', {'cost': 1})
    private_get_open_v1_depth = privateGetOpenV1Depth = Entry('/open/v1/depth', 'private', 'GET', {'cost': 1})
    private_get_open_v1_tickers_trade = privateGetOpenV1TickersTrade = Entry('/open/v1/tickers/trade', 'private', 'GET', {'cost': 1})
    private_get_open_v1_orders_last = privateGetOpenV1OrdersLast = Entry('/open/v1/orders/last', 'private', 'GET', {'cost': 1})
    private_get_open_v1_orders = privateGetOpenV1Orders = Entry('/open/v1/orders', 'private', 'GET', {'cost': 1})
    private_get_open_v1_orders_detail = privateGetOpenV1OrdersDetail = Entry('/open/v1/orders/detail', 'private', 'GET', {'cost': 1})
    private_get_open_v1_orders_detailmore = privateGetOpenV1OrdersDetailmore = Entry('/open/v1/orders/detailmore', 'private', 'GET', {'cost': 1})
    private_get_open_v1_orders_fee_rate = privateGetOpenV1OrdersFeeRate = Entry('/open/v1/orders/fee-rate', 'private', 'GET', {'cost': 1})
    private_post_open_v1_orders_place = privatePostOpenV1OrdersPlace = Entry('/open/v1/orders/place', 'private', 'POST', {'cost': 1})
    private_post_open_v1_orders_cancel = privatePostOpenV1OrdersCancel = Entry('/open/v1/orders/cancel', 'private', 'POST', {'cost': 1})
    private_post_open_v1_orders_batcancel = privatePostOpenV1OrdersBatcancel = Entry('/open/v1/orders/batcancel', 'private', 'POST', {'cost': 1})
