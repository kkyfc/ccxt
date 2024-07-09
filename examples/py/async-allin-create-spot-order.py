# -*- coding: utf-8 -*-
import asyncio
import os
import sys
from pprint import pprint

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(root + '/python')

import ccxt.async_support as ccxt  # noqa: E402


async def main():
    exchange = ccxt.allin({
        "apiKey": "MG9pDxDRRRJZkuFDAVK6RZyiexsXKN",
        "secret": "jN2j4gnUPyaOD3wVDoOZpyq5s8ymCgYN4khCwp2aEnsOf4W1na",
        'enableRateLimit': True,
        "options": {
            "defaultType": "spot"
        }
    })
    print(exchange.urls)
    exchange.set_sandbox_mode(True)
    print(exchange.urls)
    await exchange.load_markets()
    market_id = 'ETH-230214-1525-C'
    symbol = 'BTC/USDT'
    try:
        response = await exchange.create_order('BTC/USDT', 'limit', 'buy', 0.01, 56000, {})
        # Implicit API:
        # response = await exchange.eapiPrivateDeleteOrder({
        #     'symbol': market_id,
        #     'orderId': order_id,
        # })
        pprint(response)
    except Exception as e:
        print('create_order() failed')
        print(e)
    await exchange.close()


asyncio.run(main())
