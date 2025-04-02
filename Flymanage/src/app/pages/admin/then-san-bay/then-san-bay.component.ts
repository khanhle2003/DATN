import { Component, OnInit, ViewChild } from '@angular/core';
import { AirportService } from '../../../services/admin/airport.service';
import { Airport } from '../../../model/airport.interface';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgForm } from '@angular/forms';

type CreateAirport = Omit<Airport, 'id'>;

@Component({
  selector: 'app-then-san-bay',
  standalone: true,
  imports: [NzTableModule, NzButtonModule, NzInputModule, NzFormModule, FormsModule, CommonModule, NzModalModule],
  templateUrl: './then-san-bay.component.html',
  styleUrl: './then-san-bay.component.css'
})
export class ThenSanBayComponent implements OnInit {
  
  @ViewChild('airportForm') airportForm!: NgForm;
  listOfAirports: Airport[] = [];   
  newAirport: CreateAirport = {
    code: '',
    name: '',
    city: '',
    country: ''
  }; 
  pageSize: number = 6; 
  total: number = 0; 
  pageIndex: number = 1;
  isAddModalVisible = false;
  isEditModalVisible = false;
  
  editingAirport: any = {
    id: null,
    code: '',
    name: '',
    city: '',
    country: ''
  };

  constructor(private airportService: AirportService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.loadAirports(); 
    this.airportService.getAllAirports().subscribe(data => {
      this.listOfAirports = data; 
      this.total = data.length;
    });
  }

  loadAirports(): void {
    this.airportService.getAllAirports().subscribe(data => {
      this.listOfAirports = data;
      this.total = data.length; 
    });
  }

  showAddModal(): void {
    this.isAddModalVisible = true;
  }

  handleCancel(): void {
    this.isAddModalVisible = false;
  }

  addNewAirport(): void {
    if (this.airportForm.valid) {
      this.airportService.createAirport(this.newAirport).subscribe(airport => {
        this.listOfAirports.push(airport);
        this.isAddModalVisible = false;
        this.message.success('Thêm sân bay thành công!');
        this.newAirport = { code: '', name: '', city: '', country: '' };
        this.loadAirports();
      });
    }
  }

  deleteAirport(id: number): void {
    this.airportService.deleteAirport(id).subscribe(() => {
      this.listOfAirports = this.listOfAirports.filter(airport => airport.id !== id); 
      this.total = this.listOfAirports.length; 
    });
  }

  showEditModal(airport: any): void {
    this.editingAirport = { ...airport };
    this.isEditModalVisible = true;
  }

  handleEditCancel(): void {
    this.isEditModalVisible = false;
    this.editingAirport = {
      id: null,
      code: '',
      name: '',
      city: '',
      country: ''
    };
  }

  saveEdit(): void {
    this.airportService.updateAirport(this.editingAirport.id, this.editingAirport).subscribe(() => {
      this.message.success('Cập nhật sân bay thành công!');
      this.isEditModalVisible = false;
      this.loadAirports(); // Refresh the data
    });
  }
}
