import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/'
import { Link } from 'react-router-dom'
import { Redirect, Router } from 'react-router'

class Signin extends Component {
	constructor(props){
		super(props);

		this.state = {
			err: null
		};

		this.dispatch = this.props.dispatch;
		this.login = this.login.bind(this);
		this.onChangeInput = this.onChangeInput.bind(this);
	}

	onChangeInput () {
		this.setState({ err: null });
	}

	login(e){
		e.preventDefault();
		
		let form = this.refs.form;

		console.dir(form)

		fetch('/user/account/login', {
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				username: form[0].value,
				pass: form[1].value,
				remember: form[2].checked
			}),
			credentials: "same-origin"
		})
		.then(out => out.json())
		.then(out => {
			if(!out.code) {
				this.setState({ login: true, err: null });
				this.dispatch(actions.session.login());
			}
			else {
				this.setState({ err: out.err });
			}
		});
	}

	render() {
		return (
			<div>
				{ this.state.login
                    ?
                <Redirect to="/"/>
                    :
				<div className="Signin">
					<div className="container">
						<form ref="form">
							<div className="title"><Link to="/">Home</Link> / Sign in</div>
							{ this.state.err &&
								<div className="alert error">Sorry, but <strong>{ this.state.err }</strong></div>
							}
							<div className="form-control">
								<label>User name:</label>
								<input onChange={this.onChangeInput} type="text"/>
							</div>

							<div className="form-control">
								<label>Password:</label>
								<input onChange={this.onChangeInput} type="password"/>
							</div>

							<div className="form-control">
								<label className="checkbox">
									<input onChange={this.onChangeInput} type="checkbox"/>
									<span>Remember Me</span>
								</label>
							</div>

							<input className="button blue" type="submit" onClick={this.login} value="Sign in"/>
						
							<Link to="/signup" className="splink">Register a new profile</Link>
						</form>
					</div>
				</div>
				}
			</div>
		);
	}
}

export default connect()(Signin);
