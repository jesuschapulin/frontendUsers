import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UpdateComponent } from './update/update.component';
import { ManageComponent } from './manage/manage.component';
export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'manage', component: ManageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    /* { path: 'update', component: UpdateComponent }, */
    { path: 'update/:login', component: UpdateComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
