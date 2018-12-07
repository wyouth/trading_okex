// eslint-disable-next-line
import React, { Component } from 'react';
import chartApi, { getBalanceData } from './chartApi';
import './chartStyle.css';
class Chart extends Component {
    state = {
        showBalance: false,
        balanceData: null,
        modalLoading: false
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
    getBalance = async () => {
        this.setState({
            modalLoading: true
        })
        const config = this.props.config;
        const iframe = document.querySelector('iframe');
        const inputEdit = iframe.contentWindow.document.querySelector('input.symbol-edit');
        const ticker_coin_type = inputEdit.value;
        let ticker = '';
        let ticker_text_array = []
        if (ticker_coin_type) {
            ticker_text_array = ticker_coin_type.split('=>');
            // console.log('ticker_text_array',ticker_text_array)
            if (ticker_text_array.length > 0) {
                ticker = ticker_text_array[0]
            }
        }
        console.log('inputEdit', inputEdit.value);
        if (ticker) {
            // console.log('ticker',ticker);
            const coins = config.tickersToCoinType[ticker_text_array[1]][ticker]
            const balanceData = await getBalanceData(ticker, coins, config.host, config.port);
            if (balanceData) {
                this.setState({
                    balanceData,
                    modalLoading: false
                })
            } else {
                this.setState({
                    balanceData: null,
                    modalLoading: false
                })
            }
        }
    }
    showBalance = (e) => {
        if (!this.state.showBalance) {
            this.setState({
                showBalance: !this.state.showBalance
            })
            this.getBalance();
        }
        this.setState({
            showBalance: !this.state.showBalance
        })
    }
    getBalanceBody = () => {
        const balanceDataObj = this.state.balanceData.data;
        const rate = this.state.balanceData.rate;
        let account = 0;
        const dataDom =  Object.keys(balanceDataObj).map((item, index) => {
            account += item === 'usdt'? Number(balanceDataObj[item]): Number(balanceDataObj[item]) * Number(rate)
            return (
                <div className="item" key = {index}>
                    <span className="data">
                        {item}
                    </span>
                    <span className="data">
                        {balanceDataObj[item]}
                    </span>
                    <span className="data">
                        {
                            item === 'usdt'
                            ? balanceDataObj[item]
                            : Number(balanceDataObj[item]) * Number(rate)
                        }
                    </span>
                </div>
            )
        })
        return (
            <>
                {dataDom}
                <div className="item">
                    <span className="data title">
                        合计
                    </span>
                    <span className="data">
                        {account} usdt
                    </span>
                    <span className="data">
                        
                    </span>
                </div>
            </>
        )
    }
    render() {
        const modalContrntLoading = <div className = "no_data">加载中...</div>;
        const modalContrntError = <div className = "no_data">暂无数据</div>;
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
                                <div className="modal" onClick={(e) => { e.stopPropagation() }}>
                                    <div className="title_wraper">
                                        <span>
                                            策略财务统计
                                        </span>
                                        <span className="close_but" onClick={this.showBalance}>
                                            +
                                        </span>
                                    </div>
                                    <div className="content">
                                        <div className="item">
                                            <span className="title data">
                                                名称
                                            </span>
                                            <span className="data title">
                                                数量
                                            </span>
                                            <span className="data title">
                                                换算 (usdt)
                                            </span>
                                        </div>
                                        {
                                            this.state.modalLoading
                                                ? modalContrntLoading
                                                : (
                                                    this.state.balanceData
                                                        ? this.getBalanceBody()
                                                        : modalContrntError
                                                )
                                        }
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
