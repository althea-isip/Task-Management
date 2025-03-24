import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrModule } from 'ngx-toastr';
import {MatMenuModule} from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './app.component';
import { WelcomePageComponent } from './views/welcome-page/welcome-page.component';
import { FooterComponent } from './views/footer/footer.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { SignupPageComponent } from './views/signup-page/signup-page.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { HeaderUserComponent } from './views/header-user/header-user.component';
import { NewTaskModalComponent } from './views/new-task-modal/new-task-modal.component';
import { ProjectsSidebarComponent } from './views/projects-sidebar/projects-sidebar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BasicAuthInterceptor } from './helpers/basic-auth.interceptor';
import { ProjectsPageComponent } from './views/projects-page/projects-page.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    FooterComponent,
    LoginPageComponent,
    SignupPageComponent,
    DashboardComponent,
    HeaderUserComponent,
    NewTaskModalComponent,
    ProjectsSidebarComponent,
    ProjectsPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      progressBar: true,
      closeButton: true,
    }),
    MatIconModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSelectModule,
    MatExpansionModule,
    MatButtonModule,
    MatSortModule,
    MatTableModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BasicAuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
