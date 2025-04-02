import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { FlightService, Flight } from '../../../services/admin/flight.service';
import { AirportService } from '../../../services/admin/airport.service';
import { AircraftService } from '../../../services/admin/aircraft.service';
import { AirlineService } from '../../../services/admin/airline.service';

@Component({
  selector: 'app-them-chuyen-bay',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzTableModule, NzInputModule, NzButtonModule, NzFormModule, NzSelectModule, NzModalModule, NzInputNumberModule, NzMessageModule],
  templateUrl: './them-chuyen-bay.component.html',
  styleUrl: './them-chuyen-bay.component.css'
})
export class ThemChuyenBayComponent implements OnInit {
  flights: Flight[] = [];
  newFlight: Flight = this.createEmptyFlight();
  airports: any[] = [];
  aircrafts: any[] = [];
  airlines: any[] = [];

  pageIndex = 1;
  pageSize = 6;
  total = 0;
  editCache: { [key: number]: { edit: boolean; data: Flight } } = {};
  isAddModalVisible = false;
  isEditModalVisible = false;

  editingFlight: any = {
    id: null,
    flightCode: '',
    departureAirportId: null,
    arrivalAirportId: null,
    departureTime: '',
    arrivalTime: '',
    basePrice: 0,
    status: 0,
    aircraftId: null,
    airlineId: null
  };

  constructor(
    private flightService: FlightService,
    private airportService: AirportService,
    private aircraftService: AircraftService,
    private airlineService: AirlineService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadFlights();
    this.loadAirports();
    this.loadAircrafts();
    this.loadAirlines();
  }

  loadFlights(): void {
    this.flightService.getFlights().subscribe(data => {
      this.flights = data;
      this.total = data.length;
      this.updateEditCache();
    });
  }

  showAddModal(): void {
    this.isAddModalVisible = true;
  }

  handleCancel(): void {
    this.isAddModalVisible = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newFlight = this.createEmptyFlight();
  }

  loadAirports(): void {
    this.airportService.getAllAirports().subscribe(data => {
      this.airports = data;
    });
  }

  loadAircrafts(): void {
    this.aircraftService.getAllAircraft().subscribe(data => {
      this.aircrafts = data;
    });
  }

  loadAirlines(): void {
    this.airlineService.getAirlines().subscribe(data => {
      this.airlines = data;
    });
  }

  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    const index = this.flights.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.flights[index] },
      edit: false
    };
  }

  saveEdit(): void {
    this.flightService.updateFlight(this.editingFlight.id, this.editingFlight).subscribe(() => {
      this.message.success('Cập nhật chuyến bay thành công!');
      this.isEditModalVisible = false;
      this.loadFlights();
    });
  }

  deleteFlight(id: number): void {
    this.flightService.deleteFlight(id).subscribe(() => {
      this.flights = this.flights.filter(item => item.id !== id);
      this.updateEditCache();
    });
  }

  addNewFlight(): void {
    this.flightService.createFlight(this.newFlight).subscribe(flight => {
      this.flights.push(flight);
      this.newFlight = this.createEmptyFlight();
      this.updateEditCache();
      this.message.success('Thêm chuyến bay thành công!');
      this.loadFlights();
    });
  }

  updateEditCache(): void {
    this.flights.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  createEmptyFlight(): Flight {
    return {
      id: 0,
      flightCode: '',
      departureTime: '',
      arrivalTime: '',
      basePrice: 0,
      status: 0,
      departureAirportId: 0,
      arrivalAirportId: 0,
      aircraftId: 0,
      airlineId: 0,
      departureAirportName: '',
      arrivalAirportName: '',
      airlineName: '',
      aircraftName: ''
    };
  }

  handleEditCancel(): void {
    this.isEditModalVisible = false;
    this.editingFlight = this.createEmptyFlight();
  }


  showEditModal(flight: Flight): void {
    this.editingFlight = { ...flight };
    this.isEditModalVisible = true;
  }
}
