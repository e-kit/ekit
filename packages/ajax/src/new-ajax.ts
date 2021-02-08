import qs from 'qs';
import axios from 'axios';
import axiosInst, { onStatusError, emptyFunc } from './axios';
import { promiseFactory } from './consts';

/** 不再兼容非标准的数据结构 */
export declare type AjaxPromise<R> = Promise<R>;
/** 非标准包裹 */
export declare type NonStandardAjaxPromise<R> = Promise<{
  code?: number;
  message?: string;
  result: R;
}>;

export interface ExtraFetchParams {
  /** extra data for extends */
  extra?: any;
  /** 扩展请求头 */
  headers?: any;
  /** cancel request */
  cancel?: Promise<string | undefined>;
}

export interface WrappedFetchParams extends ExtraFetchParams {
  /** http method */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'HEAD';
  url: string;
  /** post json data */
  data?: any;
  /** post form data */
  form?: any;
  /** query data */
  query?: any;
  /** header */
  header?: any;
  /** path data */
  path?: any;
}
const testUser =
  typeof location !== 'undefined' && qs.parse(location.search.split('?')[1]).testUser;
export class WrappedFetch {
  /** ajax 方法 */
  public ajax = (
    { method, url, data, form, query, header, extra, cancel, headers }: WrappedFetchParams,
    _path?: string,
    _basePath?: string
  ) => {
    let config = {
      ...extra,
      method: method.toLowerCase(),
      headers: { ...headers, ...header },
    };
    if (testUser) {
      config.headers['Test-User'] = testUser;
    }
    // json
    if (data) {
      config = {
        ...config,
        headers: {
          // 可覆盖
          'Content-Type': 'application/json',
          ...config.headers,
        },
        data,
      };
    }
    // form
    if (form) {
      config = {
        ...config,
        headers: {
          // 可覆盖
          'Content-Type': 'application/x-www-form-urlencoded',
          ...config.headers,
        },
        data:
          config.headers && config.headers['Content-Type'] === 'multipart/form-data'
            ? form
            : qs.stringify(form),
      };
    }
    const [{ resolve: cancelRequest }, internalCancel] = promiseFactory<string>();
    config.cancelToken = new axios.CancelToken((c) => {
      // 外部
      cancel && cancel.then(c, emptyFunc);
      // 内部自动取消
      internalCancel.then(c, emptyFunc);
    });
    let prom: Promise<any> = axiosInst
      .request({
        ...config,
        url: testUser
          ? url.indexOf('?') === -1
            ? `${url}?testUser=${testUser}`
            : url.replace('?', () => `?testUser=${testUser}`)
          : url,
        params: query,
      })
      .then((res) => res.data);
    if (this.autoCatch) {
      prom = prom.catch(typeof this.autoCatch === 'function' ? this.autoCatch : onStatusError);
    }
    // IMP: 修复 tkit/service 设计上的硬伤
    prom['cancel'] = cancelRequest;
    return prom as Promise<any>;
  };

  /** 接口传参校验 */
  public check<V>(value: V, name: string) {
    if (value === null || value === undefined) {
      const msg = `[ERROR PARAMS]: ${name} can't be null or undefined`;
      // 非生产环境，直接抛出错误
      if (process.env.NODE_ENV === 'development') {
        throw Error(msg);
      }
    }
  }

  /**
   * 是否默认 catch ajax 错误，默认开启，设置为 false，关闭 catch，支持配置成函数，替代默认的 onStatusError
   */
  public autoCatch: boolean | typeof onStatusError = true;
}

export default new WrappedFetch();
