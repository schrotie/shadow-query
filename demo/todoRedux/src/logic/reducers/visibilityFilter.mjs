// // Taken from https://redux.js.org/basics/exampletodolist /////
import {VisibilityFilters} from '../actions/index.mjs';

const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state;
	}
};

export default visibilityFilter;
