import moment from 'moment';
const exchanges = [
    {
        name: 'OKEX',
        value: 'OKEX',
        desc: 'OKEX'
    }
];
const fetchBaseUrl = {
    OKEX: 'https://www.okex.com',
}
class Granularities {
    static oneMin = 60;
    static threeMin = 180;
    static fiveMin = 300;
    // static oneMin = 60;
    // static oneMin = 60;
    // static oneMin = 60;
    // static oneMin = 60;
    // static oneMin = 60;
    // static oneMin = 60;
}

class ExChangeData {
    _instruments = [];
    _baseUrl = '';

    get instruments() {
        return this._instruments;
    }
    set instruments(data) {
        this._instruments = data;
    }

    get baseUrl() {
        return this._baseUrl;
    }
    set baseUrl(data) {
        this._baseUrl = data;
    }

}

export default {
    onReady: async (callback) => {
        console.warn('chartApi onReady');
        ExChangeData.baseUrl = fetchBaseUrl.OKEX;
        const response = await fetch(ExChangeData.baseUrl + '/api/spot/v3/instruments', {
            method: 'GET',
        });
        const result = await response.json();
        ExChangeData.instruments = result;
        let symbols_types = [];
        let symbols_types_map = {};
        result.forEach(i => {
            symbols_types_map[i.quote_currency] = true;
        });
        for(let name in symbols_types_map) {
            symbols_types.push({
                name,
                value: name
            })
        }
        callback({
            exchanges,
            symbols_types
        });
    },
    searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
        console.warn('chartApi searchSymbols ');
        console.table({userInput, exchange, symbolType});
        // {
        //     "symbol": "<商品缩写名>",
        //     "full_name": "<商品全称 -- 例: BTCE:BTCUSD>",
        //     "description": "<商品描述>",
        //     "exchange": "<交易所名>",
        //     "ticker": "<商品代码, 可选>",
        //     "type": "stock" | "futures" | "bitcoin" | "forex" | "index"
        // }
        let arr = [];
        ExChangeData.instruments.forEach(i => {
            if (i.quote_currency === symbolType && userInput !== symbolType && i.base_currency.indexOf(userInput) > -1) {
                const instrument_id = i.instrument_id.replace('-', '/');
                arr.push({
                    "symbol": i.base_currency,
                    "full_name": instrument_id,
                    "description": instrument_id,
                    "exchange": exchange,
                    // "ticker": instrument_id,
                    "type": "bitcoin"
                });
            }
        });
        onResultReadyCallback(arr);
        // console.table(result);
    },
    resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
        console.warn('chartApi resolveSymbol');
        console.table({symbolName});

        await setTimeout(() => {}, 0);
        onSymbolResolvedCallback({
            name: symbolName,
            ticker: symbolName,
            timezone: 'Asia/Shanghai',
            minmov: 0.001,
            pricescale: 0.001,
            session: '24x7',
            exchange: 'OKEX',
            has_intraday: true,
        });
    },
    getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
        console.warn('chartApi getBars');
        console.table({symbolInfo, resolution, from, to, firstDataRequest});
        if (firstDataRequest) {
            const startTime = new Date((from) * 1000).toISOString();
            const endTime = new Date((to) * 1000).toISOString();
            const response = await fetch(ExChangeData.baseUrl + `/api/spot/v3/instruments/${symbolInfo.ticker.replace('/', '-')}/candles?start=${startTime}&end=${endTime}&granularity=86400`, {
                method: 'GET',
            });
            const result = await response.json();
            let finalResult = result.map((i, index) => ({
                ...i,
                // time: from * 1000 + (60 * 60 *24 * 1000) * (index+0)
                time: moment(i.time).valueOf()
            }));
            var data = finalResult.reverse();
            console.table(data);
            onHistoryCallback(data, {
                noData: false
            });
            // onHistoryCallback(finalResult);
            // return finalResult;

            // onHistoryCallback([
            //     {"close":"4682.6565","high":"4969.1447","low":"4337","open":"4949","time":1542643200000,"volume":"51853.08184551"},
            //     {"close":"4682.6565","high":"4969.1447","low":"4337","open":"4949","time":1542729600000,"volume":"51853.08184551"},
            // ]);
        }
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        console.warn('chartApi subscribeBars');
        console.table({symbolInfo, resolution, subscriberUID});
    },
    unsubscribeBars: (subscriberUID) => {
        console.warn('chartApi unsubscribeBars');
        console.table({subscriberUID});
    },
    // calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    //     console.warn('chartApi calculateHistoryDepth');
    //     console.table({resolution, resolutionBack, intervalBack});
    // },
    getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        console.warn('chartApi getMarks');
        console.table({symbolInfo, startDate, endDate, resolution});
    },
    getTimescaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        console.warn('chartApi getTimescaleMarks');
        console.table({symbolInfo, startDate, endDate, resolution});
    },
    getServerTime: (callback) => {
        console.warn('chartApi getServerTime');
        callback();
    },
}