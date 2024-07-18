import Exchange from './abstract/allin.js';
import type { Int, OrderSide, OrderType, Trade, Order, OHLCV, Balances, Str, Ticker, OrderBook, Market, MarketInterface, Num, Dict } from './base/types.js';
/**
 * @class allin
 * @augments Exchange
 */
export default class allin extends Exchange {
    describe(): any;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarket(market: Dict): MarketInterface;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    fetchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<OrderBook>;
    fetchBalance(params?: {}): Promise<Balances>;
    fetchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    fetchOrders(symbol: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOpenOrders(symbol: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    fetchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): Promise<Order>;
    cancelOrder(id: string, symbol: Str, params?: {}): Promise<{}>;
    createOrderRequest(symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num, params: {}, market: Market): Dict;
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    parseTicker(ticker: Dict, market?: Market): Ticker;
    parseBalance(response: any): Balances;
    parseOHLCV(ohlcv: any, market?: Market): OHLCV;
    parseTrade(trade: Dict, market?: Market): Trade;
    parseOrderType(type_: Str): "limit" | "market";
    toOrderType(type_: string): "LIMIT" | "MARKET";
    parseOrderSide(side: Int): "buy" | "sell";
    toOrderSide(side: string): 1 | -1;
    parseOrderStatus(status: Int): string;
    parseOrder(order: Dict, market?: Market): Order;
    handleErrors(statusCode: Int, statusText: string, url: string, method: string, responseHeaders: Dict, responseBody: string, response: any, requestHeaders: any, requestBody: any): any;
}
