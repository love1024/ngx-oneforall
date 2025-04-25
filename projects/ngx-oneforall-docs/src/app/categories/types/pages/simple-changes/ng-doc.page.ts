import { NgDocPage } from '@ng-doc/core';
import TypesCategory from '../../ng-doc.category';

const SimpleChangesType: NgDocPage = {
  title: 'Simple Changes',
  mdFile: './index.md',
  category: TypesCategory,
  demos: { FirstErrorControlComponent, FirstErrorValidationComponent },
};

export default SimpleChangesType;
