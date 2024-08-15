import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    spotPublicGetOpenV1TickersMarket(params?: {}): Promise<implicitReturnType>;
    spotPublicGetOpenV1DepthMarket(params?: {}): Promise<implicitReturnType>;
    spotPublicGetOpenV1TradeMarket(params?: {}): Promise<implicitReturnType>;
    spotPublicGetOpenV1KlineMarket(params?: {}): Promise<implicitReturnType>;
    spotPublicGetOpenV1TickersExchangeInfo(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1Tickers(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1Balance(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1Timestamp(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1Kline(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1Depth(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1TickersTrade(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1OrdersLast(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1Orders(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1OrdersDetail(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1OrdersDetailmore(params?: {}): Promise<implicitReturnType>;
    spotPrivateGetOpenV1OrdersFeeRate(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostOpenV1OrdersPlace(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostOpenV1OrdersCancel(params?: {}): Promise<implicitReturnType>;
    spotPrivatePostOpenV1OrdersBatcancel(params?: {}): Promise<implicitReturnType>;
    futurePublicGetOpenApiV2MarketKline(params?: {}): Promise<implicitReturnType>;
    futurePublicGetOpenApiV2MarketList(params?: {}): Promise<implicitReturnType>;
    futurePublicGetOpenApiV2MarketDeals(params?: {}): Promise<implicitReturnType>;
    futurePublicGetOpenApiV2MarketDepth(params?: {}): Promise<implicitReturnType>;
    futurePublicGetOpenApiV2MarketState(params?: {}): Promise<implicitReturnType>;
    futurePublicGetOpenApiV2MarketStateAll(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2OrderDeals(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2OrderFinished(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2OrderDetail(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2OrderPending(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2OrderStopPending(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2OrderStopFinished(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2SettingLeverage(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2AssetQuery(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2AssetHistory(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2PositionPending(params?: {}): Promise<implicitReturnType>;
    futurePrivateGetOpenApiV2PositionMargin(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2PositionMargin(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2OrderMarket(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2OrderCancelAll(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2OrderCancel(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2OrderLimit(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2OrderStop(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2OrderStopCancel(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2OrderStopCancelAll(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2SettingLeverage(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2PositionCloseLimit(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2PositionCloseMarket(params?: {}): Promise<implicitReturnType>;
    futurePrivatePostOpenApiV2PositionCloseStop(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
