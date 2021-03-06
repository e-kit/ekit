/**
 * @file: 局部 model with immer
 */

import factory, { Reducers } from '@ekit/model-factory';
import { HooksModelEffects } from './types';

/**
 * Model工厂
 * @param model
 * @param model.namespace 命令空间
 * @param model.state 初始状态
 * @param model.reducers 推导reducers和同步actions
 * @param model.effects 副作用，推导异步actions
 */
export function Model<M, R extends Reducers<M>, E extends HooksModelEffects>(model: {
  /** 命令空间，区分日志使用 */
  namespace: string;
  /** 初始状态 */
  state: M;
  reducers: R;
  effects: E;
}) {
  return factory(model);
}

export const M = Model;
