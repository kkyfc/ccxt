import Exchange from './abstract/allin.js';
import type { Int, OrderSide, OrderType, Trade, Order, OHLCV, Balances, Str, Ticker, OrderBook, Market, MarketInterface, Num, Dict, Position, Strings, Leverage } from './base/types.js';
/**
 * @class allin
 * @augments Exchange
 */
export default class allin extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarket(market: Dict): MarketInterface;
    parseFutureMarket(market: Dict): MarketInterface;
    parseSpotMarket(market: Dict): MarketInterface;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    fetchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<OrderBook>;
    fetchBalance(params?: {}): Promise<Balances>;
    fetchLeverage(symbol: string, params?: {}): Promise<Leverage>;
    fetchPosition(symbol: string, params?: {}): Promise<Position>;
    fetchPositions(symbols?: Strings, params?: {}): Promise<Position[]>;
    fetchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    fetchOrders(symbol: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOpenOrders(symbol: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    fetchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): Promise<Order>;
    cancelOrder(id: string, symbol: Str, params?: {}): Promise<{}>;
    cancelOrders(ids: string[], symbol?: Str, params?: {}): Promise<Order[]>;
    createSpotOrderRequest(symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num, params: {}, market: Market): Dict;
    createFutureOrderRequest(symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num, params: {}, market: Market): Dict;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    setLeverage(leverage: Int, symbol?: Str, params?: {}): Promise<{}>;
    parseTicker(ticker: Dict, market?: Market): Ticker;
    parseSpotBalance(response: any): Balances;
    parseFutureBalance(response: any): Balances;
    parseOHLCV(ohlcv: any, market?: Market): OHLCV;
    parseLowerTimeframe(timeframeId: string): any;
    parseTrade(trade: Dict, market?: Market): Trade;
    parseOrderType(type_: Str): "limit" | "market";
    toSpotOrderType(type_: string): "LIMIT" | "MARKET";
    toFutureOrderType(type_: string): 2 | 1;
    parseOrderSide(side: Int): "buy" | "sell";
    toOrderSide(side: string): 2 | 1;
    parseSpotOrderStatus(status: Int): string;
    parseFutureOrderStatus(status: Int): string;
    parseOrder(order: Dict, market?: Market): Order;
    parsePosition(position: Dict, market?: Market): Position;
    parsePositionSide(sideNum: Int): "short" | "long";
    toLeverageMode(marginMode: string): 2 | 1;
    parseLeverageMode(modeNum: Int): "isolated" | "cross";
    parseLeverage(leverage: any, market: any): Leverage;
    handleErrors(statusCode: Int, statusText: string, url: string, method: string, responseHeaders: Dict, responseBody: string, response: any, requestHeaders: any, requestBody: any): any;
    throwExactlyMatchedException(exact: any, string: any, message: any): void;
}
