import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/'
import { Link } from 'react-router-dom'

class Signin extends Component {
	constructor(props){
		super(props);

		this.dispatch = this.props.dispatch;
		this.login = this.login.bind(this);
	}

	login(e){
		e.preventDefault();
	}

	render() {
		return (
			<div className="Signin">
				<div className="container">
					<form>
						<div className="title"><Link to="/">Home</Link> / Sign in</div>
						<div className="form-control">
							<label>User name:</label>
							<input type="text"/>
						</div>

						<div className="form-control">
							<label>Password:</label>
							<input type="password"/>
						</div>

						<div className="form-control">
							<label className="checkbox">
								<input type="checkbox"/>
								<span>Remember Me</span>
							</label>
						</div>

						<input className="button blue" type="submit" onClick={this.login} value="Sign in"/>
					
						<Link to="/signup" className="splink">Register a new profile</Link>
					</form>
				</div>
			</div>
		);
	}
}

export default connect()(Signin);
