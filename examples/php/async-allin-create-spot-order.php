<?php
namespace ccxt;
include_once (__DIR__.'/../../ccxt.php');
// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -----------------------------------------------------------------------------

error_reporting(E_ALL | E_STRICT);
date_default_timezone_set('UTC');

use ccxt\Precise;
use React\Async;
use React\Promise;


// AUTO-TRANSPILE //
function example() {
    return Async\async(function () {
        $exchange = new \ccxt\async\allin(array(
            'apiKey' => 'MG9pDxDRRRJZkuFDAVK6RZyiexsXKN',
            'secret' => 'jN2j4gnUPyaOD3wVDoOZpyq5s8ymCgYN4khCwp2aEnsOf4W1na',
            'options' => array(
                'defaultType' => 'spot',
            ),
        ));
        $exchange->set_sandbox_mode(true);
        Async\await($exchange->load_markets());
        $exchange->verbose = true; // uncomment for debugging purposes if necessary
        $orders = Async\await($exchange->create_order('BTC/USDT', 'limit', 'buy', 0.1, 60000, array()));
        var_dump($orders);
    }) ();
}


Async\await(example());
