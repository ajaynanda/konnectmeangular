import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket = io('http://localhost:5000',);
  public message$: BehaviorSubject<any> = new BehaviorSubject('');
  constructor() { }
  sendMessage(message:any){
    console.log(message,"jkgh");  
    this.socket.emit('message', message);
  }
 getNewMessage = () => {
    this.socket.on('message', (message) =>{
      this.message$.next(message);
    });

    return this.message$.asObservable();
  };
}
