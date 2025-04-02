import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/admin/user.service';
import { PersonDTO, PersonCreateDTO } from '../../../model/user.interface';
import { FormsModule, NgForm } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common'; 
import { ERole } from '../../../model/user.interface';
import { Observable } from 'rxjs';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
// import { Compressor } from 'compressorjs';

@Component({
  selector: 'app-qly-tai-khoan',
  standalone: true,
  imports: [
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzPopconfirmModule,
    CommonModule,
    NzMessageModule,
    NzModalModule,
    NzDatePickerModule
  ],
  templateUrl: './qly-tai-khoan.component.html',
  styleUrls: ['./qly-tai-khoan.component.css']
})
export class QlyTaiKhoanComponent implements OnInit {
  @ViewChild('personForm') personForm!: NgForm;
  listOfPersons: PersonDTO[] = [];
  newPerson: PersonCreateDTO = {
    username: '',
    password: '',
    email: '',
    phone: '',
    fullName: '',
    identityCard: '',
    passport: '',
    dateOfBirth: '',
    nationality: '',
    avatar: '',
    roles: []
  };
  roles = Object.values(ERole);
  pageSize = 6;
  total = 0;
  pageIndex = 1;
  editCache: { [key: string]: { edit: boolean; data: PersonDTO } } = {};
  isAddModalVisible = false;
  timestamp = Date.now();
  isEditModalVisible = false;
  editingPerson: any = {
    id: null,
    username: '',
    email: '',
    phone: '',
    fullName: '',
    identityCard: '',
    passport: '',
    dateOfBirth: '',
    nationality: '',
    roles: ''
  };
  constructor(
    private userService: UserService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.listOfPersons = data; 
      this.total = data.length;
      this.updateEditCache();
    });
  }
 
  showAddModal(): void {
    this.isAddModalVisible = true;
  }

  handleCancel(): void {
    this.isAddModalVisible = false;
  }

  addNewPerson(): void {
    if (this.personForm.valid) {
      this.userService.createUser(this.newPerson).subscribe(person => {
        this.listOfPersons.push(person);
        this.newPerson = { 
          username: '', 
          password: '', 
          email: '', 
          phone: '', 
          fullName: '', 
          identityCard: '', 
          passport: '', 
          dateOfBirth: '', 
          nationality: '', 
          avatar: '', 
          roles: [] 
        };
        this.isAddModalVisible = false;
        this.message.success('Thêm người dùng thành công!');
        this.ngOnInit();
      });
    }
  }

  deletePerson(id: number): void {
    this.userService.deleteUser(id).subscribe(() => {
      this.listOfPersons = this.listOfPersons.filter(person => person.id !== id);
    });
  }

  startEdit(id: number): void {
    this.editCache[id].edit = true;
  }
  cancelEdit(id: number): void {
    const index = this.listOfPersons.findIndex(item => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfPersons[index] },
      edit: false
    };
  }

  updateEditCache(): void {
    this.listOfPersons.forEach(item => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item }
      };
    });
  }

  updateUserRoles(id: number, roles: string[]): Observable<void> {
    return this.userService.updateUserRoles(id, roles);
  }


  clearAvatar(): void {
    this.newPerson.avatar = '';
  }

  handleAvatarError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
   
  }

  showEditModal(person: any): void {
    this.editingPerson = { ...person };
    this.isEditModalVisible = true;
  }

  handleEditCancel(): void {
    this.isEditModalVisible = false;
    this.editingPerson = {
      id: null,
      username: '',
      email: '',
      phone: '',
      fullName: '',
      identityCard: '',
      passport: '',
      dateOfBirth: '',
      nationality: '',
      roles: ''
    };
  }

  saveEdit(): void {
    this.userService.updateUser(this.editingPerson.id, this.editingPerson).subscribe(() => {
      this.message.success('Cập nhật người dùng thành công!');
      this.isEditModalVisible = false;
      this.ngOnInit();
    });
  }

}
