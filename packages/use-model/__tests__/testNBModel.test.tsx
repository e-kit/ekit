/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useModel, MM, Tction } from 'src/index';

const originalLogError = console.error;

const genAssets = () => {
  const logsArr: string[] = [];
  const logger = jest.fn((log: string) => {
    logsArr.push(log);
  });
  console.error = jest.fn((...args: any[]) => {
    logger(args[0]);
    return originalLogError.apply(console, args);
  });
  const UserMMNBModel = MM({
    namespace: 'test',
    state: {
      username: ''
    },
    reducers: {
      doRename: (state, action: Tction<{ username: string }>) => {
        state.username = action.payload.username;
      }
    },
    effects: {
      async doNameOK(utils, action: Tction<string>) {
        await new Promise(rs => setTimeout(rs, 50));
        logger(`doNameOK: ${action.payload}`);
        return `OK doNameOK: ${action.payload}`;
      },
      async doNameERROR(utils, action: Tction<string>) {
        await new Promise(rs => setTimeout(rs, 50));
        logger(`doNameERROR: ${action.payload}`);
        throw `ERROR doNameERROR: ${action.payload}`;
      },
      async doNonBlockingOK_NonBlockingERROR(utils, action: Tction<string>) {
        let res: any = await utils.tNBPut(UserMMNBModel.actions.doNameOK, `${action.payload} -1`);
        logger(`doNameOK: ${action.payload} 1 ${JSON.stringify(res)}`);
        res = await utils.tNBPut(UserMMNBModel.actions.doNameERROR, `${action.payload} -1`);
        logger(`doNameERROR: ${action.payload} 2 ${JSON.stringify(res)}`);
        return `OK: doNonBlockingOK_NonBlockingERROR`;
      },
      async doNonBlockingOK_NonBlockingERROR_ERROR(utils, action: Tction<string>) {
        let res: any = await utils.tNBPut(UserMMNBModel.actions.doNameOK, `${action.payload} -1`);
        logger(`doNameOK: ${action.payload} ${JSON.stringify(res)} 1`);
        res = await utils.tNBPut(UserMMNBModel.actions.doNameERROR, `${action.payload} -1`);
        logger(`doNameERROR: ${action.payload} ${JSON.stringify(res)} 2`);
        throw `ERROR: doNonBlockingOK_NonBlockingERROR_ERROR`;
      },
      async doNonBlockingOK_BlockingERROR(utils, action: Tction<string>) {
        let res: any = await utils.tNBPut(UserMMNBModel.actions.doNameOK, `${action.payload} 2`);
        logger(`doNameOK: ${action.payload} ${JSON.stringify(res)} 1`);
        res = await utils.tPut(UserMMNBModel.actions.doNameERROR, `${action.payload} 3`);
        logger(`doNameERROR: ${action.payload} ${JSON.stringify(res)} -1`);
      },
      async doBlockingOK_BlockingERROR(utils, action: Tction<string>) {
        let res: any = await utils.tPut(UserMMNBModel.actions.doNameOK, `${action.payload} 1`);
        logger(`doNameOK: ${action.payload} ${JSON.stringify(res)} 2`);
        res = await utils.tPut(UserMMNBModel.actions.doNameERROR, `${action.payload} 3`);
        logger(`doNameERROR: ${action.payload} ${JSON.stringify(res)} -1`);
      },
      async doBlockingOK_NonBlockingERROR(utils, action: Tction<string>) {
        let res: any = await utils.tPut(UserMMNBModel.actions.doNameOK, `${action.payload} 1`);
        logger(`doNameERROR: ${action.payload} ${JSON.stringify(res)} 2`);
        res = await utils.tNBPut(UserMMNBModel.actions.doNameERROR, `${action.payload} 4`);
        logger(`doNameERROR: ${action.payload} ${JSON.stringify(res)} 3`);
      }
    }
  });
  return {
    logger,
    logsArr,
    model: UserMMNBModel
  };
};

let assets: ReturnType<typeof genAssets>;

