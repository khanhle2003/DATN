import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NzIconModule, RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  edit_2: string = ''
    edit_1: string = ''
    isLoggedIn: boolean = false;


  constructor(public authService: AuthService) {}

  ngOnInit() {

  }

  logout() {
    this.authService.logout();
    location.reload();
    location.href = 'welcome';
  }
}
