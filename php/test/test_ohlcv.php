<?php
namespace ccxt;

// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -----------------------------------------------------------------------------

function test_ohlcv($exchange, $ohlcv, $symbol, $since) {
    $json = $exchange->json ($ohlcv);
    assert ($ohlcv);
    assert (gettype($ohlcv) === 'array' && array_keys($ohlcv) === array_keys(array_keys($ohlcv)), $json);
    $length = count($ohlcv);
    assert ($length >= 6);
    for ($i = 0; $i < count($ohlcv); $i++) {
        assert (($ohlcv[$i] === null) || ((is_float($ohlcv[$i]) || is_int($ohlcv[$i]))), $json);
    }
    assert ($ohlcv[0] > 1230940800000, $json); // 03 Jan 2009 - first block
    assert ($ohlcv[0] < 2147483648000, $json); // 19 Jan 2038 - int32 overflows
    $skippedExchanges = array(
        'bitmex', // BitMEX API docs => also note the open price is equal to the close price of the previous timeframe bucket.
        'vcc', // same, the open price is equal to the close price of the previous timeframe bucket.
        'delta',
        'cryptocom',
    );
    if (!$exchange->in_array($exchange->id, $skippedExchanges)) {
        assert (($ohlcv[1] === null) || ($ohlcv[2] === null) || ($ohlcv[1] <= $ohlcv[2]), 'open > high, ' . $exchange->safe_string($ohlcv, 1, 'null') . ' > ' . $exchange->safe_string($ohlcv, 2, 'null')); // open <= high
        assert (($ohlcv[3] === null) || ($ohlcv[2] === null) || ($ohlcv[3] <= $ohlcv[2]), 'low > high, ' . $exchange->safe_string($ohlcv, 2, 'null') . ' > ' . $exchange->safe_string($ohlcv, 3, 'null')); // low <= high
        assert (($ohlcv[3] === null) || ($ohlcv[4] === null) || ($ohlcv[3] <= $ohlcv[4]), 'low > close, ' . $exchange->safe_string($ohlcv, 3, 'null') . ' > ' . $exchange->safe_string($ohlcv, 4, 'null')); // low <= close
    }
}

