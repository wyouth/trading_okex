// eslint-disable-next-line
import React, { Component } from 'react';
class Chart extends Component {
    componentDidMount() {
        window.TradingView.onready(function() {
            window.tvWidget = new window.TradingView.widget({
                // debug: true, // uncomment this line to see Library errors and warnings in the console
                fullscreen: true,
                symbol: 'AAPL',
                interval: 'D',
                container_id: 'tv_chart_container',
                //	BEWARE: no trailing slash is expected in feed URL
                datafeed: new window.Datafeeds.UDFCompatibleDatafeed('https://demo_feed.tradingview.com'),
                library_path: '/assets/charting_library/',
                locale: 'en',
                //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
                drawings_access: { type: 'black', tools: [{ name: 'Regression Trend' }] },
                disabled_features: ['use_localstorage_for_settings'],
                enabled_features: ['study_templates'],
                charts_storage_url: 'http://saveload.tradingview.com',
                charts_storage_api_version: '1.1',
                client_id: 'tradingview.com',
                user_id: 'public_user_id'
            });
        });
    }
    render() {
        return <div id="tv_chart_container" />;
    }
}

export default Chart;
