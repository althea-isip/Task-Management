import { Component, Input, OnInit } from '@angular/core';
import { faChevronDown, faEllipsisV, faPenSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddProject, Project } from 'src/app/models/project.model';
import { ProjectsService } from 'src/app/services/projects.service';
import { TasksService } from 'src/app/services/tasks.service';
import { Task } from 'src/app/models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-projects-sidebar',
  templateUrl: './projects-sidebar.component.html',
  styleUrls: ['./projects-sidebar.component.scss']
})
export class ProjectsSidebarComponent implements OnInit {
  @Input() projectColor: string = '';

  projects: Project[] = [];
  totalTasksCount = 0;
  tasks: Task[] = [];

  hoveredProject: Project | null = null;

  faPlus = faPlus;
    faChevronDown = faChevronDown;
    
  addNewProjectRequest: AddProject = {
    userID: 0,
    projectName: '',
    projectColor: 'Charcoal',
    }
  modalRef: any;
    
    
  constructor(private modalService: NgbModal, private projectsService: ProjectsService, private tasksService: TasksService, private snackBar:MatSnackBar) { }

  ngOnInit(): void {
   
    this.projectsService.getProject().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.tasksService.tasks$.subscribe(tasks => {
      this.tasks = tasks;
      this.totalTasksCount = tasks.length; 
    });
    this.tasksService.getAllTasks();
  }

  get colorClass() {
    return 'bullet-' + this.projectColor.toLowerCase().replace(/\s+/g, '');
  }   

  getStatusClass(status: string): string {
    switch (status) {
      case 'Charcoal':
        return 'bullet-charcoal';
      case 'Yellow':
        return 'bullet-yello';
      case 'Green':
        return 'bullet-green';
      case 'Pink':
        return 'bullet-pink';
      default:
        return '';
    }
  }

  editProject(project: string) {
    console.log('Edit clicked for', project);
  }
  
  deleteProject(project: string) {
    console.log('Delete clicked for', project);
  }


  openModal(addProjectModal:any) {
      this.modalRef = this.modalService.open(addProjectModal);
    }

  getTaskCount(){
    this.tasksService.getTotalTasks().subscribe({
      next: (res)=>{
        this.tasksService.getAllTasks()/* .subscribe(tasks => {
          this.tasks = tasks;
        this.totalTasksCount = res.totalTasks
      }); */
        console.log('Total Tasks:', res);
      }
    });
  }

  getTaskCountForProject(projectID: number): number {
    return this.tasks.filter(task => task.projectID === projectID).length;
  }

   
  
  addProject(){
    this.projectsService.addNewProject(this.addNewProjectRequest).subscribe({
      next: () => {
        this.addNewProjectRequest.projectName = '';
        this.addNewProjectRequest.projectColor = '';
        this.projectsService.getProject();
        /* this.tasksService.getAllTasks().subscribe(tasks => this.tasks = tasks); */
        this.snackBar.open('New Task Added!', 'Close', {
          duration: 3000,
        })
        if (this.modalRef) {
          this.modalRef.close();
          this.modalRef = null;
        }
        console.log('added', this.addNewProjectRequest);
      },
      error: (error) => {
        console.log('Add Task Failed:');
      }
    });
  }

}
