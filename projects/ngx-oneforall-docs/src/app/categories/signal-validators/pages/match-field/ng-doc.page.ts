import { NgDocPage } from '@ng-doc/core';
import SignalValidatorsCategory from '../../ng-doc.category';
import { MatchFieldSignalDemoComponent } from './demo/match-field-demo.component';

const MatchFieldSignalPage: NgDocPage = {
  title: 'Match Field',
  mdFile: './index.md',
  category: SignalValidatorsCategory,
  demos: { MatchFieldSignalDemoComponent },
};

export default MatchFieldSignalPage;
