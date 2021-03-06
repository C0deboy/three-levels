import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild} from '@angular/core';
import {GoalsService} from '../goals/goals.service';
import {Goal} from '../goals/models/Goal';
import {ListItem} from '../goals/models/ListItem';
import {Level} from '../goals/models/Level';
import {MessageService} from '../../messages/message.service';
import {HttpErrorResponse} from '@angular/common/http';
import * as moment from 'moment';
import {Properties} from '../../properties';
import {CheckList} from '../goals/models/Checklist';
import {DailyHabit} from '../goals/models/daily-habit';

declare var $: any;

@Component({
  selector: 'stepify-goal-details',
  templateUrl: './goal-details.component.html',
  styleUrls: ['./goal-details.component.scss']
})
export class GoalDetailsComponent implements AfterViewInit {
  @ViewChild('checklistProgress')
  checklistProgress: ElementRef;

  @ViewChild('dailyHabitProgress')
  dailyHabitProgress: ElementRef;

  @Input()
  public goal: Goal;

  @Input()
  public lastGoal: Goal;

  @Output()
  levelRewardEvent = new EventEmitter<Level>();

  @Output()
  deleteGoalEvent = new EventEmitter<String>();

  @Output()
  editGoalEvent = new EventEmitter<Goal>();

  @Output()
  updatedGoalEvent = new EventEmitter<Goal>();

  private doneItems = 0;
  private allItems = 0;
  private doneDailyHabitItems = 0;
  private allDailyHabitItems = 0;

  constructor(private goalsService: GoalsService, private messageService: MessageService) {
  }

  ngAfterViewInit(): void {
    $('#goal-details').on('shown.bs.modal', (event) => {
      if (this.checklistProgress) {
        const progressEl = this.checklistProgress.nativeElement;
        const elements = progressEl.parentElement.querySelectorAll('.checklist .mat-checkbox-checked');
        if (elements.length !== 0) {
          const list = progressEl.parentElement.querySelector('.checklist ul');
          list.focus();
          const element = elements[elements.length - 1];
          console.log(element);
          element.scrollIntoView({behavior: 'smooth'});
        }
      }
    });
  }

  showLevelReward(level: Level) {
    if (level.achieved) {
      level.achievedAt = moment();
      this.levelRewardEvent.emit(level);
      $('#rewardModal').modal('show');

      if (this.goal.levels.indexOf(level) === this.goal.levels.length - 1) {
        this.goal.achieved = true;
        this.goal.order = this.lastGoal.order + Properties.GOAL_ORDER_DIFF;
      }

    } else {
      this.goal.achieved = false;
      level.achievedAt = null;
      level.achievedProof = null;
    }
  }

  checkIfLevelAchieved(item: ListItem) {

    const stepRegexp = new RegExp('(^|\\s)' + item.value + '(\\s|$)', 'g');

    for (const level of this.goal.levels) {
      if (level.name.match(stepRegexp)) {
        if (item.checked) {
          level.achieved = true;
          this.showLevelReward(level);
        } else {
          level.achieved = false;
        }
        break;
      }
    }
  }

  editGoal() {
    this.editGoalEvent.emit(this.goal);
  }

  updateGoal(goal: Goal) {
    this.goalsService.updateGoal(goal).subscribe(updatedGoal => {
        this.messageService.showSuccessMessage('Zaktualizowano.');
        this.updatedGoalEvent.emit(updatedGoal);
      },
      (error: HttpErrorResponse) => {
        this.messageService.showMessageBasedOnError(error, 'Nie udało się dodać celu.');
      });
  }

  deleteGoal() {
    this.goalsService.deleteGoal(this.goal.id).subscribe(value => {
        this.messageService.showSuccessMessage('Cel został usunięty.');
        $('#goal-details').modal('hide');
        $('#confirmModal').modal('hide');
        this.deleteGoalEvent.emit(this.goal.id);
      },
      (error: HttpErrorResponse) => {
        this.messageService.showMessageBasedOnError(error, 'Nie udało się usunąć celu.');
      }
    );
  }

  @HostListener('keydown', ['$event']) deleteBtn(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.deleteGoal();
    }
  }

  getChecklistProgress(checklist: CheckList): number {
    this.allItems = checklist.list.length;
    this.doneItems = checklist.list.filter(item => item.checked).length;
    const percent = Math.round(this.doneItems * 100 / this.allItems);
    if (this.checklistProgress !== undefined) {
      this.checklistProgress.nativeElement.querySelector('.progress-indicator').style.width = percent + '%';
    }
    return percent;
  }

  getDailyHabitProgress(dailyHabit: DailyHabit) {
    this.allDailyHabitItems = dailyHabit.dailyChecklist.length;
    this.doneDailyHabitItems = dailyHabit.dailyChecklist.filter(item => item === 1).length;
    const percent = Math.round(this.doneDailyHabitItems * 100 / this.allDailyHabitItems);
    if (this.dailyHabitProgress !== undefined) {
      this.dailyHabitProgress.nativeElement.querySelector('.progress-indicator').style.width = percent + '%';
    }
    return percent;
  }

  closeGoal() {
    if (this.goal.achieved) {
      this.goal.achieved = false;
      this.messageService.showInfoMessage('Cel został wznowiony.');
    } else {
      this.goal.achieved = true;
      this.messageService.showInfoMessage('Cel został zakończony.');
    }

    this.updateGoal(this.goal);
  }
}
