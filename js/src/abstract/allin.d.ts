import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    publicGetOpenV1TickersMarket(params?: {}): Promise<implicitReturnType>;
    publicGetOpenV1DepthMarket(params?: {}): Promise<implicitReturnType>;
    publicGetOpenV1TradeMarket(params?: {}): Promise<implicitReturnType>;
    publicGetOpenV1KlineMarket(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1TickersExchangeInfo(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1Tickers(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1Balance(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1Timestamp(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1Kline(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1Depth(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1TickersTrade(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1OrdersLast(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1Orders(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1OrdersDetail(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1OrdersDetailmore(params?: {}): Promise<implicitReturnType>;
    privateGetOpenV1OrdersFeeRate(params?: {}): Promise<implicitReturnType>;
    privatePostOpenV1OrdersPlace(params?: {}): Promise<implicitReturnType>;
    privatePostOpenV1OrdersCancel(params?: {}): Promise<implicitReturnType>;
    privatePostOpenV1OrdersBatcancel(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
