import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import createHistory from 'history/createBrowserHistory'
import { Route, Switch, Redirect } from 'react-router'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import * as reducers from './reducers'
import * as components from './components'
import * as action from './actions/'

import { Link } from 'react-router-dom'


const history = createHistory()

const middleware = routerMiddleware(history)

const store = createStore(
	combineReducers({
		...reducers,
		router: routerReducer
	}),
	applyMiddleware(middleware)
)


class App extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			logined: false
		}

		store.subscribe(() => {
			const _store = store.getState();

			this.setState({
				logined: _store.session.logined
			})
		});
	}

	render() {
		const _store = store.getState();
		console.log(_store)
		return (
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<div>
						{
							this.state.logined ?
								<components.Home />
							:
								<div>
									<Switch>
										<Route exact path="/" component={components.HomeLanding} />
										<Route path="/signin" component={components.Signin} />
										<Route path="/signup" component={components.Signup} />
										<Route path="*" children={() => (
											<Redirect to="/"/>
										)}/>
									</Switch>
								</div>
						}
					</div>
				</ConnectedRouter>
			</Provider>
		)
	}
}

export default App
