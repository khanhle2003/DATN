import { Component, OnInit, ViewChild } from '@angular/core';
import { AircraftService } from '../../../services/admin/aircraft.service';
import { AircraftDTO } from '../../../model/aircraft.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { AirlineService } from '../../../services/admin/airline.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
@Component({
  selector: 'app-them-may-bay',
  standalone: true,
  imports: [FormsModule, CommonModule, NzTableModule, NzButtonModule, NzPopconfirmModule, NzModalModule, NzInputModule,FormsModule,NzFormModule,NzSelectModule],
  templateUrl: './them-may-bay.component.html',
  styleUrls: ['./them-may-bay.component.css']
})
export class ThemMayBayComponent implements OnInit {
  @ViewChild('aircraftForm') aircraftForm!: NgForm;
  listOfData: AircraftDTO[] = [];
  airlines: any[] = [];
  isAddModalVisible = false;
  isEditModalVisible = false;
  
  newAircraft: any = {
    aircraftCode: '',
    aircraftType: '',
    economySeats: 0,
    businessSeats: 0,
    airlineId: null
  };

  editingAircraft: any = {
    id: null,
    aircraftCode: '',
    aircraftType: '',
    economySeats: 0,
    businessSeats: 0,
    airlineId: null
  };

  pageIndex = 1;
  pageSize = 6;
  total = 0;

  constructor(private aircraftService: AircraftService, private airlineService: AirlineService, private message: NzMessageService) {
    this.loadAirlines();
  }

  ngOnInit(): void {
    this.aircraftService.getAllAircraft().subscribe(data => {
      this.listOfData = data; 
      this.total = data.length;
    });
  }

  loadAirlines() {
    this.airlineService.getAirlines().subscribe(data => {
      this.airlines = data;
    });
  }

  showAddModal(): void {
    this.isAddModalVisible = true;
  }

  handleCancel(): void {
    this.isAddModalVisible = false;
  }

  addNewAircraft(): void {
    if (this.aircraftForm.valid) {
      this.aircraftService.createAircraft(this.newAircraft).subscribe(aircraft => {
        this.isAddModalVisible = false;
        this.message.success('Thêm máy bay thành công!');
        this.newAircraft = {
          aircraftCode: '',
          aircraftType: '',
          economySeats: 0,
          businessSeats: 0,
          airlineId: null
        };
        this.ngOnInit();
      });
    }
  }

  showEditModal(aircraft: any): void {
    this.editingAircraft = { ...aircraft };
    this.isEditModalVisible = true;
  }

  handleEditCancel(): void {
    this.isEditModalVisible = false;
    this.editingAircraft = {
      id: null,
      aircraftCode: '',
      aircraftType: '',
      economySeats: 0,
      businessSeats: 0,
      airlineId: null
    };
  }

  saveEdit(): void {
    this.aircraftService.updateAircraft(this.editingAircraft.id, this.editingAircraft).subscribe(() => {
      this.message.success('Cập nhật máy bay thành công!');
      this.isEditModalVisible = false;
      this.loadAirlines();
    });
  }

  deleteAircraft(id: number): void {
    this.aircraftService.deleteAircraft(id).subscribe(() => {
      this.listOfData = this.listOfData.filter(item => item.id !== id);
    });
  }
}
