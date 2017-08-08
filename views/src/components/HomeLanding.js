import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/'
import { Link } from 'react-router-dom'

class HomeLanding extends Component {
	constructor(props){
		super(props);

		this.dispatch = this.props.dispatch;
	}

	render() {
		return (
			<div className="HomeLanding">
				<div className="header">
					<div className="top-panel">
						<div className="menu">
							<Link to="/">Home</Link>
							<Link to="/signin">Sign in</Link>
						</div>
					</div>
					
					<div className="form">
						<p className="title">Chatix</p>
						<p className="info">Stay in touch from everywhere!</p>

						<div className="enter">
							<Link className="button big" to="/signin">Login</Link>
							<div className="signup">
								<div className="hor"></div>
								<div className="txt">or <Link to="/signup">Sign up!</Link></div>
								<div className="hor"></div>
							</div>
						</div>
					</div>
				</div>

				<div className="strip">
					<div className="title">Web developer?</div>
					<div className="info">Create your own chat in 5 minutes using our free API!</div>
				</div>

				<div className="fordev">
					<div className="info">
						<div className="box">
							<img draggable="false" src="/images/icons/landing/icon_1.png"/>
							<div className="div"></div>
							<div className="title">Free</div>
							<div className="info">It has always been and will be a free tool for rapid deployment of web chat applications!</div>
						</div>
						<div className="box">
							<img draggable="false" src="/images/icons/landing/icon_2.png"/>
							<div className="div"></div>
							<div className="title">Fast</div>
							<div className="info">Build your out chat in 5 minutes!</div>
						</div>
						<div className="box">
							<img draggable="false" src="/images/icons/landing/icon_3.png"/>
							<div className="div"></div>
							<div className="title">Configurable</div>
							<div className="info">Get full access to all features and settings!</div>
						</div>
					</div>

					<div className="foot">
						<Link to="/signup" className="button big">Let's start</Link>
					</div>
				</div>

				<div className="footer">
					<div className="icons">
						<a href="https://www.facebook.com/profile.php?id=100001327923136" target="_blank"><img src="/images/icons/fb.png"/></a>
						<a href="https://www.instagram.com/alangospedro/" target="_blank"><img src="/images/icons/ig.png"/></a>
					</div>
					<ul className="info">
						<li>@ { new Date().getFullYear() }</li>
						<li><a href="mailto:slavas490@gmail.com">slavas490@gmail.com</a></li>
					</ul>
				</div>
			</div>
		);
	}
}

export default connect()(HomeLanding);
