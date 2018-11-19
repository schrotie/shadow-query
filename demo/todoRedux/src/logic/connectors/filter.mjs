import {setVisibilityFilter} from '../actions/index.mjs';
import ReduxConnector from './reduxConnector.mjs';

export class FilterConnector extends ReduxConnector {
	constructor(node) {
		super(node);
		this.binding({path:'visibilityFilter', operation: 'prop', key:'filter'});
		this.dispatcher('filter', evt => setVisibilityFilter(evt.detail));
	}
}
