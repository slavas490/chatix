import React from 'react'

import createHistory from 'history/createBrowserHistory'
import { Route, Switch, Redirect } from 'react-router'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

class router extends React.Component {
	constructor(props){
        super(props);

		this.state = {
			logined: false
		}
	}

	render() {
        const url = this.props.match.url;
		return (
            <div>
                { url == "/api" ? <Redirect to="/signin"/> : "" }
			</div>
		)
	}
}

export default router
