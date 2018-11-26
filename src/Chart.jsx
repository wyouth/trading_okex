// eslint-disable-next-line
import React, { Component } from 'react';
import chartApi from './chartApi';

class Chart extends Component {
    componentDidMount() {
        const config = this.props.config;
        console.log('ready');
        new window.TradingView.widget({
            debug: false,
            symbol: 'BTC/USDT',
            datafeed: chartApi(config),
            interval: '15',
            container_id: 'tv_chart_container',
            library_path: 'assets/charting_library/',
            // timeframe: '1M',
            timezone: 'Asia/Shanghai',
            locale: 'zh',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates'],
            charts_storage_url: 'https://saveload.tradingview.com',
            charts_storage_api_version: '1.1',
            client_id: 'tradingview.com',
            user_id: 'public_user_id',
            fullscreen: true,
            autosize: false,
            overrides: {
                "mainSeriesProperties.showCountdown": true,
                'paneProperties.background': '#131722',
                'paneProperties.vertGridProperties.color': '#363c4e',
                'paneProperties.horzGridProperties.color': '#363c4e',
                'symbolWatermarkProperties.transparency': 90,
                'scalesProperties.textColor': '#AAA',
                'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
                'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f'
            }
        });
    }
    render() {
        return <div id="tv_chart_container" style={{height: '100%'}}/>;
    }
}

export default Chart;
