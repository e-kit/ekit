/* eslint-disable @typescript-eslint/camelcase */
import {
  createStore,
  applyMiddleware,
  Store,
  Middleware,
  Dispatch,
  bindActionCreators,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { CM, Tction, promiseMiddleware, tPut, tNBPut } from 'src/index';

export interface IUserState {}

export const userModelState: IUserState = {};

const genModel = (logger: jest.Mock) => {
  logger.mockClear();
  const model = CM({
    state: userModelState,
    namespace: 'userModel',
    reducers: {},
    effects: {
      *doGenBaseEffectOK(utils, action: Tction<string>): Iterator<{}, any, any> {
        yield new Promise((rs) => setTimeout(() => rs(), 50));
        logger(`doGenBaseEffectOK: ${action.payload}`);
        return `OK doGenBaseEffectOK: ${action.payload}`;
      },
      *doGenBaseEffectError(utils, action: Tction<string>): Iterator<{}, any, any> {
        yield new Promise((rs) => setTimeout(() => rs(), 50));
        logger(`doGenBaseEffect: ${action.payload}`);
        throw `ERROR doGenBaseEffectError: ${action.payload}`;
      },
      async doAsyncBlockingaseEffectOK(utils, action: Tction<string>) {
        await new Promise((rs) => setTimeout(() => rs(), 50));
        logger(`doAsyncBlockingaseEffectOK: ${action.payload}`);
        return `OK doAsyncBlockingaseEffectOK: ${action.payload}`;
      },
      async doAsyncBlockingaseEffectError(utils, action: Tction<string>) {
        await new Promise((rs) => setTimeout(() => rs(), 50));
        logger(`doAsyncBlockingaseEffectError: ${action.payload}`);
        throw `ERROR doAsyncBlockingaseEffectError: ${action.payload}`;
      },
      // Async call Async
      async doNonBlockingOK_BlockingERROR({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncNBPut(
          model.actions.doAsyncBlockingaseEffectOK,
          `${action.payload} 2`
        );
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = await asyncPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} 3`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} -1 ${JSON.stringify(res)}`);
      },
      async doNonBlockingERROR_BlockingOK({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncNBPut(
          model.actions.doAsyncBlockingaseEffectError,
          `${action.payload} 2`
        );
        logger(`doAsyncBlockingaseEffectError: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = await asyncPut(model.actions.doAsyncBlockingaseEffectOK, `${action.payload} 3`);
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 4 ${JSON.stringify(res)}`);
      },
      async doBlockingOK_NonBlockingERROR({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncPut(
          model.actions.doAsyncBlockingaseEffectOK,
          `${action.payload} 1`
        );
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 2 ${JSON.stringify(res)}`);
        res = await asyncNBPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} -1`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} 3 ${JSON.stringify(res)}`);
      },
      async doBlockingOK_BlockingERROR({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncPut(
          model.actions.doAsyncBlockingaseEffectOK,
          `${action.payload} 1`
        );
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 2 ${JSON.stringify(res)}`);
        res = await asyncPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} 3`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} -1 ${JSON.stringify(res)}`);
      },
      async doNonBlockingOK_NonBlockingERROR({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncNBPut(
          model.actions.doAsyncBlockingaseEffectOK,
          `${action.payload} -1`
        );
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = await asyncNBPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} -1`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} 2 ${JSON.stringify(res)}`);
        return res;
      },
      async doNonBlockingOK_NonBlockingERROR_ERROR(
        { asyncNBPut, asyncPut },
        action: Tction<string>
      ) {
        let res: any = await asyncNBPut(
          model.actions.doAsyncBlockingaseEffectOK,
          `${action.payload} -1`
        );
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = await asyncNBPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} -1`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} 2 ${JSON.stringify(res)}`);
        throw 'ERROR: doNonBlockingOK_NonBlockingERROR_ERROR';
      },
      // Async call Generator
      async doGenNBOK_BlockingERROR({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncNBPut(model.actions.doGenBaseEffectOK, `${action.payload} 2`);
        logger(`doGenBaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = await asyncPut(model.actions.doGenBaseEffectError, `${action.payload} 3`);
        logger(`doGenBaseEffectError: ${action.payload} -1 ${JSON.stringify(res)}`);
      },
      async doGenNBERROR_BlockingOK({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncNBPut(model.actions.doGenBaseEffectError, `${action.payload} 2`);
        logger(`doGenBaseEffectError: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = await asyncPut(model.actions.doGenBaseEffectOK, `${action.payload} 3`);
        logger(`doGenBaseEffectOK: ${action.payload} 4 ${JSON.stringify(res)}`);
      },
      async doGenBlockingOK_NonBlockingERROR({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncPut(model.actions.doGenBaseEffectOK, `${action.payload} 1`);
        logger(`doGenBaseEffectOK: ${action.payload} 2 ${JSON.stringify(res)}`);
        res = await asyncNBPut(model.actions.doGenBaseEffectError, `${action.payload} -1`);
        logger(`doGenBaseEffectError: ${action.payload} 3 ${JSON.stringify(res)}`);
      },
      async doGenBlockingOK_BlockingERROR({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncPut(model.actions.doGenBaseEffectOK, `${action.payload} 1`);
        logger(`doGenBaseEffectOK: ${action.payload} 2 ${JSON.stringify(res)}`);
        res = await asyncPut(model.actions.doGenBaseEffectError, `${action.payload} 3`);
        logger(`doGenBaseEffectError: ${action.payload} -1 ${JSON.stringify(res)}`);
      },
      async doGenNBOK_NonBlockingERROR({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncNBPut(model.actions.doGenBaseEffectOK, `${action.payload} -1`);
        logger(`doGenBaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = await asyncNBPut(model.actions.doGenBaseEffectError, `${action.payload} -1`);
        logger(`doGenBaseEffectError: ${action.payload} 2 ${JSON.stringify(res)}`);
        return res;
      },
      async doGenNBOK_NonBlockingERROR_ERROR({ asyncNBPut, asyncPut }, action: Tction<string>) {
        let res: any = await asyncNBPut(model.actions.doGenBaseEffectOK, `${action.payload} -1`);
        logger(`doGenBaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = await asyncNBPut(model.actions.doGenBaseEffectError, `${action.payload} -1`);
        logger(`doGenBaseEffectError: ${action.payload} 2 ${JSON.stringify(res)}`);
        throw 'ERROR: doNonBlockingOK_NonBlockingERROR_ERROR';
      },
      // Generator call Generator
      *genNonBlockingOK_BlockingERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tNBPut(model.actions.doGenBaseEffectOK, `${action.payload} 2`);
        logger(`doGenBaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = yield tPut(model.actions.doGenBaseEffectError, `${action.payload} 3`);
        logger(`doGenBaseEffectError: ${action.payload} -1 ${JSON.stringify(res)}`);
      },
      *genNonBlockingERROR_BlockingOK(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tNBPut(model.actions.doGenBaseEffectError, `${action.payload} 2`);
        logger(`doGenBaseEffectError: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = yield tPut(model.actions.doGenBaseEffectOK, `${action.payload} 3`);
        logger(`doGenBaseEffectOK: ${action.payload} 4 ${JSON.stringify(res)}`);
      },
      *genBlockingOK_NonBlockingERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tPut(model.actions.doGenBaseEffectOK, `${action.payload} 1`);
        logger(`doGenBaseEffectOK: ${action.payload} 2 ${JSON.stringify(res)}`);
        res = yield tNBPut(model.actions.doGenBaseEffectError, `${action.payload} -1`);
        logger(`doGenBaseEffectError: ${action.payload} 3 ${JSON.stringify(res)}`);
      },
      *genBlockingOK_BlockingERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tPut(model.actions.doGenBaseEffectOK, `${action.payload} 1`);
        logger(`doGenBaseEffectOK: ${action.payload} 2 ${JSON.stringify(res)}`);
        res = yield tPut(model.actions.doGenBaseEffectError, `${action.payload} 3`);
        logger(`doGenBaseEffectError: ${action.payload} -1 ${JSON.stringify(res)}`);
      },
      *genNonBlockingOK_NonBlockingERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tNBPut(model.actions.doGenBaseEffectOK, `${action.payload} -1`);
        logger(`doGenBaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = yield tNBPut(model.actions.doGenBaseEffectError, `${action.payload} -1`);
        logger(`doGenBaseEffectError: ${action.payload} 2 ${JSON.stringify(res)}`);
        return res;
      },
      *genNonBlockingOK_NonBlockingERROR_ERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tNBPut(model.actions.doGenBaseEffectOK, `${action.payload} -1`);
        logger(`doGenBaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = yield tNBPut(model.actions.doGenBaseEffectError, `${action.payload} -1`);
        logger(`doGenBaseEffectError: ${action.payload} 2 ${JSON.stringify(res)}`);
        throw 'ERROR: doNonBlockingOK_NonBlockingERROR_ERROR';
      },
      // Generator call Async

      *genAsyncNonBlockingOK_BlockingERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tNBPut(
          model.actions.doAsyncBlockingaseEffectOK,
          `${action.payload} 2`
        );
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = yield tPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} 3`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} -1 ${JSON.stringify(res)}`);
      },
      *genAsyncNonBlockingERROR_BlockingOK(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tNBPut(
          model.actions.doAsyncBlockingaseEffectError,
          `${action.payload} 2`
        );
        logger(`doAsyncBlockingaseEffectError: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = yield tPut(model.actions.doAsyncBlockingaseEffectOK, `${action.payload} 3`);
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 4 ${JSON.stringify(res)}`);
      },
      *genAsyncBlockingOK_NonBlockingERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tPut(model.actions.doAsyncBlockingaseEffectOK, `${action.payload} 1`);
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 2 ${JSON.stringify(res)}`);
        res = yield tNBPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} -1`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} 3 ${JSON.stringify(res)}`);
      },
      *genAsyncBlockingOK_BlockingERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tPut(model.actions.doAsyncBlockingaseEffectOK, `${action.payload} 1`);
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 2 ${JSON.stringify(res)}`);
        res = yield tPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} 3`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} -1 ${JSON.stringify(res)}`);
      },
      *genAsyncNonBlockingOK_NonBlockingERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tNBPut(
          model.actions.doAsyncBlockingaseEffectOK,
          `${action.payload} -1`
        );
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = yield tNBPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} -1`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} 2 ${JSON.stringify(res)}`);
        return res;
      },
      *genAsyncNonBlockingOK_NonBlockingERROR_ERROR(
        { tNBPut, tPut },
        action: Tction<string>
      ): Iterator<{}, any, any> {
        let res: any = yield tNBPut(
          model.actions.doAsyncBlockingaseEffectOK,
          `${action.payload} -1`
        );
        logger(`doAsyncBlockingaseEffectOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = yield tNBPut(model.actions.doAsyncBlockingaseEffectError, `${action.payload} -1`);
        logger(`doAsyncBlockingaseEffectError: ${action.payload} 2 ${JSON.stringify(res)}`);
        throw 'ERROR: doNonBlockingOK_NonBlockingERROR_ERROR';
      },
    },
  });
  return model;
};

let store: Store;
let dispatch: Dispatch;
let sagaMiddleware: any;
let middlewares: Middleware[] = [];
let res: any;
let model: ReturnType<typeof genModel>;
let logsArr: string[];
let log: jest.Mock;
let logError: jest.Mock;
let actions: typeof model['actions'];
const originalLogError = console.error;

describe('createModel works ok', () => {
  beforeEach(() => {
    logsArr = [];
    const forceFakeNewLogsArr = logsArr;
    // IMP: 我不太明白，是 JavaScript 引擎还是编译器的问题，如果不声 forceFakeNewLogsArr，每个 it 会公用 logsArr
    log = jest.fn((log: string) => forceFakeNewLogsArr.push(log));

    // eslint-disable-next-line no-console
    logError = console.error = jest.fn((...args: any[]) => {
      log(args[0]);
      return originalLogError.apply(console, args);
    });
    model = genModel(log);
    sagaMiddleware = createSagaMiddleware();
    middlewares = [
      (store) => {
        const nextFunc = promiseMiddleware(store);
        return (next) => {
          return nextFunc((action) => {
            log(`middleWare watched action: ${JSON.stringify(action)}`);
            return next(action);
          });
        };
      },
      sagaMiddleware,
    ];
    store = createStore(model.reducers, {}, applyMiddleware(...middlewares));
    dispatch = store.dispatch;
    actions = bindActionCreators(model.actions, dispatch);
    sagaMiddleware.run(model.sagas, dispatch);
    res = undefined;
  });
  // checked
  1 &&
    it('doNonBlockingOK_BlockingERROR works ok', async () => {
      try {
        res = await actions.doNonBlockingOK_BlockingERROR('doNonBlockingOK_BlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(log).toBeCalledTimes(15);
      expect(logsArr).toHaveLength(15);
      expect(logsArr).toMatchSnapshot('doNonBlockingOK_BlockingERROR');
    });

  // checked
  1 &&
    it('doNonBlockingERROR_BlockingOK works ok', async () => {
      try {
        res = await actions.doNonBlockingERROR_BlockingOK('doNonBlockingERROR_BlockingOK 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(log).toBeCalledTimes(14);
      expect(logsArr).toHaveLength(14);
      expect(logsArr).toMatchSnapshot('doNonBlockingERROR_BlockingOK');
    });

  // checked
  1 &&
    it('doBlockingOK_NonBlockingERROR works ok', async () => {
      try {
        res = await actions.doBlockingOK_NonBlockingERROR('doBlockingOK_NonBlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(log).toBeCalledTimes(14);
      expect(logsArr).toHaveLength(14);
      expect(logsArr).toMatchSnapshot('doBlockingOK_NonBlockingERROR');
    });

  // checked
  1 &&
    it('doBlockingOK_BlockingERROR works ok', async () => {
      try {
        res = await actions.doBlockingOK_BlockingERROR('doBlockingOK_BlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(log).toBeCalledTimes(13);
      expect(logsArr).toHaveLength(13);
      expect(logsArr).toMatchSnapshot('doBlockingOK_BlockingERROR');
    });

  // checked
  1 &&
    it('doNonBlockingOK_NonBlockingERROR works ok', async () => {
      try {
        res = await actions.doNonBlockingOK_NonBlockingERROR('doNonBlockingOK_NonBlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(log).toBeCalledTimes(16);
      expect(logsArr).toHaveLength(16);
      expect(logsArr).toMatchSnapshot('doNonBlockingOK_NonBlockingERROR');
    });

  // checked
  1 &&
    it('doNonBlockingOK_NonBlockingERROR_ERROR works ok', async () => {
      try {
        res = await actions.doNonBlockingOK_NonBlockingERROR_ERROR(
          'doNonBlockingOK_NonBlockingERROR_ERROR 1'
        );
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(log).toBeCalledTimes(19);
      expect(logsArr).toHaveLength(19);
      expect(logsArr).toMatchSnapshot('doNonBlockingOK_NonBlockingERROR_ERROR');
    });

  /** Async call Generator */
  1 &&
    it('doGenNBOK_BlockingERROR works ok', async () => {
      try {
        res = await actions.doGenNBOK_BlockingERROR('doGenNBOK_BlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(log).toBeCalledTimes(15);
      expect(logsArr).toHaveLength(15);
      expect(logsArr).toMatchSnapshot('doGenNBOK_BlockingERROR');
    });

  // checked
  1 &&
    it('doGenNBERROR_BlockingOK works ok', async () => {
      try {
        res = await actions.doGenNBERROR_BlockingOK('doGenNBERROR_BlockingOK 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(log).toBeCalledTimes(14);
      expect(logsArr).toHaveLength(14);
      expect(logsArr).toMatchSnapshot('doGenNBERROR_BlockingOK');
    });

  // checked
  1 &&
    it('doGenBlockingOK_NonBlockingERROR works ok', async () => {
      try {
        res = await actions.doGenBlockingOK_NonBlockingERROR('doGenBlockingOK_NonBlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('doGenBlockingOK_NonBlockingERROR');
      expect(log).toBeCalledTimes(14);
      expect(logsArr).toHaveLength(14);
    });

  // checked
  1 &&
    it('doGenBlockingOK_BlockingERROR works ok', async () => {
      try {
        res = await actions.doGenBlockingOK_BlockingERROR('doGenBlockingOK_BlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('doGenBlockingOK_BlockingERROR');
      expect(log).toBeCalledTimes(13);
      expect(logsArr).toHaveLength(13);
    });

  // checked
  1 &&
    it('doGenNBOK_NonBlockingERROR works ok', async () => {
      try {
        res = await actions.doGenNBOK_NonBlockingERROR('doGenNBOK_NonBlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('doGenNBOK_NonBlockingERROR');
      expect(log).toBeCalledTimes(16);
      expect(logsArr).toHaveLength(16);
    });

  // checked
  1 &&
    it('doGenNBOK_NonBlockingERROR_ERROR works ok', async () => {
      try {
        res = await actions.doGenNBOK_NonBlockingERROR_ERROR('doGenNBOK_NonBlockingERROR_ERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('doGenNBOK_NonBlockingERROR_ERROR');
      expect(log).toBeCalledTimes(19);
      expect(logsArr).toHaveLength(19);
    });

  /** Generator call Generator */
  // checked
  1 &&
    it('genNonBlockingOK_BlockingERROR works ok', async () => {
      try {
        res = await actions.genNonBlockingOK_BlockingERROR('genNonBlockingOK_BlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genNonBlockingOK_BlockingERROR');
      expect(log).toBeCalledTimes(15);
      expect(logsArr).toHaveLength(15);
    });

  // checked
  1 &&
    it('genNonBlockingERROR_BlockingOK works ok', async () => {
      try {
        res = await actions.genNonBlockingERROR_BlockingOK('genNonBlockingERROR_BlockingOK 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genNonBlockingERROR_BlockingOK');
      expect(log).toBeCalledTimes(14);
      expect(logsArr).toHaveLength(14);
    });

  // checked
  1 &&
    it('genBlockingOK_NonBlockingERROR works ok', async () => {
      try {
        res = await actions.genBlockingOK_NonBlockingERROR('genBlockingOK_NonBlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genBlockingOK_NonBlockingERROR');
      expect(log).toBeCalledTimes(14);
      expect(logsArr).toHaveLength(14);
    });

  // checked
  1 &&
    it('genBlockingOK_BlockingERROR works ok', async () => {
      try {
        res = await actions.genBlockingOK_BlockingERROR('genBlockingOK_BlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genBlockingOK_BlockingERROR');
      expect(log).toBeCalledTimes(13);
      expect(logsArr).toHaveLength(13);
    });

  // checked
  1 &&
    it('genNonBlockingOK_NonBlockingERROR works ok', async () => {
      try {
        res = await actions.genNonBlockingOK_NonBlockingERROR(
          'genNonBlockingOK_NonBlockingERROR 1'
        );
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genNonBlockingOK_NonBlockingERROR');
      expect(log).toBeCalledTimes(16);
      expect(logsArr).toHaveLength(16);
    });

  // checked
  1 &&
    it('genNonBlockingOK_NonBlockingERROR_ERROR works ok', async () => {
      try {
        res = await actions.genNonBlockingOK_NonBlockingERROR_ERROR(
          'genNonBlockingOK_NonBlockingERROR_ERROR 1'
        );
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genNonBlockingOK_NonBlockingERROR_ERROR');
      expect(log).toBeCalledTimes(19);
      expect(logsArr).toHaveLength(19);
    });

  /** Generator call Async */
  // checked
  1 &&
    it('genAsyncNonBlockingOK_BlockingERROR works ok', async () => {
      try {
        res = await actions.genAsyncNonBlockingOK_BlockingERROR(
          'genAsyncNonBlockingOK_BlockingERROR 1'
        );
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genAsyncNonBlockingOK_BlockingERROR');
      expect(log).toBeCalledTimes(15);
      expect(logsArr).toHaveLength(15);
    });

  // checked
  1 &&
    it('genAsyncNonBlockingERROR_BlockingOK works ok', async () => {
      try {
        res = await actions.genAsyncNonBlockingERROR_BlockingOK(
          'genAsyncNonBlockingERROR_BlockingOK 1'
        );
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genAsyncNonBlockingERROR_BlockingOK');
      expect(log).toBeCalledTimes(14);
      expect(logsArr).toHaveLength(14);
    });

  // checked
  1 &&
    it('genAsyncBlockingOK_NonBlockingERROR works ok', async () => {
      try {
        res = await actions.genAsyncBlockingOK_NonBlockingERROR(
          'genAsyncBlockingOK_NonBlockingERROR 1'
        );
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genAsyncBlockingOK_NonBlockingERROR');
      expect(log).toBeCalledTimes(14);
      expect(logsArr).toHaveLength(14);
    });

  // checked
  1 &&
    it('genAsyncBlockingOK_BlockingERROR works ok', async () => {
      try {
        res = await actions.genAsyncBlockingOK_BlockingERROR('genAsyncBlockingOK_BlockingERROR 1');
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genAsyncBlockingOK_BlockingERROR');
      expect(log).toBeCalledTimes(13);
      expect(logsArr).toHaveLength(13);
    });

  // checked
  1 &&
    it('genAsyncNonBlockingOK_NonBlockingERROR works ok', async () => {
      try {
        res = await actions.genAsyncNonBlockingOK_NonBlockingERROR(
          'genAsyncNonBlockingOK_NonBlockingERROR 1'
        );
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genAsyncNonBlockingOK_NonBlockingERROR');
      expect(log).toBeCalledTimes(16);
      expect(logsArr).toHaveLength(16);
    });

  // checked
  1 &&
    it('genAsyncNonBlockingOK_NonBlockingERROR_ERROR works ok', async () => {
      try {
        res = await actions.genAsyncNonBlockingOK_NonBlockingERROR_ERROR(
          'genAsyncNonBlockingOK_NonBlockingERROR_ERROR 1'
        );
      } catch (e) {
        log((e && e['message']) || e);
        res = undefined;
      }
      log(JSON.stringify(res));
      await new Promise((rs) => setTimeout(rs, 100));
      expect(logsArr).toMatchSnapshot('genAsyncNonBlockingOK_NonBlockingERROR_ERROR');
      expect(log).toBeCalledTimes(19);
      expect(logsArr).toHaveLength(19);
    });
});
