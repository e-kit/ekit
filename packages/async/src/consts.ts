/**
 * @author: yangqianjun
 * @file: async常量
 * @Date: 2019-09-11 11:02:36
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-07 15:44:31
 */

import { ASYNC_EFFECT_EVENT_NAME as AEE } from '@ekit/model-factory';
import { AsyncModelType } from './asyncModel';

export const ASYNC_EFFECT_EVENT_NAME = AEE;
export interface AsyncEffectEventType {
  type: keyof AsyncModelType['actions'];
  payload: any;
}

export const ASYNC_RESULT_EVENT_NAME = 'ASYNC_RESULT_EVENT_NAME';
export interface AsyncResultEventType {
  /**
   * 副作用信息类型
   */
  type: 'error' | 'success';
  /**
   * 副作用提示信息
   */
  message: React.ReactNode;
}

/** 异步队列变化事件 */
export const ASYNC_STATUS_CHANGE_NAME = 'ASYNC_STATUS_CHANGE_NAME';
