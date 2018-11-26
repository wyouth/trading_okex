const exchanges = [
    {
        name: 'OKEX',
        value: 'OKEX',
        desc: 'OKEX'
    }
];
const supportedResolutions = ['1', '3', '5', '15', '30', '60', '120', '240', 'D', 'W'];

let instruments = [];
export default config => {
    return {
        onReady: async callback => {
            console.warn('chartApi onReady');
            const response = await fetch(`${config.host}:${config.port}/proxy`, {
                method: 'POST',
                body: JSON.stringify({
                    url: 'https://www.okex.com/api/spot/v3/instruments'
                })
            });
            const result = await response.json();
            instruments = result;
            let symbols_types = [];
            let symbols_types_map = {};
            result.forEach(i => {
                symbols_types_map[i.quote_currency] = true;
            });
            for (let name in symbols_types_map) {
                symbols_types.push({
                    name,
                    value: name
                });
            }
            callback({
                exchanges,
                symbols_types,
                supported_resolutions: supportedResolutions,
                supports_marks: true
                // supports_timescale_marks: true,
            });
        },
        searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
            console.warn('chartApi searchSymbols ');
            console.table({ userInput, exchange, symbolType });
            // {
            //     "symbol": "<商品缩写名>",
            //     "full_name": "<商品全称 -- 例: BTCE:BTCUSD>",
            //     "description": "<商品描述>",
            //     "exchange": "<交易所名>",
            //     "ticker": "<商品代码, 可选>",
            //     "type": "stock" | "futures" | "bitcoin" | "forex" | "index"
            // }
            let arr = [];
            instruments.forEach(i => {
                if (
                    i.quote_currency === symbolType &&
                    userInput !== symbolType &&
                    i.base_currency.indexOf(userInput) > -1
                ) {
                    const instrument_id = i.instrument_id.replace('-', '/');
                    arr.push({
                        symbol: i.base_currency,
                        full_name: instrument_id,
                        description: instrument_id,
                        exchange: exchange,
                        // "ticker": instrument_id,
                        type: 'bitcoin'
                    });
                }
            });
            onResultReadyCallback(arr);
            // console.table(result);
        },
        resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
            console.warn('chartApi resolveSymbol');
            console.table({ symbolName });

            await setTimeout(() => {}, 0);
            onSymbolResolvedCallback({
                name: symbolName,
                description: '',
                type: 'crypto',
                session: '24x7',
                timezone: 'Etc/UTC',
                ticker: symbolName,
                exchange: 'OKEX',
                minmov: 1,
                pricescale: 100000000,
                has_intraday: true,
                has_daily: true,
                has_weekly_and_monthly: true,
                intraday_multipliers: ['1', '3', '5', '15', '30', '60', '120', '240'],
                supported_resolutions: supportedResolutions,
                volume_precision: 8,
                data_status: 'streaming'
            });
        },
        getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
            console.warn('chartApi getBars');
            console.warn('getBars symbolInfo', symbolInfo);
            console.table({ resolution, from, to, firstDataRequest });
            let type;
            if (resolution === 'D') {
                type = 'day';
            } else if (resolution === 'W') {
                type = 'week';
            } else {
                const interval = Number(resolution);
                if (interval < 60) {
                    type = interval + 'min';
                } else {
                    type = interval / 60 + 'hour';
                }
            }
            const ticker = symbolInfo.ticker.replace('/', '_').toLowerCase();
            const response = await fetch(
                // https://www.okex.com/v2/market/index/kLine?symbol=f_usd_btc&type=1min&contractType=this_week&limit=1000&coinVol=0
                // `/api/spot/v3/instruments/${ticker}/candles?start=${start}&end=${end}&granularity=${granularity}`,
                `${config.host}:${config.port}/proxy`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        url: `https://www.okex.com/v2/spot/markets/kline?symbol=${ticker}&type=${type}&coinVol=0`
                    })
                }
            );
            const result = await response.json();
            let finalResult = result.data.map(i => ({
                // ...i,
                // close: Number(i.close),
                // open: Number(i.open),
                // high: Number(i.high),
                // low: Number(i.low),
                // volume: Number(i.volume),
                // time: moment(i.time).valueOf()
                time: i.time,
                open: Number(i.open),
                high: Number(i.high),
                low: Number(i.low),
                close: Number(i.close),
                volume: Number(i.volume)
            }));
            let meta = {
                noData: false
            };
            if (finalResult.length === 0) {
                meta = {
                    noData: true
                    // nextTime: to
                };
            } else {
                if (finalResult[0].time > to * 1000) {
                    meta = {
                        noData: true
                        // nextTime: finalResult[finalResult.length - 1].time / 1000
                    };
                }
            }
            console.table(meta);
            onHistoryCallback(meta.noData ? [] : finalResult, meta);
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) => {
            console.warn('chartApi subscribeBars');
            console.warn('subscribeBars symbolInfo', symbolInfo);
            console.table({ resolution, subscriberUID });
        },
        unsubscribeBars: subscriberUID => {
            console.warn('chartApi unsubscribeBars');
            console.table({ subscriberUID });
        },
        calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
            console.warn('chartApi calculateHistoryDepth');
            console.table({ resolution, resolutionBack, intervalBack });
            // return resolution === 'D' ? {resolutionBack: 'M', intervalBack: 3} : undefined;
        },
        getMarks: async (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
            console.warn('chartApi getMarks');
            console.warn('getMarks symbolInfo', symbolInfo);
            console.table({ startDate, endDate, resolution });
            try {
                // const response = await fetch(`${window.location.protocol}//${window.location.hostname}:8888`);
                const response = await fetch(`${config.host}:${config.port}/info`);
                const result = await response.json();
                onDataCallback(
                    result.map(i => ({
                        id: i.datetime + '',
                        time: Math.ceil(new Date(i.datetime).getTime() / 1000),
                        color: i.direction === '空' ? 'yellow' : 'blue',
                        label: i.direction,
                        text: `
                        <div>
                            <p>${i.offset}</p>
                            <p>价格：${i.price}</p>
                            <p>交易量：${i.volume}</p>
                        </div>
                    `,
                        labelFontColor: 'white',
                        minSize: 14
                    }))
                );
            } catch (e) {
                console.error('getMarks catch error', e);
            }
        },
        getServerTime: callback => {
            console.warn('chartApi getServerTime');
            // callback();
        }
    };
};
