import { bindActionCreators } from 'redux';
import { handleActions, createAction, Action } from 'src/actions';

export interface Store {
  username: string;
}

export const initialStore: Store = {
  username: ''
};

export const action: Action<Store> = {
  type: 'SET_USERNAME',
  payload: { username: 'string' }
};

export const doSetUerName = (username: Store['username']) =>
  createAction(action.type, { username });

export const reducer = handleActions(
  {
    [action.type]: (state: Store, action: Action<Store>) => {
      return {
        ...state,
        username: action.payload.username
      };
    }
  },
  initialStore
);

export const actions = bindActionCreators({ doSetUerName }, () => action as any);

export const doNewSetUerName: typeof actions.doSetUerName = (username: string) => ({
  ...action,
  payload: { username }
});
