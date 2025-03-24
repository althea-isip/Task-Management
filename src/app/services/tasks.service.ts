import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddTask, EditTask, Task } from '../models/task.model';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  baseApiUrl: string = environment.apiUrl;
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllTasks(): void{
    const body = {action: 'SELECT_ALL'}
     this.http.post<Task[]>(this.baseApiUrl + '/api/TaskManagement/manage', body).subscribe(tasks => this.tasksSubject.next(tasks));
  }

  getTaskByProjectID(projectID: number): Observable<Task[]>{
    const body = {action: 'SELECT_BY_PROJECT', ProjectID: projectID}
    return this.http.post<Task[]>(this.baseApiUrl + '/api/TaskManagement/manage', body);
  }
  /* getAllTasks(): void{
    const body = {action: 'SELECT_ALL'}
    this.http.post<Task[]>(this.baseApiUrl + '/api/TaskManagement/manage', body).subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks);
      }
    });
  } */

    refreshTasks():void{
      this.getAllTasks();
    }

    
  addNewTask(addTaskRequest: AddTask): Observable<AddTask> {
    //addTaskRequest.taskID = '00000000-0000-0000-0000-000000000000';
    const body = {action: 'INSERT', 
        projectID: addTaskRequest.projectID,
        projectName: addTaskRequest.projectName,
        taskName: addTaskRequest.taskName,
        taskDescription: addTaskRequest.taskDescription,
        startDate: addTaskRequest.startDate,
        dueDate: addTaskRequest.dueDate,
        status: addTaskRequest.status,
        priorityLevel: addTaskRequest.priorityLevel}
    return this.http.post<AddTask>(this.baseApiUrl + '/api/TaskManagement/manage', body).pipe(
      catchError((err) => {
        console.error('API Error:', err);
        return throwError(() => err);
      }))
  }

  updateTask(taskID: number, updateTaskRequest: EditTask): Observable<EditTask>{
    const body = {action: 'UPDATE', 
      TaskID: taskID, 
      ProjectID: updateTaskRequest.projectID,
      projectName: updateTaskRequest.projectName,
      taskName: updateTaskRequest.taskName,
      taskDescription: updateTaskRequest.taskDescription,
      startDate: updateTaskRequest.startDate,
      dueDate: updateTaskRequest.dueDate,
      status: updateTaskRequest.status,
      priorityLevel: updateTaskRequest.priorityLevel}
    return this.http.post<EditTask>(this.baseApiUrl + '/api/TaskManagement/manage', body);
  }

  deleteTask(taskID: number): Observable<Task> {
    const body = {action: 'DELETE', TaskID: taskID}
    return this.http.post<Task>(this.baseApiUrl + '/api/TaskManagement/manage', body).pipe(
      tap(() => this.refreshTasks())
    );
  }

  /* updateTaskStatus(task: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/manage`, task); // adapt if using PUT
  } */

  

  getTotalTasks(): Observable<{totalTasks:number}>{
    const body = {
      action: 'COUNT'
    }
    return this.http.post<{totalTasks:number}>(this.baseApiUrl + '/api/TaskManagement/manage', body);
  }

  /* getAllTasks(): Observable<Task[]>{
      return this.http.get<Task[]>(this.baseApiUrl + '/api/Task');
  } */

 /*  getTasks() {
    this.http.get<Task[]>(this.baseApiUrl + '/api/Task').subscribe({
      next: (tasks) => {
        this.tasksSubject.next(tasks);
      }
    });
  } */

  /* getTaskByID(taskID: number): Observable<Task> {
    return this.http.get<Task>(this.baseApiUrl + '/api/Task/SelectbyTaskID/' + taskID);
  } */

  

  /* getTotalTasks(): Observable<{totalTasks:number}>{
    return this.http.get<{totalTasks:number}>(this.baseApiUrl + '/api/Task/CountTotalTasks');
  } */

  /* addNewTask(addTaskRequest: AddTask): Observable<AddTask> {
    //addTaskRequest.taskID = '00000000-0000-0000-0000-000000000000';
    return this.http.post<AddTask>(this.baseApiUrl + '/api/Task', addTaskRequest);
  } */
  
   /*  updateTask(taskID: number, updateTaskRequest: EditTask): Observable<EditTask> {
      return this.http.put<EditTask>(this.baseApiUrl + '/api/Task/'+taskID, updateTaskRequest);
    } */

   /*  deleteTask(taskID: number): Observable<Task> {
      return this.http.delete<Task>(this.baseApiUrl + '/api/Task/'+taskID);
    }  */

    

    
}
