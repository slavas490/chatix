import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Route, Switch, Redirect } from 'react-router';
import * as components from './index'
import io from 'socket.io-client'  

class Home extends Component {
	constructor(props){
		super(props);

		this.state = {
			uid: null,
			nSMS: []
		}

		this.dispatch = this.props.dispatch;

		this._root = document.getElementById('root');
		this._root.classList.add('homewr');
		
		this.socket = io({query:"uid=null"});
		
		this.setUID = this.setUID.bind(this);
		this.getUID = this.getUID.bind(this);
		this.checkUID = this.checkUID.bind(this);
		this.checkSMS = this.checkSMS.bind(this);
	}

	componentDidMount () {
		this.checkSMS();
	}

	checkSMS () {
		fetch('/chat/left', {
            credentials: "same-origin"
		})
		.then(out => out.json())
		.then(out => {
            this.setState({ nSMS: out });
		});
	}

	resizePushContainer () {
		let push_container = this.refs.push_container;

		if(push_container) {
			this.refs.push_container.style.height = "";
		}
	}

	getUID () {
		return this.state.uid;
	}

	checkUID (uid) {
		return uid == this.state.uid;
	}

	setUID (uid) {
		this.setState({ uid: uid });
	}

	render() {
		this.resizePushContainer();
		
		return (
			<div className="Home">
				<div className="container">
					<div className="menu">
						<div className="content">
							<ul>
								<li><Link to="/">Home</Link></li>
								<li><Link to="/">Profile</Link></li>
								<li><Link to="/api">API</Link></li>
							</ul>
						</div>
					</div>

					<div className="frame">
						<div className="box">
							<Switch>
								<Route exact path="/" render={(params) => <components.FriendList {...params} socket={this.socket} getUID={this.getUID} newSMS={this.state.nSMS} /> } />
								<Route path="/chat/:userID" render={(params) => <components.Chat {...params} socket={this.socket} setUID={this.setUID} checkUID={this.checkUID} checkSMS={this.checkSMS} /> } />
								<Route path="*" children={() => (
									<Redirect to="/"/>
								)}/>
							</Switch>
						</div>
					</div>
				</div>

				<div ref="push_container" id="push_container"/>
			</div>
		);
	}
}

export default connect()(Home);
