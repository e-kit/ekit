import { action } from 'typesafe-actions';

// @fix: 解决由于 reselect 一份 cache 造成的 actions 更新的问题
export const createAction = action;
export * from 'redux-actions';
export { Action } from 'redux-actions';
export interface ActionWithPayload<P> {
  type: string;
  payload: P;
}
