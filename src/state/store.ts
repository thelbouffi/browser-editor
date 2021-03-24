import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducers, {RootState} from './reducers';

export const store = createStore(reducers,{}, applyMiddleware(thunk));

