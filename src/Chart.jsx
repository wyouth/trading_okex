// eslint-disable-next-line
import React, { Component } from 'react';
import chartApi from './chartApi';

class Chart extends Component {
    componentDidMount() {
        window.TradingView.onready(function() {
            var widget = (window.tvWidget = new window.TradingView.widget({
                debug: true, // uncomment this line to see Library errors and warnings in the console
                fullscreen: true,
                timezone: 'Europe/London',
                timeframe: '1D',
                symbol: 'BTC/USDT',
                interval: '1D',
                container_id: 'tv_chart_container',
                //	BEWARE: no trailing slash is expected in feed URL
                // datafeed: new window.Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
                datafeed: chartApi,
                library_path: '/assets/charting_library/',
                locale: 'zh',
                //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
                drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
                disabled_features: ['use_localstorage_for_settings'],
                enabled_features: ['study_templates'],
                charts_storage_url: 'http://saveload.tradingview.com',
                charts_storage_api_version: '1.1',
                client_id: 'tradingview.com',
                user_id: 'public_user_id',
                has_intraday: true,
                // customFormatters: {
                //     timeFormatter: {
                //         format: function(date) {
                //             var _format_str = '%h:%m';
                //             return _format_str
                //                 .replace('%h', date.getUTCHours(), 2)
                //                 .replace('%m', date.getUTCMinutes(), 2)
                //                 .replace('%s', date.getUTCSeconds(), 2);
                //         }
                //     },
                //     dateFormatter: {
                //         format: function(date) {
                //             return date.getUTCFullYear() + '/' + date.getUTCMonth() + '/' + date.getUTCDate();
                //         }
                //     }
                // }
            }));
        });
    }
    render() {
        return <div id="tv_chart_container" />;
    }
}

export default Chart;
