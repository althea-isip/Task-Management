import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './views/welcome-page/welcome-page.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { SignupPageComponent } from './views/signup-page/signup-page.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ProjectsPageComponent } from './views/projects-page/projects-page.component';


const routes: Routes = [
  {
    path: '', title: 'Task Management', component: WelcomePageComponent
  },
  {
    path: 'login', title: 'Login', component: LoginPageComponent
  },
  {
    path: 'signup', title: 'Sign Up', component: SignupPageComponent
  },
  {
    path: 'dashboard', title: 'Dashboard', component: DashboardComponent
  },
  {
    path: 'projects/:id', title: 'Projects Page', component: ProjectsPageComponent
  },

  { path: '', redirectTo: '/', pathMatch: 'full' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
