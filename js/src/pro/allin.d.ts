import allinRest from '../allin.js';
import type { Int, Str, OrderBook, Balances, Order, OHLCV } from '../base/types.js';
import Client from '../base/ws/Client.js';
export default class allin extends allinRest {
    describe(): any;
    watchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<OrderBook>;
    watchBalance(params?: {}): Promise<Balances>;
    watchOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    watchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    authenticate(url: any, params?: {}): Promise<any>;
    handleOrderBook(client: Client, message: any): void;
    handleDelta(bookside: any, delta: any): void;
    handleDeltas(bookside: any, deltas: any): void;
    handleOHLCV(client: Client, message: any): void;
    handleOrder(client: Client, message: any): void;
    handleBalance(client: Client, message: any): void;
    ping(client: any): {
        id: any;
        method: string;
        params: {};
    };
    handlePong(client: any, message: any): any;
    handleAuthenticate(client: Client, message: any): any;
    handleErrorMessage(client: Client, message: any): boolean;
    handleMessage(client: Client, message: any): void;
    requestId(): any;
}
