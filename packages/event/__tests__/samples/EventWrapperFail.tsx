import React from 'react';
import EventWrapper from 'src/index';
import TestRender from './EventWrapperOK';

export const CP = EventWrapper(TestRender);
export const renderJSX = () => <CP callback={() => void 0} on={() => void 0} />;
