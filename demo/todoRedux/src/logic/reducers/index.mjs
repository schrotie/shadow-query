// // Taken from https://redux.js.org/basics/exampletodolist /////
import {combineReducers} from '../../../node_modules/redux/es/redux.mjs';

import todos from './todos.mjs';
import visibilityFilter from './visibilityFilter.mjs';

export default combineReducers({
	todos,
	visibilityFilter,
});
