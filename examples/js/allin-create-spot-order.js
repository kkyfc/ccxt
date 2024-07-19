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
    const orders = await exchange.createOrder('BTC/USDT', 'limit', 'buy', 0.1, 60000, {});
    console.log(orders);
}
await example();
