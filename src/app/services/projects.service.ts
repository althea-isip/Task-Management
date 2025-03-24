import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AddProject, Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  baseApiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /* getAllProjects(userID:number): Observable<Project[]>{
    {
      return this.http.get<Project[]>(`${this.baseApiUrl}` + '/api/Project/'+1 );
    }
  } */

    getProject(): Observable<Project[]>{
        const body = {action: 'SELECT_ALL'}
        return this.http.post<Project[]>(this.baseApiUrl + '/api/ProjectManagement/manage', body);
      }

    /* getProjects(): Observable<Project[]>{
        return this.http.get<Project[]>(`${this.baseApiUrl}` + '/api/Project/'+1 );
    } */

    /* getProjectsByID(userID:number): Observable<Project>{
        return this.http.get<Project>(`${this.baseApiUrl}` + '/api/Project/'+userID );
    } */
  
  /* getTaskByProject(projectID: string): Observable<Project> {
    return this.http.get<Project>(this.baseApiUrl + '/api/Project/' + projectID);
  } */

  addNewProject(addProjectRequest: AddProject): Observable<AddProject> {
    const body = {action: 'INSERT', 
      userID: addProjectRequest.userID,
      projectName: addProjectRequest.projectName,
      projectColor: addProjectRequest.projectColor
    }
    return this.http.post<AddProject>(this.baseApiUrl + '/api/ProjectManagement/manage', body);
  }

  updateProject(projectID: number, updateProjectRequest:Project): Observable<Project> {
    const body = {action: 'UPDATE', 
      projectID: updateProjectRequest.projectID,
      projectName: updateProjectRequest.projectName,
      projectColor: updateProjectRequest.projectColor
    }
    return this.http.post<Project>(this.baseApiUrl + '/api/ProjectManagement/manage', body);
  }

  deleteProject(projectID: number): Observable<Project> {
    const body = {action: 'DELETE', projectID: projectID }
    return this.http.post<Project>(this.baseApiUrl + '/api/ProjectManagement/manage', body);
  }

    /* addNewUserToProject(addNewUserToProjectRequest: Task): Observable<Task> {
    addNewUserToProjectRequest.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Task>(this.baseApiUrl + '/api/Project/addUserToProject', addNewUserToProjectRequest);
  } */

  

    /* updateProject(projectID: number, updateProjectRequest: Project): Observable<Project> {
      return this.http.put<Project>(this.baseApiUrl + '/api/Project/'+ projectID, updateProjectRequest);
    }

    deleteProject(projectID: number): Observable<Project> {
      return this.http.delete<Project>(this.baseApiUrl + '/api/Project/'+ projectID);
    } */
}
