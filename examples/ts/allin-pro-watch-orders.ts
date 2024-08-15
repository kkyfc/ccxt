import ccxt from '../../js/ccxt.js';

// AUTO-TRANSPILE //

async function example () {
    const allin = new ccxt.pro.allin ({
        'apiKey': 'MG9pDxDRRRJZkuFDAVK6RZyiexsXKN',
        'secret': 'jN2j4gnUPyaOD3wVDoOZpyq5s8ymCgYN4khCwp2aEnsOf4W1na',
        'options': {
            'defaultType': 'spot',
        },
    });
    allin.setSandboxMode (true);
    const symbol = 'BTC/USDT';
    while (true) {
        const orders = await allin.watchOrders (symbol);
        console.log ('orders: ', orders);
    }
}
await example ();
