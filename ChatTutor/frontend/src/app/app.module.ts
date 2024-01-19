import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/app.component';
import { ENDPOINT_TOKEN } from './chat.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CQNChatTutorWrapperComponent } from './cqnchat-tutor-wrapper/cqnchat-tutor-wrapper.component';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ChattutorDatabaseComponent } from './chattutor-database/chattutor-database.component';
import { MessageInsideDatabaseComponent } from './message-inside-database/message-inside-database.component';
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { CourseInputComponent } from './course-input/course-input.component';
import { UrlLabelComponent } from './url-label/url-label.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { CourseDashboardComponent } from './course-dashboard/course-dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { RegisterStudentPageComponent } from './register-student-page/register-student-page.component';
import { ChatModule } from './chat.module';
import { ChatTutorWrapperComponent } from './chat-tutor-wrapper/chat-tutor-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatTutorWrapperComponent,
    CQNChatTutorWrapperComponent,
    LandingPageComponent,
    ChattutorDatabaseComponent,
    MessageInsideDatabaseComponent,
    CourseInputComponent,
    UrlLabelComponent,
    UserDashboardComponent,
    CourseDashboardComponent,
    NavbarComponent,
    LoginPageComponent,
    RegisterPageComponent,
    RegisterStudentPageComponent
  ],
  imports: [
    BrowserModule,
    ChatModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatStepperModule,
    MatExpansionModule
  ],
  providers: [
    { provide: ENDPOINT_TOKEN, useValue: 'your_endpoint_url_here' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
