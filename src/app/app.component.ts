import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from './task.model';
import { formatDate } from '@angular/common';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('myModalClose') modalClose: any;
  @ViewChild('todoModal') todoModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('closeDelete') closeDelete: any;

  tabs: Array<any> = [
    { title: 'Today', color: '#424242' },
    { title: 'Upcoming', color: '#424242' },
    { title: 'Completed', color: '#424242' }
  ];

  currentTab = 0;

  addTaskForm: FormGroup;
  submitted = false;

  tasks: Task[] = [];
  tasksDueToday: Task[] = [];
  upcomingTasks: Task[] = [];
  completedTasks: Task[] = [];

  currentTask: any;
  todayDate = moment();

  sortBy: string = 'file-name';
  sortDown: boolean = false;

  constructor(

  ) {

  }

  ngOnInit() {

    if (localStorage.getItem('tasks') === null) {
      // console.log('no task');
    } else {
      this.tasks = JSON.parse(localStorage.getItem('tasks')!);
     // console.log('tasks', this.tasks);
      this.tasks.sort((a, b) => a.desc.toLowerCase() > b.desc.toLowerCase() ? 1 : -1);
      this.onSortData();
    }

    this.addTaskForm = new FormGroup({
      'description': new FormControl(null, Validators.required),
      'duedate': new FormControl(null),
    });

  }

  changeTab(x: any) {
    this.currentTab = x;
  }

  onSubmit() {

    this.submitted = true;

    if (this.addTaskForm.invalid) {
      for (let el in this.addTaskForm.controls) { // help to check which control have error
        if (this.addTaskForm.controls[el].errors) {
          console.log(el);
        }
      }
      return;
    }

    if (this.currentTask) { // check if it is add new task or update task
      let itemIndex = this.tasks.findIndex(task => task.id == this.currentTask.id);
      this.tasks[itemIndex].desc = this.addTaskForm.value.description;
      this.tasks[itemIndex].duedate = new Date(this.addTaskForm.value.duedate).getTime();
      this.submitted = false;
      this.addTaskForm.reset();
      this.onUpdateData();
    } else {
      let newTask = new Task();
      newTask.id = uuidv4();
      newTask.desc = this.addTaskForm.value.description;
      if (this.addTaskForm.value.duedate == null) {
        newTask.duedate = new Date().getTime();
      } else {
        newTask.duedate = new Date(this.addTaskForm.value.duedate).getTime();
      }

      this.tasks.push(newTask);
      this.submitted = false;
      this.addTaskForm.reset();
      this.onUpdateData();
    }

    this.modalClose.nativeElement.click();
  }

  onReset() {
    this.currentTask = null;
    this.addTaskForm.reset();
  }

  onEdit(data: any) {
    this.todoModal.nativeElement.click();
    this.currentTask = data;
    this.addTaskForm.controls['description'].setValue(this.currentTask.desc);
    this.addTaskForm.controls['duedate'].setValue(formatDate(new Date(this.currentTask.duedate).toISOString(), 'yyyy-MM-dd', 'en'));
  }

  onDelete(data: any) {
    this.deleteModal.nativeElement.click();
    this.currentTask = data;
  }

  onConfirmDelete() {
    this.closeDelete.nativeElement.click();
    let itemIndex = this.tasks.findIndex(task => task.id == this.currentTask.id);
    this.tasks.splice(itemIndex, 1);
    this.currentTask = null;
    this.onUpdateData();
  }

  onSort(value: string) {
    this.sortBy = value;
    this.sortDown = !this.sortDown;

    if (this.sortBy === 'file-name') {
      if (this.sortDown) {
        if (this.currentTab === 0) {
          this.tasksDueToday.sort((a, b) => a.desc.toLowerCase() > b.desc.toLowerCase() ? 1 : -1);
        } else if (this.currentTab === 1) {
          this.upcomingTasks.sort((a, b) => a.desc.toLowerCase() > b.desc.toLowerCase() ? 1 : -1);
        } else {
          this.completedTasks.sort((a, b) => a.desc.toLowerCase() > b.desc.toLowerCase() ? 1 : -1);
        }
      } else {
        if (this.currentTab === 0) {
          this.tasksDueToday.sort((a, b) => b.desc.toLowerCase() > a.desc.toLowerCase() ? 1 : -1);
        } else if (this.currentTab === 1) {
          this.upcomingTasks.sort((a, b) => b.desc.toLowerCase() > a.desc.toLowerCase() ? 1 : -1);
        } else {
          this.completedTasks.sort((a, b) => b.desc.toLowerCase() > a.desc.toLowerCase() ? 1 : -1);
        }
      }
    } else if (this.sortBy === 'duedate') {
      if (this.sortDown) {
        if (this.currentTab === 0) {
          this.tasksDueToday.sort((a, b) => a.duedate - b.duedate);
        } else if (this.currentTab === 1) {
          this.upcomingTasks.sort((a, b) => a.duedate - b.duedate);
        } else {
          this.completedTasks.sort((a, b) => a.duedate - b.duedate);
        }
      } else {
        if (this.currentTab === 0) {
          this.tasksDueToday.sort((a, b) => b.duedate - a.duedate);
        } else if (this.currentTab === 1) {
          this.upcomingTasks.sort((a, b) => b.duedate - a.duedate);
        } else {
          this.completedTasks.sort((a, b) => b.duedate - a.duedate);
        }
      }
    }
  }

  onUpdateData() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.tasks = JSON.parse(localStorage.getItem('tasks')!);
    this.onSortData();
  }

  onSortData() {
    this.tasksDueToday = this.tasks.filter(task => {
      return (this.todayDate.isSame(task.duedate, 'day') && task.status === 0) || (this.todayDate.isAfter(task.duedate, 'day') && task.status === 0);
    })
    // console.log('tasksDueToday', this.tasksDueToday);

    this.upcomingTasks = this.tasks.filter(task => {
      return this.todayDate.isBefore(task.duedate, 'day') && task.status === 0;
    })
    // console.log('upcomingTasks', this.upcomingTasks);

    this.completedTasks = this.tasks.filter(task => {
      return task.status === 1;
    })
    // console.log('completedTasks', this.completedTasks);
  }

  deleteAllTasks() {
    localStorage.clear();
  }

  onComplete(data: { id: string; }) {
    let itemIndex = this.tasks.findIndex(task => task.id == data.id);
    if (this.tasks[itemIndex].status === 0) {
      this.tasks[itemIndex].status = 1;
    } else {
      this.tasks[itemIndex].status = 0;
    }
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

}
