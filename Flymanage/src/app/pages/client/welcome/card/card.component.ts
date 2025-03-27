import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FlightService } from '../../../../services/admin/flight.service';
import { Flight } from '../../../../services/admin/flight.service';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule, 
    NzCardModule, 
    NzIconModule, 
    NzTagModule, 
    NzGridModule,
    NzDividerModule,
    CardModule,
    ButtonModule,
    RouterModule
  ],
  templateUrl: './card.component.html',
  styleUrl: 'card.component.css'
})
export class CardComponent implements OnInit {
  flights: Flight[] = [];
  loading = true;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights(): void {
    this.flightService.getFlights().subscribe({
      next: (data) => {
        this.flights = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching flights:', error);
        this.loading = false;
      }
    });
  }

  

  formatPrice(price: number): string {
    return price.toLocaleString('vi-VN') + ' VND';
  }

  formatDateTime(dateTime: string): { time: string, date: string } {
    const dt = new Date(dateTime);
    const time = dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const date = dt.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return { time, date };
  }

  calculateDuration(departure: string, arrival: string): string {
    const departureTime = new Date(departure).getTime();
    const arrivalTime = new Date(arrival).getTime();
    const durationMs = arrivalTime - departureTime;
    
    const hours = Math.floor(durationMs / (60 * 60 * 1000));
    const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  }
}

