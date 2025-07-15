import { NgDocPage } from '@ng-doc/core';
import ServicesCategory from '../../ng-doc.category';
import { EventServiceDemoComponent } from './demo/event-service-demo.component';

const EventService: NgDocPage = {
  title: 'Event Service',
  mdFile: './index.md',
  category: ServicesCategory,
  demos: {
    EventServiceDemoComponent,
  },
};

export default EventService;
