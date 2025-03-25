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
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit {
projects: Project[] = [];
  
  tasks: Task[] = [];
  task!: Task;
  selectedTask: Task | null = null;
  taskToDelete: number | null = null;
  taskToEdit: number | null = null;
  modalRef: NgbModalRef | null = null;

  minDate = new Date(2000, 0, 1); 
  displayedColumns: string[] = ['checkbox', 'taskName', 'dueDate', 'priorityLevel', 'status', 'actions'];
  searchText: string = '';
  selectedStatuses: { [status: string]: boolean } = {
    'Todo': false,
    'In Progress': false,
    'On Hold': false,
    'Cancelled': false,
    'Completed': false,
  };
  projectDetails?: Project; 

  constructor(private modalService: NgbModal, private tasksService: TasksService, private route: ActivatedRoute, private snackBar:MatSnackBar, private _ngZone: NgZone, private projectsService: ProjectsService) { }

  filterPredicate = (data: Task, filter: string): boolean => {
    const search = JSON.parse(filter);
    const statusMatch = Object.entries(search.statuses)
      .filter(([_, checked]) => checked)
      .map(([status]) => status)
      .includes(data.status);
  
    const textMatch = data.taskName?.toLowerCase().includes(search.text.toLowerCase());
  
    return (statusMatch || Object.values(search.statuses).every(v => !v)) && textMatch;
  };

  ngOnInit(): void {
    this.loadProjects();

    this.route.paramMap.subscribe(params => {
      const projectID = Number(params.get('id'));
      if (projectID) {
        this.getProjectDetails(projectID);
      }
    });


    this.tasksService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.dataSource.data = tasks;
      this.dataSource.sort = this.sort;
    });

    this.tasksService.getAllTasks();

    this.dataSource.filterPredicate = this.filterPredicate;
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

  
applyFilter() {
  const filterObj = {
    text: this.searchText || '',
    statuses: this.selectedStatuses
  };
  this.dataSource.filter = JSON.stringify(filterObj);
}

clearFilters() {
  for (let key in this.selectedStatuses) {
    this.selectedStatuses[key] = false;
  }
  this.applyFilter();
}
  
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
  
  dataSource = new MatTableDataSource<Task>([]);
  @ViewChild(MatSort)
  sort!: MatSort;
  
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
  
getTasksByProjectID(projectID: number): Observable<Task[]> {
  return this.tasksService.getTaskByProjectID(projectID);
}
  
  errors: { startDate: string; dueDate: string; projName: string }
  ={
    startDate: '',
    dueDate: '',
    projName: ''
  }

  addNewTaskRequest: AddTask = {
    projectID: 1,
    projectName: '',
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

  faPlus = faPlus;
  faChevronDown = faChevronDown;
  faEllipsisV = faEllipsisV;
  faPenSquare = faPenSquare;
  faTrash = faTrash;

  startDate:Date = new Date();
  dueDate:Date = new Date();

  openModal(contentModal:TemplateRef<any>) {
    this.loadProjects();
    this.modalRef = this.modalService.open(contentModal);
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

  adjustDateToLocal(date: Date | string): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }



  toggleTaskStatus(task: any): void {
    const previousStatus = task.status; // Save before changing

  if (task.status !== 'Completed') {
    task.originalStatus = task.status; // Save before changing
    task.status = 'Completed';
  } else {
    task.status = task.originalStatus || 'Todo';
  }

  const updatedTask: EditTask = {
    taskID: task.taskID,
    projectID: task.projectID,
    projectName: task.projectName || '',
    taskName: task.taskName,
    taskDescription: task.taskDescription,
    startDate: task.startDate,
    dueDate: task.dueDate,
    status: task.status,
    priorityLevel: task.priorityLevel
  };

  this.tasksService.updateTask(task.taskID, updatedTask).subscribe({
    next: () => {
      console.log('Task status updated successfully');
    },
    error: (error) => {
      console.error('Error updating task status:', error);
      // Revert status in case of API failure
      task.status = previousStatus;
    }
  });
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

  addTask(){
    this.errors = {
      projName: '',
      startDate: '',
      dueDate: '',
    }

    let hasError = false;

   /*  if (!this.addNewTaskRequest.projectID) {
      this.errors.projName = 'Select a Project';
      this.clearError('projName');
      hasError= true;
    }  */

    /* if (!this.addNewTaskRequest.projectID || this.addNewTaskRequest.projectID === 0) {
      this.errors.projName = 'Select a Project';
      hasError = true;
    } */

    if (!this.addNewTaskRequest.startDate) {
      this.errors.startDate = 'Start Date is required';
      this.clearError('startDate');
      hasError= true;
    } 

    if (!this.addNewTaskRequest.dueDate) {
      this.errors.dueDate = 'Due Date is required';
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
        this.addNewTaskRequest.projectName = '';
        this.addNewTaskRequest.taskName = '';
        this.addNewTaskRequest.priorityLevel = 'Low';
        this.addNewTaskRequest.status = 'Todo';
        this.addNewTaskRequest.taskDescription = '';
        this.addNewTaskRequest.startDate = '';
        this.addNewTaskRequest.dueDate = '';
        this.tasksService.getAllTasks();
        /* this.tasksService.getAllTasks().subscribe(tasks => this.tasks = tasks); */
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
        console.log('Add Task Failed:', adjustedTask);
      }
    });
  }

  getProjectName(projectID: number): string {
    const project = this.projects.find(p => p.projectID === projectID);
    return project ? project.projectName : '';
  }

  get statusClass() {
    return 'bullet-' + this.addNewTaskRequest.status.toLowerCase().replace(/\s+/g, '');
  }   


  clearError(field: keyof typeof this.errors, delay = 3000){
    setTimeout(() => {
      this.errors[field] = '';
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
        this.tasksService.getAllTasks();
        /* this.tasksService.getAllTasks().subscribe(tasks => this.tasks = tasks); */
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
    console.log(`task with ${taskID} deleted`)
      this.tasksService.deleteTask(taskID).subscribe({
        next:() =>{
          
          /* this.tasksService.getAllTasks(); */
          this.tasks = this.tasks.filter(task => task.taskID !==taskID);
          this.snackBar.open('Task Successfully Deleted!', 'Close', {
            duration: 3000,
          })
          /* this.tasksService.refreshTasks(); */
          if (this.modalRef ) {
            this.modalRef.close();
            this.modalRef = null;
          }
          
        },
        error: (error)=>{
          console.error('delete Task Failed:', error?.error?.errors || error?.message || error)
        }
      })
  }
  

}
