import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/models/task.model';
@Component({
  selector: 'app-new-task-modal',
  templateUrl: './new-task-modal.component.html',
  styleUrls: ['./new-task-modal.component.scss']
})
export class NewTaskModalComponent implements OnInit {
  tasks: Task[] = [];
  
    addNewTaskRequest: Task = {
      taskID: 0,
      projectID: 0,
      projectName: '',
      taskName: '',
      taskDescription: '',
      startDate: '',
      dueDate: '',
      status: '',
      priorityLevel: '',
      isDeleted: false,
    }

  startDate:Date = new Date();
  
  dueDate:Date = new Date();
  constructor(public activeModal: NgbActiveModal, private tasksService: TasksService) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.close();
  }


}
