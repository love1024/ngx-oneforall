import { NgDocPage } from '@ng-doc/core';
import ValidatorsCategory from '../../ng-doc.category';
import { MatchFieldDemoComponent } from './demo/match-field-demo.component';

const MatchFieldPage: NgDocPage = {
  title: 'Match Field',
  mdFile: './index.md',
  category: ValidatorsCategory,
  demos: { MatchFieldDemoComponent },
};

export default MatchFieldPage;
