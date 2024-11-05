import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
interface User {
  id: number;
  name: string;
  profileImage: string;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})


export class ChatComponent implements OnInit {
  users: User[] = [
    { id: 1, name: 'Alice', profileImage: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Bob', profileImage: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Charlie', profileImage: 'https://via.placeholder.com/40' },
  ];
  
  // messages: {} = {};
  messagesArr:any[]=[];
  selectedUser: User | null = null;
  newMessage: string = '';
  filteredUsers: User[] = [...this.users];
  searchText: string = '';
  user = JSON.parse(localStorage.getItem('KMuser') || '{}');
  constructor(private chatService:ChatService) { }

  ngOnInit(): void {
    this.chatService.getNewMessage().subscribe((message:any) => {
      if(message){
        this.messagesArr.push(message);
      }
      console.log(this.messagesArr,"ar");
      
    });
  }
  filterUsers(event:any): void {
    if(event.target.value==''){
      this.filteredUsers = this.users 
    }
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.users=this.filteredUsers
  }
  selectUser(user: User): void {
    this.selectedUser = user;
    // if (!this.messages[user.id]) {
    //   this.messages[user.id] = [];
    // }
    
  }
  startNewChat(): void {
    this.selectedUser = null;
    this.newMessage = '';
  }
  sendMessage(): void {
  
    if (this.newMessage.trim() && this.selectedUser) {
      // this.messages[this.selectedUser.id].push(this.newMessage);
      this.chatService.sendMessage({userid:this.user._id,reciepientID:this.selectedUser.id,msg:this.newMessage,messagedBy:this.user});
      this.newMessage = '';
    }
  }

}
