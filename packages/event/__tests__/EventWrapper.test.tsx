import React from 'react';
import { mount } from 'enzyme';

import { EventCenter } from 'src/event';
import EventWrapper, { IEventWrapperProps } from 'src/EventWrapper';

describe('event/EventWrapper', () => {
  describe('event/EventWrapper', () => {
    it('subscribe works ok', () => {
      const mes = {};
      const callback = jest.fn(() => null);
      const ref = jest.fn(() => null);
      type TestRenderProps = IEventWrapperProps & { callback: () => any };
      const TestRender = class extends React.Component<TestRenderProps> {
        constructor(props: TestRenderProps) {
          super(props);
          expect(props.on).toBeInstanceOf(Function);
          expect(props.once).toBeInstanceOf(Function);
          expect(props.emit).toBeInstanceOf(Function);
          props.on('test', callback);
        }
        render() {
          return null;
        }
      };
      const CP = EventWrapper(TestRender);
      const tree = mount(<CP callback={callback} ref={ref} />);
      callback.mockClear();
      EventCenter.emit('test', mes);
      expect(callback).toBeCalledWith(mes);
      expect(callback).toBeCalledTimes(1);
      expect(ref).toBeCalledTimes(1);

      callback.mockClear();
      tree.unmount();
      EventCenter.emit('test', mes);
      expect(callback).toBeCalledTimes(0);
    });
  });
});
