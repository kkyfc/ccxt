import Exchange from './abstract/coinex.js';
import type { Balances, Currency, FundingHistory, FundingRateHistory, Int, Market, OHLCV, Order, OrderSide, OrderType, Str, Strings, Ticker, Tickers, Trade, Transaction, OrderRequest, TransferEntry, Leverage, Num, MarginModification, TradingFeeInterface, Currencies, TradingFees, Position, IsolatedBorrowRate, Dict, TransferEntries, LeverageTiers, LeverageTier, int } from './base/types.js';
/**
 * @class coinex
 * @augments Exchange
 */
export default class coinex extends Exchange {
    describe(): any;
    fetchCurrencies(params?: {}): Promise<Currencies>;
    fetchMarkets(params?: {}): Promise<Market[]>;
    fetchSpotMarkets(params: any): Promise<any[]>;
    fetchContractMarkets(params: any): Promise<any[]>;
    parseTicker(ticker: Dict, market?: Market): Ticker;
    fetchTicker(symbol: string, params?: {}): Promise<Ticker>;
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    fetchTime(params?: {}): Promise<number>;
    fetchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<import("./base/types.js").OrderBook>;
    parseTrade(trade: Dict, market?: Market): Trade;
    fetchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    fetchTradingFee(symbol: string, params?: {}): Promise<TradingFeeInterface>;
    fetchTradingFees(params?: {}): Promise<TradingFees>;
    parseTradingFee(fee: Dict, market?: Market): TradingFeeInterface;
    parseOHLCV(ohlcv: any, market?: Market): OHLCV;
    fetchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    fetchMarginBalance(params?: {}): Promise<Balances>;
    fetchSpotBalance(params?: {}): Promise<Balances>;
    fetchSwapBalance(params?: {}): Promise<Balances>;
    fetchFinancialBalance(params?: {}): Promise<Balances>;
    fetchBalance(params?: {}): Promise<Balances>;
    parseOrderStatus(status: Str): string;
    parseOrder(order: Dict, market?: Market): Order;
    createMarketBuyOrderWithCost(symbol: string, cost: number, params?: {}): Promise<Order>;
    createOrderRequest(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): any;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): Promise<Order>;
    createOrders(orders: OrderRequest[], params?: {}): Promise<Order[]>;
    cancelOrders(ids: any, symbol?: Str, params?: {}): Promise<any[]>;
    editOrder(id: string, symbol: string, type: OrderType, side: OrderSide, amount?: Num, price?: Num, params?: {}): Promise<Order>;
    cancelOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    cancelAllOrders(symbol?: Str, params?: {}): Promise<Order[]>;
    fetchOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    fetchOrdersByStatus(status: any, symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOpenOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchClosedOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    createDepositAddress(code: string, params?: {}): Promise<{
        info: any;
        currency: string;
        address: any;
        tag: any;
        network: any;
    }>;
    fetchDepositAddress(code: string, params?: {}): Promise<{
        info: any;
        currency: string;
        address: any;
        tag: any;
        network: any;
    }>;
    safeNetwork(networkId: any, currency?: Currency): any;
    safeNetworkCode(networkId: any, currency?: Currency): any;
    parseDepositAddress(depositAddress: any, currency?: Currency): {
        info: any;
        currency: string;
        address: any;
        tag: any;
        network: any;
    };
    fetchMyTrades(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    fetchPositions(symbols?: Strings, params?: {}): Promise<Position[]>;
    fetchPosition(symbol: string, params?: {}): Promise<Position>;
    parsePosition(position: Dict, market?: Market): Position;
    setMarginMode(marginMode: string, symbol?: Str, params?: {}): Promise<any>;
    setLeverage(leverage: Int, symbol?: Str, params?: {}): Promise<any>;
    fetchLeverageTiers(symbols?: Strings, params?: {}): Promise<LeverageTiers>;
    parseMarketLeverageTiers(info: any, market?: Market): LeverageTier[];
    modifyMarginHelper(symbol: string, amount: any, addOrReduce: any, params?: {}): Promise<any>;
    parseMarginModification(data: Dict, market?: Market): MarginModification;
    addMargin(symbol: string, amount: number, params?: {}): Promise<MarginModification>;
    reduceMargin(symbol: string, amount: number, params?: {}): Promise<MarginModification>;
    fetchFundingHistory(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<FundingHistory[]>;
    fetchFundingRate(symbol: string, params?: {}): Promise<{
        info: any;
        symbol: string;
        markPrice: number;
        indexPrice: any;
        interestRate: any;
        estimatedSettlePrice: any;
        timestamp: any;
        datetime: any;
        fundingRate: number;
        fundingTimestamp: number;
        fundingDatetime: string;
        nextFundingRate: number;
        nextFundingTimestamp: number;
        nextFundingDatetime: string;
        previousFundingRate: any;
        previousFundingTimestamp: any;
        previousFundingDatetime: any;
    }>;
    parseFundingRate(contract: any, market?: Market): {
        info: any;
        symbol: string;
        markPrice: number;
        indexPrice: any;
        interestRate: any;
        estimatedSettlePrice: any;
        timestamp: any;
        datetime: any;
        fundingRate: number;
        fundingTimestamp: number;
        fundingDatetime: string;
        nextFundingRate: number;
        nextFundingTimestamp: number;
        nextFundingDatetime: string;
        previousFundingRate: any;
        previousFundingTimestamp: any;
        previousFundingDatetime: any;
    };
    fetchFundingRates(symbols?: Strings, params?: {}): Promise<any>;
    withdraw(code: string, amount: number, address: string, tag?: any, params?: {}): Promise<Transaction>;
    parseTransactionStatus(status: Str): string;
    fetchFundingRateHistory(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<FundingRateHistory[]>;
    parseTransaction(transaction: Dict, currency?: Currency): Transaction;
    transfer(code: string, amount: number, fromAccount: string, toAccount: string, params?: {}): Promise<TransferEntry>;
    parseTransferStatus(status: any): string;
    parseTransfer(transfer: Dict, currency?: Currency): TransferEntry;
    fetchTransfers(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<TransferEntries>;
    fetchWithdrawals(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<Transaction[]>;
    fetchDeposits(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<Transaction[]>;
    parseIsolatedBorrowRate(info: Dict, market?: Market): IsolatedBorrowRate;
    fetchIsolatedBorrowRate(symbol: string, params?: {}): Promise<IsolatedBorrowRate>;
    fetchBorrowInterest(code?: Str, symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<any>;
    parseBorrowInterest(info: Dict, market?: Market): {
        account: any;
        symbol: string;
        marginMode: string;
        marginType: any;
        currency: string;
        interest: number;
        interestRate: number;
        amountBorrowed: number;
        timestamp: number;
        datetime: string;
        info: Dict;
    };
    borrowIsolatedMargin(symbol: string, code: string, amount: number, params?: {}): Promise<any>;
    repayIsolatedMargin(symbol: string, code: string, amount: any, params?: {}): Promise<any>;
    parseMarginLoan(info: any, currency?: Currency): {
        id: number;
        currency: string;
        amount: string;
        symbol: string;
        timestamp: number;
        datetime: string;
        info: any;
    };
    fetchDepositWithdrawFee(code: string, params?: {}): Promise<any>;
    parseDepositWithdrawFee(fee: any, currency?: Currency): Dict;
    fetchLeverage(symbol: string, params?: {}): Promise<Leverage>;
    parseLeverage(leverage: Dict, market?: Market): Leverage;
    fetchPositionHistory(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Position>;
    handleMarginModeAndParams(methodName: any, params?: {}, defaultValue?: any): any[];
    nonce(): number;
    sign(path: any, api?: any[], method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    handleErrors(httpCode: int, reason: string, url: string, method: string, headers: Dict, body: string, response: any, requestHeaders: any, requestBody: any): any;
    fetchMarginAdjustmentHistory(symbol?: Str, type?: Str, since?: Num, limit?: Num, params?: {}): Promise<MarginModification[]>;
}
