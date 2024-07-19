import ccxt from '../../js/ccxt.js';
// AUTO-TRANSPILE //
async function example() {
    const exchange = new ccxt.allin({
        'apiKey': 'MG9pDxDRRRJZkuFDAVK6RZyiexsXKN',
        'secret': 'jN2j4gnUPyaOD3wVDoOZpyq5s8ymCgYN4khCwp2aEnsOf4W1na',
        'options': {
            'defaultType': 'spot',
        },
    });
    exchange.setSandboxMode(true);
    await exchange.loadMarkets();
    exchange.verbose = true; // uncomment for debugging purposes if necessary
    const orders = await exchange.cancelOrder('38', 'BTC/USDT', {});
    console.log(orders);
}
await example();
