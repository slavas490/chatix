import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
	constructor(props){
		super(props);

		this.dispatch = this.props.dispatch;
		this.funct = this.funct.bind(this)
	}

	funct(){
		this.dispatch({ type: "LOGOUT" })
	}

	render() {
		return (
			<div>
				<button onClick={this.funct}>HOME</button>
			</div>
		);
	}
}

export default connect()(Home);
