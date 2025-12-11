import { NgDocPage } from '@ng-doc/core';
import SignalsCategory from '../../ng-doc.category';
import { WebSocketSignalDemoComponent } from './demo/websocket-signal-demo.component';

const WebSocketSignalPage: NgDocPage = {
    title: 'WebSocket Signal',
    mdFile: './index.md',
    category: SignalsCategory,
    demos: { WebSocketSignalDemoComponent },
};

export default WebSocketSignalPage;
