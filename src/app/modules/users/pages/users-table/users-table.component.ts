import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth.service';
import { UsersService } from '../../../../services/users.service';

import { DataSourceUser } from './data-source';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html'
})
export class UsersTableComponent implements OnInit  {

  dataSource = new DataSourceUser();
  columns: string[] = ['id', 'avatar', 'name', 'email'];
  user: User | null = null;
  constructor(private userService: UsersService,
    private authService: AuthService) {
   /*  this.dataSource.init([
      {
        id: 1,
        name: 'User 1',
        email: 'mail@mail.com',
        avatar: 'https://api.lorem.space/image/face?w=150&h=150'
      },
      {
        id: 2,
        name: 'User 2',
        email: 'mail2@mail.com',
        avatar: 'https://api.lorem.space/image/face?w=150&h=150'
      },
      {
        id: 3,
        name: 'User 3',
        email: 'mail3@mail.com',
        avatar: 'https://api.lorem.space/image/face?w=150&h=150'
      }
    ]); */
  }

  ngOnInit():void{
   this.getUsers();
    this.authService.user$
    .subscribe(user=>{
      this.user = user;
    })
  }

  getUsers(){
    this.userService.getUsers()
    .subscribe(users=>{
      this.dataSource.init(users);
    });
  }

}
