/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { EventCenter } from './event';

export interface IEventProps {
  on: Callback;
  once: Callback;
  emit: Emit;
}

// own props
export interface IEventWrapperProps extends React.Props<any>, IEventProps {}

interface IEventWrapperHOCProps<P = React.SFC | React.ComponentClass> {
  /** 被装饰的组件 */
  Cp: P;
  /** 被装饰组件的Props */
  originProps: any;
  _ref?: ((instance: unknown) => void) | React.MutableRefObject<unknown> | null;
}

type Callback = (/** 请使用 namespace:eventName 格式命名事件 */ event: string, info: any) => any;
type Emit = (/** 请使用 namespace:eventName 格式命名事件 */ event: string, info: any) => any;

/** 容器组件 */
export class EventWrapper extends React.PureComponent<IEventWrapperHOCProps> {
  public observerList: any[];
  public on: Callback;
  public once: Callback;
  public emit: Emit;
  public constructor(props: IEventWrapperHOCProps) {
    super(props);
    this.observerList = [];
    this.on = (event: string, callback: Callback) => {
      EventCenter.on(event, callback);
      const observer = () => EventCenter.removeListener(event, callback);
      this.observerList.push(observer);
      return observer;
    };
    this.once = (event: string, callback: Callback) => {
      EventCenter.once(event, callback);
      const observer = () => EventCenter.removeListener(event, callback);
      this.observerList.push(observer);
      return observer;
    };
    this.emit = (event: string, info: any) => {
      EventCenter.emit(event, info);
    };
  }

  public componentWillUnmount() {
    this.observerList.forEach((observer) => observer());
  }

  public render() {
    const { Cp, originProps, _ref } = this.props;
    return <Cp ref={_ref} {...originProps} on={this.on} once={this.once} emit={this.emit} />;
  }
}
/** 事件容器高阶组件 */
export default function EventWrapperDecorator<P = {}>(Cp: React.ComponentType<P>) {
  return React.forwardRef((props, ref) => {
    return <EventWrapper Cp={Cp} originProps={props} _ref={ref} />;
  }) as React.ComponentType<Omit<P, keyof IEventProps>>;
}
