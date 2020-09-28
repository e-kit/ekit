import { action } from 'typesafe-actions';

// @fix: 解决由于 reselect 一份 cache 造成的 actions 更新的问题
export const createAction = action;
export * from 'redux-actions';
export { handleActions, Action } from 'redux-actions'; // @fix ts2742 in createModel.ts by export * from 'redux-actions'
export interface ActionWithPayload<P> {
  type: string;
  payload: P;
}
