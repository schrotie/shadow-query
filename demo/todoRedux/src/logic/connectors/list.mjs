import {toggleTodo} from '../actions/index.mjs';
import ReduxConnector from './reduxConnector.mjs';

export class ListConnector extends ReduxConnector {
	constructor(node) {
		super(node);
		this.binding({path:this._getList, operation: 'prop', key:'list'});
		this.dispatcher('toggle', evt => toggleTodo(evt.detail));
	}

	_getList(state) {
		switch (state.visibilityFilter) {
			case 'SHOW_ALL':       return state.todos;
			case 'SHOW_COMPLETED': return state.todos.filter(t => t.completed);
			case 'SHOW_ACTIVE':    return state.todos.filter(t => !t.completed);
			default: throw new Error('Unknown filter: ' + state.visibilityFilter);
		}
	}
}
