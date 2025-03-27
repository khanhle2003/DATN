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
  editCache: { [key: string]: { edit: boolean; data: Airport } } = {};
  @ViewChild('airportForm') airportForm!: NgForm;
  isAddModalVisible = false;

  constructor(private airportService: AirportService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.loadAirports(); 
    this.airportService.getAllAirports().subscribe(data => {
      this.listOfAirports = data; 
      this.total = data.length;
      this.updateEditCache();
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
  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }
  cancelEdit(id: number): void {
      const index = this.listOfAirports.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfAirports[index] },
      edit: false
    };
  }
  saveEdit(id: number): void {
    const index = this.listOfAirports.findIndex(item => item.id === id);
    Object.assign(this.listOfAirports[index], this.editCache[id].data);
    this.airportService.updateAirport(id, this.editCache[id].data).subscribe(() => {
      this.editCache[id].edit = false; 
    });
  }

  updateEditCache(): void {
    this.listOfAirports.forEach(item => {
      if (item.id) {
        this.editCache[item.id] = {
          edit: false,
          data: { ...item }
        };
      }
    });
  }
}
