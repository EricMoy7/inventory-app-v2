import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import authReducer from './reducers/authReducer';
import importHeaderReducer from './reducers/importHeaderReducer';
import importDataReducer from './reducers/importDataReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  import: importHeaderReducer,
  importData: importDataReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof rootReducer>;

export default store;
