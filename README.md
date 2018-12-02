# TradingView 文档
[https://b.aitrade.ga/books/tradingview/](https://b.aitrade.ga/books/tradingview/)
# config.json说明
```json
{
    "title": "量化交易系统", // 网页标题
    "expires": 86400, // 登录有效时间 秒
    "accounts": { // 账号
        "admin": "b123456c"
    },
    "host": "http://192.168.1.99",
    "port": "5000",
    "exchanges": [ // 交易对
        {
            "name": "OKEX",
            "value": "OKEX",
            "desc": "OKEX"
        },
        {
            "name": "Binance",
            "value": "Binance",
            "desc": "Binance"
        },
        {
            "name": "Bitmex",
            "value": "Bitmex",
            "desc": "Bitmex"
        }
    ],
    "strategies": [ // 策略
        {
            "name": "revH_trade",
            "value": "revH_trade"
        },
        {
            "name": "fcv_btc_trade",
            "value": "fcv_btc_trade"
        },
        {
            "name": "fcv_eth_trade",
            "value": "fcv_eth_trade"
        },
        {
            "name": "fcv_eos_trade",
            "value": "fcv_eos_trade"
        }
    ],
    "tickers": { // 每个交易所下不同策略所传的交易对的参数
        "OKEX": {
            "revH_trade": "btc_usdt",
            "fcv_btc_trade": "btc_usdt",
            "fcv_eth_trade": "eth_usdt",
            "fcv_eos_trade": "eos_usdt"
        },
        "Binance": {
            "revH_trade": "BTCUSDT",
            "fcv_btc_trade": "BTCUSDT",
            "fcv_eth_trade": "ETHUSDT",
            "fcv_eos_trade": "EOSUSDT"
        },
        "Bitmex": {
            "revH_trade": "XBTUSD",
            "fcv_btc_trade": "XBTUSD",
            "fcv_eth_trade": "ETHUSD",
            "fcv_eos_trade": "EOSZ18"
        }
    },
    "klineLimit": { // 不同交易所接口返回数据条数上限
        "OKEX": 2000,
        "Binance": 500,
        "Bitmex": 1440
    }
}
```