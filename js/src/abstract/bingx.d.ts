import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';
interface Exchange {
    spotV1PublicGetServerTime(params?: {}): Promise<implicitReturnType>;
    spotV1PublicGetCommonSymbols(params?: {}): Promise<implicitReturnType>;
    spotV1PublicGetMarketTrades(params?: {}): Promise<implicitReturnType>;
    spotV1PublicGetMarketDepth(params?: {}): Promise<implicitReturnType>;
    spotV1PublicGetMarketKline(params?: {}): Promise<implicitReturnType>;
    spotV1PublicGetTicker24hr(params?: {}): Promise<implicitReturnType>;
    spotV1PublicGetTickerPrice(params?: {}): Promise<implicitReturnType>;
    spotV1PublicGetTickerBookTicker(params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetTradeQuery(params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetTradeOpenOrders(params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetTradeHistoryOrders(params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetTradeMyTrades(params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetUserCommissionRate(params?: {}): Promise<implicitReturnType>;
    spotV1PrivateGetAccountBalance(params?: {}): Promise<implicitReturnType>;
    spotV1PrivatePostTradeOrder(params?: {}): Promise<implicitReturnType>;
    spotV1PrivatePostTradeCancel(params?: {}): Promise<implicitReturnType>;
    spotV1PrivatePostTradeBatchOrders(params?: {}): Promise<implicitReturnType>;
    spotV1PrivatePostTradeOrderCancelReplace(params?: {}): Promise<implicitReturnType>;
    spotV1PrivatePostTradeCancelOrders(params?: {}): Promise<implicitReturnType>;
    spotV1PrivatePostTradeCancelOpenOrders(params?: {}): Promise<implicitReturnType>;
    spotV1PrivatePostTradeCancelAllAfter(params?: {}): Promise<implicitReturnType>;
    spotV2PublicGetMarketDepth(params?: {}): Promise<implicitReturnType>;
    spotV2PublicGetMarketKline(params?: {}): Promise<implicitReturnType>;
    spotV3PrivateGetGetAssetTransfer(params?: {}): Promise<implicitReturnType>;
    spotV3PrivateGetAssetTransfer(params?: {}): Promise<implicitReturnType>;
    spotV3PrivateGetCapitalDepositHisrec(params?: {}): Promise<implicitReturnType>;
    spotV3PrivateGetCapitalWithdrawHistory(params?: {}): Promise<implicitReturnType>;
    spotV3PrivatePostPostAssetTransfer(params?: {}): Promise<implicitReturnType>;
    swapV1PublicGetTickerPrice(params?: {}): Promise<implicitReturnType>;
    swapV1PublicGetMarketHistoricalTrades(params?: {}): Promise<implicitReturnType>;
    swapV1PrivateGetPositionSideDual(params?: {}): Promise<implicitReturnType>;
    swapV1PrivateGetMarketMarkPriceKlines(params?: {}): Promise<implicitReturnType>;
    swapV1PrivateGetTradeBatchCancelReplace(params?: {}): Promise<implicitReturnType>;
    swapV1PrivateGetTradeFullOrder(params?: {}): Promise<implicitReturnType>;
    swapV1PrivatePostTradeCancelReplace(params?: {}): Promise<implicitReturnType>;
    swapV1PrivatePostPositionSideDual(params?: {}): Promise<implicitReturnType>;
    swapV1PrivatePostTradeClosePosition(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetServerTime(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteContracts(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuotePrice(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteDepth(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteTrades(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuotePremiumIndex(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteFundingRate(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteKlines(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteOpenInterest(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteTicker(params?: {}): Promise<implicitReturnType>;
    swapV2PublicGetQuoteBookTicker(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserBalance(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserPositions(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserIncome(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeOpenOrders(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeOpenOrder(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeOrder(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeMarginType(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeLeverage(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeForceOrders(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeAllOrders(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetTradeAllFillOrders(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserIncomeExport(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetUserCommissionRate(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateGetQuoteBookTicker(params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeOrder(params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeBatchOrders(params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeCloseAllPositions(params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeCancelAllAfter(params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeMarginType(params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeLeverage(params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradePositionMargin(params?: {}): Promise<implicitReturnType>;
    swapV2PrivatePostTradeOrderTest(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateDeleteTradeOrder(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateDeleteTradeBatchOrders(params?: {}): Promise<implicitReturnType>;
    swapV2PrivateDeleteTradeAllOpenOrders(params?: {}): Promise<implicitReturnType>;
    swapV3PublicGetQuoteKlines(params?: {}): Promise<implicitReturnType>;
    cswapV1PublicGetMarketContracts(params?: {}): Promise<implicitReturnType>;
    cswapV1PublicGetMarketPremiumIndex(params?: {}): Promise<implicitReturnType>;
    cswapV1PublicGetMarketOpenInterest(params?: {}): Promise<implicitReturnType>;
    cswapV1PublicGetMarketKlines(params?: {}): Promise<implicitReturnType>;
    cswapV1PublicGetMarketDepth(params?: {}): Promise<implicitReturnType>;
    cswapV1PublicGetMarketTicker(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivateGetTradeLeverage(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivateGetTradeForceOrders(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivateGetTradeAllFillOrders(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivateGetUserCommissionRate(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivateGetUserPositions(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivateGetUserBalance(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivatePostTradeOrder(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivatePostTradeLeverage(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivatePostTradeAllOpenOrders(params?: {}): Promise<implicitReturnType>;
    cswapV1PrivatePostTradeCloseAllPositions(params?: {}): Promise<implicitReturnType>;
    contractV1PrivateGetAllPosition(params?: {}): Promise<implicitReturnType>;
    contractV1PrivateGetAllOrders(params?: {}): Promise<implicitReturnType>;
    contractV1PrivateGetBalance(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivateGetCapitalConfigGetall(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivateGetCapitalDepositAddress(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivateGetCapitalInnerTransferRecords(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivateGetCapitalSubAccountDepositAddress(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivateGetCapitalDepositSubHisrec(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivateGetCapitalSubAccountInnerTransferRecords(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivateGetCapitalDepositRiskRecords(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivatePostCapitalWithdrawApply(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivatePostCapitalInnerTransferApply(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivatePostCapitalSubAccountInnerTransferApply(params?: {}): Promise<implicitReturnType>;
    walletsV1PrivatePostCapitalDepositCreateSubAddress(params?: {}): Promise<implicitReturnType>;
    subAccountV1PrivateGetList(params?: {}): Promise<implicitReturnType>;
    subAccountV1PrivateGetAssets(params?: {}): Promise<implicitReturnType>;
    subAccountV1PrivatePostCreate(params?: {}): Promise<implicitReturnType>;
    subAccountV1PrivatePostApiKeyCreate(params?: {}): Promise<implicitReturnType>;
    subAccountV1PrivatePostApiKeyEdit(params?: {}): Promise<implicitReturnType>;
    subAccountV1PrivatePostApiKeyDel(params?: {}): Promise<implicitReturnType>;
    subAccountV1PrivatePostUpdateStatus(params?: {}): Promise<implicitReturnType>;
    accountV1PrivateGetUid(params?: {}): Promise<implicitReturnType>;
    accountV1PrivateGetApiKeyQuery(params?: {}): Promise<implicitReturnType>;
    accountV1PrivatePostInnerTransferAuthorizeSubAccount(params?: {}): Promise<implicitReturnType>;
    userAuthPrivatePostUserDataStream(params?: {}): Promise<implicitReturnType>;
    userAuthPrivatePutUserDataStream(params?: {}): Promise<implicitReturnType>;
    userAuthPrivateDeleteUserDataStream(params?: {}): Promise<implicitReturnType>;
    copyTradingV1PrivateGetSwapTraceCurrentTrack(params?: {}): Promise<implicitReturnType>;
    copyTradingV1PrivatePostSwapTraceCloseTrackOrder(params?: {}): Promise<implicitReturnType>;
    copyTradingV1PrivatePostSwapTraceSetTPSL(params?: {}): Promise<implicitReturnType>;
    copyTradingV1PrivatePostSpotTraderSellOrder(params?: {}): Promise<implicitReturnType>;
    apiV3PrivateGetAssetTransfer(params?: {}): Promise<implicitReturnType>;
    apiV3PrivateGetCapitalDepositHisrec(params?: {}): Promise<implicitReturnType>;
    apiV3PrivateGetCapitalWithdrawHistory(params?: {}): Promise<implicitReturnType>;
    apiV3PrivatePostPostAssetTransfer(params?: {}): Promise<implicitReturnType>;
}
declare abstract class Exchange extends _Exchange {
}
export default Exchange;
