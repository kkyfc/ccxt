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
        "apiKey": "",
        "secret": "",
        "options": {
            "defaultType": "future"
        }
    })
    exchange.set_sandbox_mode(True)
    await exchange.load_markets()
    exchange.verbose = True  # uncomment for debugging purposes if necessary
    # fetch_leverage = await exchange.fetch_leverage('ETH/USDT:USDT', {})
    fetch_funding_rate = await exchange.fetch_funding_rate('BTC/USDT:USDT')
    print(fetch_funding_rate)

    await exchange.close()


asyncio.run(example())
