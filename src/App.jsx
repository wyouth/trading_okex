import React, { Component } from 'react';
import Chart from './Chart';
import './App.css';
import jparticles from 'jparticles';

class App extends Component {
    constructor() {
        super();
        this.state = {
            hasLogin: false,
            username: '',
            password: '',
            errorMsg: '',
            loading: true,
            config: {}
        }
    }
    componentDidMount() {
        window.TradingView.onready(this.loadConfig);
    }
    loadConfig = async () => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET","config.json?_" + Date.now(), true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = () => {
            // alert(`xmlhttp.readyState -- ${xmlhttp.readyState} -- xmlhttp.status -- ${xmlhttp.status}`);
            if (xmlhttp.readyState === 4) {
                try {
                    const config = JSON.parse(xmlhttp.responseText);
                    console.log('loadConfig', config);
                    const title = config.title;
                    document.title = title;
                    const lastLoginTime = Number(window.localStorage.getItem('tradingViewLoginTime'));
                    const username = window.localStorage.getItem('tradingViewLoginUsername') || '';
                    let hasLogin = false;
                    if ((lastLoginTime + config.expires * 1000) > Date.now()) {
                        hasLogin = true;
                    }
                    if (!hasLogin) {
                        window.addEventListener('keydown', e => {
                            if (e.keyCode === 13) {
                                this.submit();
                            }
                        });
                        new jparticles.particle('.login-bg', {
                            // 两粒子圆心点之间的直线距离为 90
                            proximity: 90,
                            // 定位点半径 100 以内（包含）的所有粒子，圆心点之间小于等于 proximity 值，则连线
                            range: 100
                        });
                    }
                    this.setState({
                        loading: false,
                        hasLogin,
                        username,
                        password: '',
                        errorMsg: hasLogin ? '' : '请登录',
                        config
                    })
                } catch (e) {
                    console.error(e);
                    this.setState({
                        loading: false,
                        hasLogin: false,
                    })
                }
            }
        }
        // const response = await fetch('config.json', {method: 'GET'});

    }
    onChange = (name, value) => {
        this.setState({
            [name]: value
        })
    }
    submit = () => {
        const { username, password, config } = this.state;
        const accounts = config.accounts || {};
        if (accounts[username] !== password) {
            this.setState({
                errorMsg: '用户名或密码错误'
            })
        } else {
            window.localStorage.setItem('tradingViewLoginTime', Date.now() + '');
            window.localStorage.setItem('tradingViewLoginUsername', username);
            window.location.reload();
        }
    }
    render() {
        const { hasLogin, username, password, errorMsg, config, loading } = this.state;
        if (loading) {
            return <div>loading...</div>
        } else {
            return hasLogin ? <Chart config={config}/> :
            <div style={{height: '100%'}}>
                <div className="login-bg"></div>
                <div className="main">
                    <input type="text" className="ant-input" placeholder="用户名" style={{marginBottom: 44}} value={username} onChange={e => this.onChange('username', e.target.value)}/>
                    <input type="password" className="ant-input" placeholder="密码" value={password} onChange={e => this.onChange('password', e.target.value)}/>
                    <p className="error-msg" style={{marginBottom: 24, marginTop: 8, height: 24}}>{errorMsg}</p>
                    <button onClick={this.submit} className="ant-btn ant-btn-primary ant-btn-lg">登 录</button>
                </div>
            </div>;
        }
    }
}

export default App;
