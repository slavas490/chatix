import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import createHistory from 'history/createBrowserHistory'
import { Route, Switch, Redirect } from 'react-router'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import * as reducers from './reducers'
import * as components from './components'
import * as actions from './actions/'

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
			logined: true,
			_isLoaded: false
		}

		store.subscribe(() => {
			const _store = store.getState();

			this.setState({
				logined: _store.session.logined
			});
		});
	}

	componentWillMount () {
		fetch('/user/session/restore', {
			method: 'POST',
			credentials: "same-origin"
		})
		.then(out => out.json())
		.then(out => {
			if(!out.code){
				store.dispatch(actions.session.login());
			}
			this.setState({ _isLoaded: true });
		});
	}

	render() {
		const _store = store.getState();
		console.log(_store)
		return (
			<div style={{display: (this.state._isLoaded?'block':'none')}}>
				<Provider store={store}>
					<ConnectedRouter history={history}>
						<div>
							{ this.state._isLoaded && (
								this.state.logined ?
									<Switch>
										<Route component={components.Home} />
									</Switch>
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
							)}
						</div>
					</ConnectedRouter>
				</Provider>
			</div>
		)
	}
}

export default App
