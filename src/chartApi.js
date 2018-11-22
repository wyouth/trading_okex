import moment from 'moment';
import dummyMarks from './lib/marks';
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
const supportedResolutions = ["1", "3", "5", "15", "30", "60", "120", "240", "D"];

const SingleTimeDataLimit = 200;

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
            symbols_types,
            supported_resolutions:  supportedResolutions,
            supports_marks: true,
            // supports_timescale_marks: true,
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
                    "symbol": `${exchange}:${i.base_currency}`,
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
			description: '',
			type: 'bitcoin',
			session: '24x7',
			timezone: 'Etc/UTC',
			ticker: symbolName,
			exchange: 'OKEX',
			minmov: 1,
			pricescale: 100000000,
			has_intraday: true,
			has_daily: true,
			intraday_multipliers: ['1', '3', '5', '15', '30', '60', '120', '240', '360', '720'],
			supported_resolutions:  supportedResolutions,
			volume_precision: 8,
			data_status: 'streaming',
        });
    },
    getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
        console.warn('chartApi getBars');
        console.warn('getBars symbolInfo', symbolInfo);
        console.table({resolution, from, to, firstDataRequest});
        // if (firstDataRequest) {
            const startTime = new Date((from) * 1000).toISOString();
            const endTime = new Date((to) * 1000).toISOString();
            // const startTime = moment("2018-11-18 04:40:00").format('YYYY-MM-DDTHH:mm:ss[Z]');
            // const endTime = moment("2018-11-19 05:48:00").format('YYYY-MM-DDTHH:mm:ss[Z]');
            let granularity;
            if (resolution === 'D') {
                granularity = 86400;
            } else {
                granularity = Number(resolution) * 60
            }
            const response = await fetch(ExChangeData.baseUrl + `/api/spot/v3/instruments/${symbolInfo.ticker.replace('/', '-')}/candles?start=${startTime}&end=${endTime}&granularity=${granularity}`, {
                method: 'GET',
            });
            const result = await response.json();
            let finalResult = [];
            finalResult = result.map((i, index) => ({
                ...i,
                // time: from * 1000 + (60 * 60 *24 * 1000) * (index+0)
                close: Number(i.close),
                open: Number(i.open),
                high: Number(i.high),
                low: Number(i.low),
                volume: Number(i.volume),
                time: moment(i.time).valueOf()
            }));
            let noData = finalResult.length === 0;
            // let nextTime = noData ? to * 1000 : undefined;
            // if (noData) {
            //     nextTime = to * 1000;
            // }
            // if (!noData && ((from * 1000 - data[0].time) > granularity * 1000) ) {
            //     nextTime = data[0].time;
            // }
            // console.table(data);
            onHistoryCallback(finalResult.reverse(), {
                noData,
                // nextTime
            });
        // }
    },
    subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
        console.warn('chartApi subscribeBars');
        console.warn('subscribeBars symbolInfo', symbolInfo);
        console.table({resolution, subscriberUID});
    },
    unsubscribeBars: (subscriberUID) => {
        console.warn('chartApi unsubscribeBars');
        console.table({subscriberUID});
    },
    calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
        console.warn('chartApi calculateHistoryDepth');
        console.table({resolution, resolutionBack, intervalBack});
    },
    getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        console.warn('chartApi getMarks');
        console.warn('getMarks symbolInfo', symbolInfo);
        console.table({startDate, endDate, resolution});
        onDataCallback(dummyMarks.map(i => ({
            id: i.datetime + '',
            time: moment(i.datetime).unix(),
            color: i.direction === '空' ? 'yellow' : 'blue',
            label: i.direction,
            text: `
                <div>
                    <p>${i.offset}</p>
                    <p>价格：${i.price}</p>
                    <p>交易量：${i.volume}</p>
                </div>
            `,
            labelFontColor: '#ff0000',
            minSize: 20
        })));
    },
    getServerTime: (callback) => {
        console.warn('chartApi getServerTime');
        callback();
    },
}