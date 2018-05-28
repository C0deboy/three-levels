import {logging} from 'selenium-webdriver';
import {Level} from './Level';
import {CheckList} from './Checklist';
import {DailyHabit} from './daily-habit';

export class Goal {
  id: String;
  name: String;
  levels: Level[];
  checklist: CheckList;
  dailyHabit: DailyHabit = DailyHabit.empty();
  achieved = false;

  constructor(name: string = '', levels: Level[] = []) {
    this.name = name;
    this.levels = levels;
  }

  static empty() {
    const emptyGoal = new Goal('',  []);
    emptyGoal.levels = [];
    emptyGoal.checklist = CheckList.empty();
    emptyGoal.dailyHabit = DailyHabit.empty();
    return emptyGoal;
  }

  static deserialize(object: any): Goal {
    const goal = new Goal();
    Object.assign(goal, object);
    goal.dailyHabit = DailyHabit.deserialize(object.dailyHabit);
    return goal;
  }
}
