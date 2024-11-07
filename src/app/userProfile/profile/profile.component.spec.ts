import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChatService } from 'src/app/chat.service';
import { ChatComponent } from 'src/app/chat/chat.component';

describe('ProfileComponent', () => {
  let chatServiceMock: any;
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    chatServiceMock = {
      getMessages: () => of([{ message: 'Hello' }])  // Mock observable
    };
    await TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports:[HttpClientTestingModule],
      providers: [
      
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => 'mockIdValue' }),  // Mock `paramMap` as an observable
          },
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
