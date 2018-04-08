import {ListItem} from './ListItem';

export class CheckList {
  name: string;
  list: ListItem[];

  constructor(name: string, checklist: ListItem[]) {
    this.name = name;
    this.list = checklist;
  }

  static empty(): CheckList {
    return new CheckList('', []);
  }

  isEmpty(): boolean {
    return this.list.length > 0;
  }
}
