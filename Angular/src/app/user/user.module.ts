import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SharebarComponent } from '../sharebar/sharebar.component';
import { PostbarComponent } from '../postbar/postbar.component';
import { LeftbarComponent } from '../leftbar/leftbar.component';
import { RightbarComponent } from '../rightbar/rightbar.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button'
@NgModule({
  declarations: [
    UserComponent,
    SharebarComponent,
    LeftbarComponent,
    RightbarComponent,
    PostbarComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
   MatButtonModule,
   MatIconModule
  
  ]
})
export class UserModule { }
