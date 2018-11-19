import ReduxConnector from './reduxConnector.mjs';
import {addTodo} from '../actions/index.mjs';

export class AddConnector extends ReduxConnector {
	constructor(node) {
		super(node);
		this.dispatcher('add', evt => evt.detail && addTodo(evt.detail));
	}
}
