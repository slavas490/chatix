import * as actions from '../actions/'

const defaultState = {
	logined: false
}

const session = (state = defaultState, action) => {
	switch (action.type) {
		case actions.session.LOGIN:
			console.log(1)
			return {...state, logined: true}
		case actions.session.LOGOUT:
			return {...state, logined: false}
		default:
			return state
	}
}

export default session