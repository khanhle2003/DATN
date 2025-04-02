import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from '../welcome/card/card.component';
import { AllFlightDetailComponent } from "./all-flight-detail/all-flight-detail.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [
    AllFlightDetailComponent, 
    FormsModule, 
    CommonModule, 
    InputTextModule, 
    ButtonModule,
    DropdownModule
  ],
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent {
  searchTerm: string = '';
  searchType: string = 'code';
  tempSearchTerm: string = '';
  tempSearchType: string = 'code';
  searchClicked: boolean = false;
  
  searchTypes = [
    { label: 'Mã chuyến bay', value: 'code' },
    { label: 'Sân bay đi', value: 'departure' },
    { label: 'Sân bay đến', value: 'arrival' },
    { label: 'Hãng bay', value: 'airline' }
  ];

  constructor() {}

  onSearch() {
    this.searchTerm = this.tempSearchTerm;
    this.searchType = this.tempSearchType;
    this.searchClicked = true;

    setTimeout(() => {
      this.searchClicked = false;
    }, 100);
  }

  refreshSearch() {
    this.tempSearchTerm = '';
    this.tempSearchType = 'code';
    
 
    this.searchTerm = '';
    this.searchType = 'code';
    this.searchClicked = true;
    

    setTimeout(() => {
      this.searchClicked = false;
    }, 100);
  }
}
