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
    while (true) {
        const balances = await allin.watchBalance ({});
        console.log ('watchBalance: ', balances);
    }
}
await example ();
