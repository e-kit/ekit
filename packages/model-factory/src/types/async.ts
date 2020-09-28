/** 从 @ekit/async 拆分过来 */
export interface IAsyncConfirmedMsg {
  fetch: any;
  errorMsg?: any;
  successMsg?: any;
  indicator?: React.ReactNode;
  channel?: string;
  effectName?: string;
}