describe('utils/*Model work ok', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    assets = genAssets();
    window.__TKIT_USE_MODEL_LOGGER__ = jest.fn((...args) => {
      assets.logger(`devtool watched action: ${JSON.stringify(args[3])}`);
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null as any;
  });

  // checked
  1 &&
    it('useModel doNonBlockingOK_NonBlockingERROR work ok', async () => {
      let prom: any;
      const Cp = () => {
        const [store, localActions] = useModel(assets.model);
        return (
          <button
            onClick={() => {
              prom = localActions
                .doNonBlockingOK_NonBlockingERROR('doNonBlockingOK_NonBlockingERROR')
                .then(
                  res => {
                    //
                    assets.logger(`Promise OK: ${res}`);
                  },
                  e => {
                    //
                    assets.logger(`Promise ERROR: ${(e && e['message']) || e}`);
                  }
                );
            }}
          >
            {store.username}
          </button>
        );
      };
      act(() => {
        ReactDOM.render(<Cp />, container);
      });

      const button = container.querySelector('button') as HTMLButtonElement;
      act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      // @cc: 预估的 10ms delay，直到 effect 被调用
      await new Promise(rs => setTimeout(rs, 10));
      await prom;
      await new Promise(rs => setTimeout(rs, 100));
      expect(assets.logsArr).toMatchSnapshot('doNonBlockingOK_NonBlockingERROR');
      expect(assets.logger).toBeCalledTimes(16);
      expect(assets.logsArr).toHaveLength(16);
    });

  // checked
  1 &&
    it('useModel doNonBlockingOK_NonBlockingERROR_ERROR work ok', async () => {
      let prom: any;
      const Cp = () => {
        const [store, localActions] = useModel(assets.model);
        return (
          <button
            onClick={() => {
              prom = localActions
                .doNonBlockingOK_NonBlockingERROR_ERROR('doNonBlockingOK_NonBlockingERROR_ERROR')
                .then(
                  res => {
                    //
                    assets.logger(`Promise OK: ${res}`);
                  },
                  e => {
                    //
                    assets.logger(`Promise ERROR: ${(e && e['message']) || e}`);
                  }
                );
            }}
          >
            {store.username}
          </button>
        );
      };
      act(() => {
        ReactDOM.render(<Cp />, container);
      });

      const button = container.querySelector('button') as HTMLButtonElement;
      act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      // @cc: 预估的 10ms delay，直到 effect 被调用
      await new Promise(rs => setTimeout(rs, 10));
      await prom;
      await new Promise(rs => setTimeout(rs, 100));
      expect(assets.logsArr).toMatchSnapshot('doNonBlockingOK_NonBlockingERROR_ERROR');
      expect(assets.logsArr).toHaveLength(18);
      expect(assets.logger).toBeCalledTimes(18);
    });

  // checked
  1 &&
    it('useModel doNonBlockingOK_BlockingERROR work ok', async () => {
      let prom: any;
      const Cp = () => {
        const [store, localActions] = useModel(assets.model);
        return (
          <button
            onClick={() => {
              prom = localActions
                .doNonBlockingOK_BlockingERROR('doNonBlockingOK_BlockingERROR')
                .then(
                  res => {
                    //
                    assets.logger(`Promise OK: ${res}`);
                  },
                  e => {
                    //
                    assets.logger(`Promise ERROR: ${(e && e['message']) || e}`);
                  }
                )
                .catch();
            }}
          >
            {store.username}
          </button>
        );
      };
      act(() => {
        ReactDOM.render(<Cp />, container);
      });

      const button = container.querySelector('button') as HTMLButtonElement;
      act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      // @cc: 预估的 10ms delay，直到 effect 被调用
      await new Promise(rs => setTimeout(rs, 10));
      await prom;
      await new Promise(rs => setTimeout(rs, 100));
      expect(assets.logsArr).toMatchSnapshot('doNonBlockingOK_BlockingERROR');
      expect(assets.logsArr).toHaveLength(14);
      expect(assets.logger).toBeCalledTimes(14);
    });

  // checked
  1 &&
    it('useModel doBlockingOK_BlockingERROR work ok', async () => {
      let prom: any;
      const Cp = () => {
        const [store, localActions] = useModel(assets.model);
        return (
          <button
            onClick={() => {
              prom = localActions.doBlockingOK_BlockingERROR('doBlockingOK_BlockingERROR').then(
                res => {
                  //
                  assets.logger(`Promise OK: ${res}`);
                },
                e => {
                  //
                  assets.logger(`Promise ERROR: ${(e && e['message']) || e}`);
                }
              );
            }}
          >
            {store.username}
          </button>
        );
      };
      act(() => {
        ReactDOM.render(<Cp />, container);
      });

      const button = container.querySelector('button') as HTMLButtonElement;
      act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      // @cc: 预估的 10ms delay，直到 effect 被调用
      await new Promise(rs => setTimeout(rs, 10));
      await prom;
      await new Promise(rs => setTimeout(rs, 100));
      expect(assets.logsArr).toMatchSnapshot('doBlockingOK_BlockingERROR');
      expect(assets.logsArr).toHaveLength(12);
      expect(assets.logger).toBeCalledTimes(12);
    });

  // checked
  1 &&
    it('useModel doBlockingOK_NonBlockingERROR work ok', async () => {
      let prom: any;
      const Cp = () => {
        const [store, localActions] = useModel(assets.model);
        return (
          <button
            onClick={() => {
              prom = localActions
                .doBlockingOK_NonBlockingERROR('doBlockingOK_NonBlockingERROR')
                .then(
                  res => {
                    //
                    assets.logger(`Promise OK: ${res}`);
                  },
                  e => {
                    //
                    assets.logger(`Promise ERROR: ${(e && e['message']) || e}`);
                  }
                );
            }}
          >
            {store.username}
          </button>
        );
      };
      act(() => {
        ReactDOM.render(<Cp />, container);
      });

      const button = container.querySelector('button') as HTMLButtonElement;
      act(() => {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      // @cc: 预估的 10ms delay，直到 effect 被调用
      await new Promise(rs => setTimeout(rs, 10));
      await prom;
      await new Promise(rs => setTimeout(rs, 100));
      expect(assets.logsArr).toMatchSnapshot('doBlockingOK_NonBlockingERROR');
      expect(assets.logsArr).toHaveLength(14);
      expect(assets.logger).toBeCalledTimes(14);
    });
});
