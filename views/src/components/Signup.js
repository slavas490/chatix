import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/'
import { Link } from 'react-router-dom'
import { Redirect, Router } from 'react-router'

class Signin extends Component {
	constructor(props){
        super(props);
        
        this.state = {
            login: false
        };

		this.dispatch = this.props.dispatch;
        this.register = this.register.bind(this);
        this.setError = this.setError.bind(this);
    }
    
    setError (value, code, params) {
        let _code = "";

        switch (code) {
            case 2: _code = "doesn't match"; break;
            case 3: _code = "is too short (minimum "+params.min+" symbols)"; break;
            case 4: _code = "is too long (maximum "+params.max+" symbols)"; break;
            case 5: _code = "already exist"; break;
            default:
                 _code = "doesn't specify";
        }

        let err = value ? value + " " + _code : "";

        this.setState({ err });
    }

	register(e){
        e.preventDefault();
        const form = this.refs.form;
        
        if(!form[0].value) {
            this.setError("first name"); // not specify
        }
        else if(!form[1].value) {
            this.setError("last name");
        }
        else if(!form[2].value) {
            this.setError("user name");
        }
        else if(!form[3].value) {
            this.setError("password");
        }
            else if(form[3].value !== form[4].value) {
                this.setError("passwords", 2); // not match
            }
            else if(form[3].value.length<6) {
                this.setError("password", 3, { min: 6 } );
            }
            else if(form[3].value.length>32) {
                this.setError("password", 4, { max: 32 } );
            }
        else{
            this.setError();

            fetch('/user/account/create', {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    firstName: form[0].value,
                    lastName: form[1].value,
                    username: form[2].value,
                    pass: form[3].value
                }),
                credentials: "same-origin"
            })
            .then(out => out.json())
            .then(out => {
                if(!out.code) {
                    this.setState({ login: true })
                    this.dispatch(actions.session.login())
                }
                else {
                    if(out.code == 10) {
                        this.setError("user name (login)", 5);
                    }
                }
            });
        }
    }

	render() {
		return (
            <div>
                { this.state.login
                    ?
                <Redirect to="/"/>
                    :
                <div className="Signup">
                    <div className="container">
                        <form ref="form">
                            <div className="title"><Link to="/">Home</Link> / Sign up</div>
                            { this.state.err &&
                                <div className="alert error">Sorry, but <strong>{ this.state.err }</strong></div>
                            }
                            <div className="form-control">
                                <label>First name:</label>
                                <input type="text"/>
                            </div>

                            <div className="form-control">
                                <label>Last name:</label>
                                <input type="text"/>
                            </div>

                            <div className="form-control">
                                <label>User name (login):</label>
                                <input type="text"/>
                            </div>

                            <div className="form-control">
                                <label>Password:</label>
                                <input type="password"/>
                            </div>

                            <div className="form-control">
                                <label>Confirm password:</label>
                                <input type="password"/>
                            </div>

                            <input className="button blue" type="submit" onClick={this.register} value="Sign up"/>
                        
                            <Link to="/signin" className="splink">Already have an exists profile?</Link>
                        </form>
                    </div>
                </div>
                }
            </div>
		);
	}
}

export default connect()(Signin);
