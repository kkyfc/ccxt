// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';

interface Exchange {
    v1ArchivePost (params?: {}): Promise<implicitReturnType>;
    v1GatewayGetQuery (params?: {}): Promise<implicitReturnType>;
    v1GatewayGetSymbols (params?: {}): Promise<implicitReturnType>;
    v1GatewayGetTime (params?: {}): Promise<implicitReturnType>;
    v1GatewayPostQuery (params?: {}): Promise<implicitReturnType>;
    v1GatewayPostExecute (params?: {}): Promise<implicitReturnType>;
    v1TriggerPostExecute (params?: {}): Promise<implicitReturnType>;
    v1TriggerPostQuery (params?: {}): Promise<implicitReturnType>;
    v2ArchiveGetTickers (params?: {}): Promise<implicitReturnType>;
    v2ArchiveGetContracts (params?: {}): Promise<implicitReturnType>;
    v2ArchiveGetTrades (params?: {}): Promise<implicitReturnType>;
    v2ArchiveGetVrtx (params?: {}): Promise<implicitReturnType>;
    v2GatewayGetAssets (params?: {}): Promise<implicitReturnType>;
    v2GatewayGetPairs (params?: {}): Promise<implicitReturnType>;
    v2GatewayGetOrderbook (params?: {}): Promise<implicitReturnType>;
}
abstract class Exchange extends _Exchange {}

export default Exchange
