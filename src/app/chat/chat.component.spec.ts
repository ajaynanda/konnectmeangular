import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { ChatService } from '../chat.service';
import { MatDialog } from '@angular/material/dialog';
describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatComponent ],
      imports:[HttpClientTestingModule],
      providers: [ChatService,MatDialog],
    })
    .compileComponents();
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('should create chatcomponent', () => {
    expect(component).toBeTruthy();
  });
});
