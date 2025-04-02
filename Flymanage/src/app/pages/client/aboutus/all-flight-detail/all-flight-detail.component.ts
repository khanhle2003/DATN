import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Flight } from '../../../../services/admin/flight.service';
import { FlightService } from '../../../../services/admin/flight.service';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-all-flight-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink, CardModule, NzPaginationModule],   
  templateUrl: './all-flight-detail.component.html',
  styleUrl: './all-flight-detail.component.css'
})
export class AllFlightDetailComponent implements OnChanges {
  @Input() searchTerm: string = '';
  @Input() searchType: string = 'code';
  @Input() searchClicked: boolean = false;
  
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  pageSize = 8; 
  currentPage = 1; 
  
  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    this.flightService.getFlights().subscribe(flights => {
      this.flights = flights;
      this.filteredFlights = flights;
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchClicked'] && this.searchClicked && this.flights.length > 0) {
      this.filterFlights();
      this.currentPage = 1; // Reset về trang đầu tiên khi tìm kiếm
    }
  }
  
  filterFlights(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredFlights = this.flights;
      return;
    }
    
    const term = this.searchTerm.toLowerCase().trim();
    
    this.filteredFlights = this.flights.filter(flight => {
      switch (this.searchType) {
        case 'code':
          return flight.flightCode.toLowerCase().includes(term);
        case 'departure':
          return flight.departureAirportName.toLowerCase().includes(term);
        case 'arrival':
          return flight.arrivalAirportName.toLowerCase().includes(term);
        case 'airline':
          return flight.airlineName.toLowerCase().includes(term);
        default:
          return flight.flightCode.toLowerCase().includes(term);
      }
    });
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VNĐ';
  }

  get pagedFlights(): Flight[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredFlights.slice(startIndex, startIndex + this.pageSize);
  }

  onPageIndexChange(page: number): void {
    this.currentPage = page;
  }
}
