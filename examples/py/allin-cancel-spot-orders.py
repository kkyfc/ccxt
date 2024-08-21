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
        "apiKey": "YOUR_API_KEY",
        "secret": "YOUR_SECRET",
        "options": {
            "defaultType": "spot"
        }
    })
    exchange.set_sandbox_mode(True)
    await exchange.load_markets()
    exchange.verbose = True  # uncomment for debugging purposes if necessary
    orders = await exchange.cancel_orders(['22708038', '97508379'], 'BTC/USDT', {})
    print(orders)

    await exchange.close()


asyncio.run(example())
