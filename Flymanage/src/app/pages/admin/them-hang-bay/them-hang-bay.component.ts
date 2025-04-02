import { Component, OnInit, ViewChild } from '@angular/core';
import { AirlineService } from '../../../services/admin/airline.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ItemData } from '../../../model/airline.interface';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-them-hang-bay',
  standalone: true,
  imports: [FormsModule, CommonModule, NzTableModule, NzButtonModule, NzPopconfirmModule,NzModalModule,NzInputModule,NzFormModule],
  templateUrl: './them-hang-bay.component.html',
  styleUrls: ['./them-hang-bay.component.css']
})
export class ThemHangBayComponent implements OnInit {
  @ViewChild('airlineForm') airlineForm!: NgForm;
  listOfData: ItemData[] = [];
  isAddModalVisible = false;
  isEditModalVisible = false;
  newAirline: any = {
    name: '',
    code: '',
    country: ''
  };
  editingAirline: any = {
    id: null,
    name: '',
    code: '',
    country: ''
  };
  pageIndex = 1;
  pageSize = 6;
  total = 0;

  constructor(private airlineService: AirlineService, private authService: AuthService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.airlineService.getAirlines().subscribe(data => {
      this.listOfData = data; 
      this.total = data.length;
    });
  }

  deleteAirline(id: number): void {
    this.airlineService.deleteAirline(id).subscribe(() => {
      this.listOfData = this.listOfData.filter(item => item.id !== id);
    });
  } 

  showAddModal(): void {
    this.isAddModalVisible = true;
  }

  handleCancel(): void {
    this.isAddModalVisible = false;
    this.resetForm();
  }

  addNewAirline(): void {
    if (this.airlineForm.valid) {
      this.airlineService.addNewAirline(this.newAirline).subscribe(
        (response) => {
          this.isAddModalVisible = false;
          this.resetForm();
          this.ngOnInit();
          this.message.success('Thêm hãng bay thành công!');
        },
        (error) => {
          this.message.error('Có lỗi xảy ra khi thêm hãng bay!');
        }
      );
    }
  }

  private resetForm(): void {
    this.newAirline = {
      name: '',
      code: '',
      country: ''
    };
  }

  showEditModal(airline: any): void {
    this.editingAirline = { ...airline };
    this.isEditModalVisible = true;
  }

  handleEditCancel(): void {
    this.isEditModalVisible = false;
    this.editingAirline = {
      id: null,
      name: '',
      code: '',
      country: ''
    };
  }

  saveEdit(): void {
    this.airlineService.updateAirline(this.editingAirline).subscribe(() => {
      this.message.success('Cập nhật hãng bay thành công!');
      this.isEditModalVisible = false;
      this.ngOnInit();
    });
  }
}
