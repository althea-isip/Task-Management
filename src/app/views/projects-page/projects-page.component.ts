import { Component, OnInit, TemplateRef, ViewChild, NgZone, Input } from '@angular/core';
import { faPlus,faChevronDown, faEllipsisV, faTrash, faPenSquare} from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TasksService } from 'src/app/services/tasks.service';
import { AddTask, EditTask, Task } from 'src/app/models/task.model';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Project } from 'src/app/models/project.model';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit {

  projects: Project[] = [];
  projectID!: number;
  projectId!: number;
  @ViewChild('autosize')
  autosize!: CdkTextareaAutosize;
  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  @ViewChild('contentModal') contentModal!: TemplateRef<any>;
  @ViewChild('viewTask') viewTask!: TemplateRef<any>;
  @ViewChild('editTaskModal') editTaskModal!: TemplateRef<any>;
  @ViewChild('deleteTaskConfirmation') deleteTaskConfirmation!: TemplateRef<any>;
  @Input() status: string = '';
  
  tasks: Task[] = [];
  task!: Task;
  selectedTask: Task | null = null;
  taskToDelete: number | null = null;
  taskToEdit: number | null = null;
  modalRef: NgbModalRef | null = null;
  
  
  dateErrors: { startDate: string; dueDate: string; }
  ={
    startDate: '',
    dueDate: ''
  }

  addNewTaskRequest: AddTask = {
    projectID: 1,
    projectName: 'No Project Name',
    taskName: '',
    taskDescription: '',
    startDate: '',
    dueDate: '',
    status: 'Todo',
    priorityLevel: 'Low'
  }

  taskDetails: EditTask = {
    taskID: 0,
    projectID: 1,
    projectName: '',
    taskName: '',
    taskDescription: '',
    startDate: '',
    dueDate: '',
    status: '',
    priorityLevel: ''
  }

  projectDetails?: Project; 

    constructor(private modalService: NgbModal, private tasksService: TasksService, private route: ActivatedRoute, private snackBar:MatSnackBar, private _ngZone: NgZone, private projectsService: ProjectsService) { 
      
    }

  ngOnInit(): void {
    /* this.tasksService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.log(err);
      }
    }); */
    /* this.tasksService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
    }); */

    this.route.paramMap.subscribe(params => {
      const projectID = Number(params.get('id'));
      if (projectID) {
        this.getProjectDetails(projectID);
      }
    });
  }

  getProjectDetails(projectID: number): void {
    this.projectsService.getProject().subscribe({
      next: (projects) => {
        this.projects = projects;
      const matchedProject = projects.find(p => p.projectID === projectID);
      if (matchedProject) {
        this.projectDetails = matchedProject;
      } else {
        console.warn('Project not found with projectID:', projectID);
      }
      },
      error: (err) => {
        console.error('Failed to get project details:', err);
      }
    });
  }

  openModal(contentModal:TemplateRef<any>) {
    this.loadProjects();
    this.modalRef = this.modalService.open(contentModal);
  }

  loadProjects() {
    this.projectsService.getProject().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => {
        console.error('Error loading projects:', err);
      }
    });
  }

  openModalEdit(editTaskModal:any, taskID: number, task:Task){
    this.taskToEdit = taskID;
    this.selectedTask = {...task};
    this.modalRef = this.modalService.open(editTaskModal);
  }

  openModalTask(addTaskModal:any) {
    this.modalRef = this.modalService.open(addTaskModal);
  }

  openModalViewTask(task:Task) {
    this.selectedTask = task;
    this.modalService.open(this.viewTask);
  }

  openModalDelete(deleteTaskConfirmation:any, taskID: number) {
    this.taskToDelete = taskID;
    this.modalRef = this.modalService.open(deleteTaskConfirmation);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Todo':
        return 'bullet-todo';
      case 'In Progress':
        return 'bullet-inprogress';
      case 'On Hold':
        return 'bullet-onhold';
      case 'Cancelled':
        return 'bullet-cancelled';
      case 'Completed':
        return 'bullet-completed';
      default:
        return '';
    }
  }
   
    faPlus = faPlus;
    faChevronDown = faChevronDown;
    faEllipsisV = faEllipsisV;
    faPenSquare = faPenSquare;
    faTrash = faTrash;

  adjustDateToLocal(date: Date | string): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }

  toggleTaskStatus(task: any): void {
    if (task.status !== 'Completed') {
      task.originalStatus = task.status; 
      task.status = 'Completed';
    } else {
      task.status = task.originalStatus || 'Todo'; 
    }
  }

  addTask(){
    this.dateErrors = {
      startDate: '',
      dueDate: ''
    }

    let hasError = false;

    if (!this.addNewTaskRequest.startDate) {
      this.dateErrors.startDate = 'Start Date is required';
      this.clearError('startDate');
      hasError= true;
    } 

    if (!this.addNewTaskRequest.dueDate) {
      this.dateErrors.dueDate = 'Due Date is required';
      this.clearError('dueDate');
      hasError= true;
    } 
    if (hasError) return;

    const adjustedTask = {
      ...this.addNewTaskRequest,
      startDate: this.adjustDateToLocal(this.addNewTaskRequest.startDate),
      dueDate: this.adjustDateToLocal(this.addNewTaskRequest.dueDate),
    };
  
    console.log('Sending Task Data:', adjustedTask);

    this.tasksService.addNewTask(adjustedTask).subscribe({
      next: () => {
        this.addNewTaskRequest.projectName = 'Select Project';
        
        this.tasksService.getAllTasks()/* .subscribe(tasks => this.tasks = tasks); */
        this.snackBar.open('New Task Added!', 'Close', {
          duration: 3000,
        })
        if (this.modalRef) {
          this.modalRef.close();
          this.modalRef = null;
        }
        console.log('added', this.addNewTaskRequest);
      },
      error: (error) => {
        console.log('Add Task Failed:', error.error.errors);
      }
    });
  }

  get statusClass() {
    return 'bullet-' + this.addNewTaskRequest.status.toLowerCase().replace(/\s+/g, '');
  }   


  clearError(field: keyof typeof this.dateErrors, delay = 3000){
    setTimeout(() => {
      this.dateErrors[field] = '';
    }, delay);
  }

  updateTask() {
    if (!this.selectedTask) return;

    const updatedTask = {
    ...this.selectedTask,
    startDate: this.adjustDateToLocal(this.selectedTask.startDate),
    dueDate: this.adjustDateToLocal(this.selectedTask.dueDate),
  };

  this.tasksService.updateTask(updatedTask.taskID, updatedTask).subscribe({
      next: () => {
        console.log('Task Updated:', this.selectedTask);
        
        this.tasksService.getAllTasks()/* .subscribe(tasks => this.tasks = tasks); */
        this.snackBar.open('Task Updated!', 'Close', {
          duration: 3000,
        })

        if (this.modalRef) {
          this.modalRef.close();
          this.modalRef = null;
        }
      },
      error:(error)=>{
        console.log('Update Failed: ', error);
      }
    })
  }

  deleteTask(taskID:number){
      this.tasksService.deleteTask(taskID).subscribe({
        next:() =>{
          console.log(`task with ${taskID} deleted`)
          this.tasks = this.tasks.filter(task => task.taskID !==taskID);
          this.snackBar.open('Task Successfully Deleted!', 'Close', {
            duration: 3000,
          })
          if (this.modalRef) {
            this.modalRef.close();
            this.modalRef = null;
          }
          
        },
        error: (error)=>{
          console.error('delete Task Failed:', error.error.errors)
        }
      })
    
  }

}
