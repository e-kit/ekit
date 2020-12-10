import { action } from 'typesafe-actions';

export const createAction = action;
export * from 'redux-actions';
export { Action } from 'redux-actions';
export interface ActionWithPayload<P> {
  type: string;
  payload: P;
}
