import React from 'react';
import EventWrapper, { IEventWrapperProps } from 'src/index';

export interface ITestRenderProps {
  callback: () => any;
}
export type TestRenderProps = ITestRenderProps & IEventWrapperProps;

export default class TestRender extends React.Component<TestRenderProps> {
  constructor(props: TestRenderProps) {
    super(props);
    expect(props.on).toBeInstanceOf(Function);
    expect(props.once).toBeInstanceOf(Function);
    expect(props.emit).toBeInstanceOf(Function);
    props.on('test', props.callback);
  }
  render() {
    return null;
  }
}

export const CP = EventWrapper<ITestRenderProps>(TestRender);
export const renderJSX = () => <CP callback={() => void 0} />;
