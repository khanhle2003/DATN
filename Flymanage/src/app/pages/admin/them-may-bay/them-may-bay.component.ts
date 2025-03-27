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
  editCache: { [key: string]: { edit: boolean; data: AircraftDTO } } = {};
  listOfData: AircraftDTO[] = [];
  newAircraft: {aircraftCode: string, aircraftType: string, economySeats: number, businessSeats: number, airlineId: number} = { aircraftCode: '', aircraftType: '', economySeats: 0, businessSeats: 0, airlineId: 0 };
  pageIndex = 1;
  pageSize = 6;
  total = 0;
  airlines: any[] = [];
  isAddModalVisible = false;

  constructor(private aircraftService: AircraftService, private airlineService: AirlineService, private message: NzMessageService) {
    this.loadAirlines();
  }

  ngOnInit(): void {
    this.aircraftService.getAllAircraft().subscribe(data => {
      this.listOfData = data; 
      this.total = data.length;
      this.updateEditCache();
    });
  }

  loadAirlines() {
    this.airlineService.getAirlines().subscribe(data => {
      this.airlines = data;
    });
  }

  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }
  updateEditCache(): void {
    this.listOfData.forEach(item => {
      if (item.id) {
        this.editCache[item.id] = {
          edit: false,
          data: { ...item }
        };
      }
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
          airlineId: 0
        };
        this.ngOnInit();
      });
    }
  }

  cancelEdit(id: number): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false
    };
  }
  saveEdit(id: number): void {
    const index = this.listOfData.findIndex(item => item.id === id);
    Object.assign(this.listOfData[index], this.editCache[id].data);
    this.aircraftService.updateAircraft(this.editCache[id].data.id!, this.editCache[id].data).subscribe(() => {
      this.editCache[id].edit = false; 
      this.ngOnInit();
    }); 

  }

  deleteAircraft(id: number): void {
    this.aircraftService.deleteAircraft(id).subscribe(() => {
      this.listOfData = this.listOfData.filter(item => item.id !== id);
    });
  }
}
