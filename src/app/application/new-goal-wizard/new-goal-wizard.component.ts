import { Component, OnInit } from '@angular/core';
import {Goal} from '../goals/models/Goal';
import {Level} from '../goals/models/Level';
import {GoalsService} from '../goals/goals.service';
import {MessageService} from '../../messages/message.service';
import {CheckList} from '../goals/models/Checklist';
import {ListItem} from '../goals/models/ListItem';

@Component({
  selector: 'app-new-goal-wizard',
  templateUrl: './new-goal-wizard.component.html',
  styleUrls: ['./new-goal-wizard.component.css']
})
export class NewGoalWizardComponent implements OnInit {
  public goal: Goal = Goal.empty();
  public newLevel: Level = Level.empty();
  public newChecklist: CheckList = CheckList.empty();
  public newListItem: ListItem = ListItem.empty();
  public withChecklist = false;
  constructor(private goalsService: GoalsService, private messageService: MessageService) { }

  ngOnInit() {
  }

  addLevel(level) {
    this.newLevel.level = level;
    this.goal.levels.push(this.newLevel);
    this.newLevel = Level.empty();
  }

  addListItem() {
    this.goal.checklist.list.push(this.newListItem);
    this.newListItem = ListItem.empty();
  }

  addGoal() {
    if (!this.withChecklist) {
      this.goal.checklist = null;
    }
    this.goalsService.addGoal(this.goal);
    this.messageService.showSuccessMessage('Twój cel ' + this.goal.name + ' został dodany.');
    this.goal = Goal.empty();
  }

  toggleChecklist() {
    this.withChecklist = !this.withChecklist;
  }
}
