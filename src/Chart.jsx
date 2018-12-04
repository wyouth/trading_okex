// eslint-disable-next-line
import React, { Component } from 'react';
import chartApi from './chartApi';
import './chartStyle.css'
class Chart extends Component {
    state = {
        showBalance: false
    }
    componentDidMount() {
        const config = this.props.config;
        console.log('ready');
        window.tvWidget = new window.TradingView.widget({
            debug: false,
            symbol: 'revH_trade=>OKEX',
            datafeed: chartApi(config),
            interval: '15',
            container_id: 'tv_chart_container',
            library_path: '/static/charting_library/',
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
                'mainSeriesProperties.showCountdown': true,
                'paneProperties.background': '#131722',
                'paneProperties.vertGridProperties.color': '#363c4e',
                'paneProperties.horzGridProperties.color': '#363c4e',
                'symbolWatermarkProperties.transparency': 90,
                'scalesProperties.textColor': '#AAA',
                'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
                'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f'
            }
        });
        window.tvWidget.onChartReady(function () {
            console.log('tvWidget.onChartReady');
            // 偏门方法实现，点击输入框自动打开 交易所/策略选择的下拉框
            const iframe = document.querySelector('iframe');
            const inputEdit = iframe.contentWindow.document.querySelector('input.symbol-edit');
            inputEdit.addEventListener('click', function () {
                console.log('tvWidget.click');
                const value = inputEdit.value;
                inputEdit.value = value + ' ';
                setTimeout(function () {
                    inputEdit.value = value;
                }, 100);
                // inputEdit.value = value;
            });
        });
    }
    showBalance = (e) => {
        this.setState({
            showBalance: !this.state.showBalance
        })
    }
    render() {
        return (
            <div className="box">
                <div id="tv_chart_container" style={{ height: '100%' }} />
                <div className="balance_button" onClick={
                    this.showBalance
                }>
                    <span>
                        资产
                        </span>
                </div>
                {
                    this.state.showBalance
                        ? (
                            <div
                                onClick={this.showBalance}
                                className="modal_mask"
                            >
                                <div className="modal" onClick = {(e) =>{e.stopPropagation()}}>
                                    <div className="title_wraper">
                                        <span>
                                            策略财务统计
                                        </span>
                                        <span className = "close_but" onClick={this.showBalance}>
                                            +
                                        </span>
                                    </div>
                                    <div className ="content">
                                        <div className="item">
                                            <span className="title">
                                                名称
                                            </span>
                                            <span className="data">
                                                数量
                                        </span>
                                        </div>
                                        <div className="item">
                                            <span className="title">
                                                当前资产
                                        </span>
                                            <span className="data">
                                                1200000 okex
                                        </span>
                                        </div>
                                        <div className="item">
                                            <span className="title">
                                                当前资产
                                            </span>
                                            <span className="data">
                                                1200000 okex
                                            </span>
                                        </div>
                                        <div className="item">
                                            <span className="title">
                                                当前资产
                                            </span>
                                            <span className="data">
                                                1200000 okex
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                        : null
                }
            </div>
        );
    }
}

export default Chart;
