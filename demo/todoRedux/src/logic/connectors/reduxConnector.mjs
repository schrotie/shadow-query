import rootReducer from '../reducers/index.mjs';
import {createStore} from '../../../node_modules/redux/es/redux.mjs';

const store = createStore(rootReducer);

export class ReduxConnector {
	constructor(node) {this._$node = node;}

	binding(binding) {
		if(!this._storeToEl) {
			this._storeToEl = [binding];
			store.subscribe(this._onStore.bind(this));
		}
		else this._storeToEl.push(binding);
	}

	dispatcher(evt, action) {
		this._$node.on(evt, evt => {
			const act = action(evt);
			if(act) store.dispatch(act);
		});
	}

	_onStore() {
		if(!this._storeToEl) return;
		const state = store.getState();
		for(let binding of this._storeToEl) {
			this._$node[binding.operation](
				binding.key, this.getPath(binding.path, state)
			);
		}
	}

	getPath(path, state = store.getState()) {
		if(typeof(path) === 'function') return path.call(this, state);
		if(typeof(path) === 'string') path = path.split('.');
		state = state[path[0]];
		return (path.length > 1) ? this.getPath(path.slice(1), state) : state;
	}
}

export default ReduxConnector;
