import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, NzLayoutModule, NzIconModule, NzMenuModule, RouterModule, FooterComponent, HeaderComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  isCollapsed = false;
  isLoggedIn = false;
  fullName: string | null = null;
  roles: string[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.fullName = localStorage.getItem('fullName');
    this.roles = JSON.parse(localStorage.getItem('roles') || '[]');

    this.authService.isLoggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      localStorage.setItem('isLoggedIn', String(loggedIn));
    });

    this.authService.userName$.subscribe(name => {
      this.fullName = name;
      localStorage.setItem('fullName', name || '');
    });

    this.authService.roles$.subscribe(roles => {
      this.roles = roles;
      localStorage.setItem('roles', JSON.stringify(roles));
    });
  }
}
