// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

namespace ccxt;

public partial class allin : Exchange
{
    public allin (object args = null): base(args) {}

    public async Task<object> spotPublicGetOpenV1TickersMarket (object parameters = null)
    {
        return await this.callAsync ("spotPublicGetOpenV1TickersMarket",parameters);
    }

    public async Task<object> spotPublicGetOpenV1DepthMarket (object parameters = null)
    {
        return await this.callAsync ("spotPublicGetOpenV1DepthMarket",parameters);
    }

    public async Task<object> spotPublicGetOpenV1TradeMarket (object parameters = null)
    {
        return await this.callAsync ("spotPublicGetOpenV1TradeMarket",parameters);
    }

    public async Task<object> spotPublicGetOpenV1KlineMarket (object parameters = null)
    {
        return await this.callAsync ("spotPublicGetOpenV1KlineMarket",parameters);
    }

    public async Task<object> spotPublicGetOpenV1TickersExchangeInfo (object parameters = null)
    {
        return await this.callAsync ("spotPublicGetOpenV1TickersExchangeInfo",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1Tickers (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1Tickers",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1Balance (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1Balance",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1Timestamp (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1Timestamp",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1Kline (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1Kline",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1Depth (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1Depth",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1TickersTrade (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1TickersTrade",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1OrdersLast (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1OrdersLast",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1Orders (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1Orders",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1OrdersDetail (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1OrdersDetail",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1OrdersDetailmore (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1OrdersDetailmore",parameters);
    }

    public async Task<object> spotPrivateGetOpenV1OrdersFeeRate (object parameters = null)
    {
        return await this.callAsync ("spotPrivateGetOpenV1OrdersFeeRate",parameters);
    }

    public async Task<object> spotPrivatePostOpenV1OrdersPlace (object parameters = null)
    {
        return await this.callAsync ("spotPrivatePostOpenV1OrdersPlace",parameters);
    }

    public async Task<object> spotPrivatePostOpenV1OrdersCancel (object parameters = null)
    {
        return await this.callAsync ("spotPrivatePostOpenV1OrdersCancel",parameters);
    }

    public async Task<object> spotPrivatePostOpenV1OrdersBatcancel (object parameters = null)
    {
        return await this.callAsync ("spotPrivatePostOpenV1OrdersBatcancel",parameters);
    }

    public async Task<object> futurePublicGetOpenApiV2MarketKline (object parameters = null)
    {
        return await this.callAsync ("futurePublicGetOpenApiV2MarketKline",parameters);
    }

    public async Task<object> futurePublicGetOpenApiV2MarketList (object parameters = null)
    {
        return await this.callAsync ("futurePublicGetOpenApiV2MarketList",parameters);
    }

    public async Task<object> futurePublicGetOpenApiV2MarketDeals (object parameters = null)
    {
        return await this.callAsync ("futurePublicGetOpenApiV2MarketDeals",parameters);
    }

    public async Task<object> futurePublicGetOpenApiV2MarketDepth (object parameters = null)
    {
        return await this.callAsync ("futurePublicGetOpenApiV2MarketDepth",parameters);
    }

    public async Task<object> futurePublicGetOpenApiV2MarketState (object parameters = null)
    {
        return await this.callAsync ("futurePublicGetOpenApiV2MarketState",parameters);
    }

    public async Task<object> futurePublicGetOpenApiV2MarketStateAll (object parameters = null)
    {
        return await this.callAsync ("futurePublicGetOpenApiV2MarketStateAll",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2OrderDeals (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2OrderDeals",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2OrderFinished (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2OrderFinished",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2OrderDetail (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2OrderDetail",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2OrderPending (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2OrderPending",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2OrderStopPending (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2OrderStopPending",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2OrderStopFinished (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2OrderStopFinished",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2SettingLeverage (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2SettingLeverage",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2AssetQuery (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2AssetQuery",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2AssetHistory (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2AssetHistory",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2PositionPending (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2PositionPending",parameters);
    }

    public async Task<object> futurePrivateGetOpenApiV2PositionMargin (object parameters = null)
    {
        return await this.callAsync ("futurePrivateGetOpenApiV2PositionMargin",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2PositionMargin (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2PositionMargin",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2OrderMarket (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2OrderMarket",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2OrderCancelAll (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2OrderCancelAll",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2OrderCancel (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2OrderCancel",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2OrderLimit (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2OrderLimit",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2OrderStop (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2OrderStop",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2OrderStopCancel (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2OrderStopCancel",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2OrderStopCancelAll (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2OrderStopCancelAll",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2SettingLeverage (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2SettingLeverage",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2PositionCloseLimit (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2PositionCloseLimit",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2PositionCloseMarket (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2PositionCloseMarket",parameters);
    }

    public async Task<object> futurePrivatePostOpenApiV2PositionCloseStop (object parameters = null)
    {
        return await this.callAsync ("futurePrivatePostOpenApiV2PositionCloseStop",parameters);
    }

}