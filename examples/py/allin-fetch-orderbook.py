# -*- coding: utf-8 -*-

import asyncio
import os
import sys
from pprint import pprint

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(root + '/python')

import ccxt.async_support as ccxt  # noqa: E402


async def example():
    exchange = ccxt.allin({
        'apiKey': 'MG9pDxDRRRJZkuFDAVK6RZyiexsXKN',
        'secret': 'jN2j4gnUPyaOD3wVDoOZpyq5s8ymCgYN4khCwp2aEnsOf4W1na',
        'options': {
            'defaultType': 'spot',
        },
    })
    exchange.set_sandbox_mode(True)
    await exchange.load_markets()
    exchange.verbose = True  # uncomment for debugging purposes if necessary
    fetch_ohlcv = await exchange.fetch_order_book('BTC/USDT:USDT', 10, {})
    print(fetch_ohlcv)

    await exchange.close()


asyncio.run(example())
