import { NgDocPage } from '@ng-doc/core';
import GuardsCategory from '../../ng-doc.category';
import { UnsavedChangesDemoComponent } from './unsaved-changes-demo/unsaved-changes-demo.component';

const UnsavedChangesGuard: NgDocPage = {
  title: 'Unsaved Changes Guard',
  mdFile: './index.md',
  category: GuardsCategory,
  demos: { UnsavedChangesDemoComponent },
};

export default UnsavedChangesGuard;
