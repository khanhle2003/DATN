import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import html2canvas from 'html2canvas';
import { Flight, FlightService } from '../../../services/admin/flight.service';
import { CreateFlightRequest } from '../../../services/admin/flight.service';
import { AirportService } from '../../../services/admin/airport.service';
import { AircraftService } from '../../../services/admin/aircraft.service';
import { Airport } from '../../../model/airport.interface';
import { AircraftDTO } from '../../../model/aircraft.interface';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ScheduleEvent {
  flight: Flight;
  title: string;
  days: string[];
  startTime: Date;
  endTime: Date;
  description?: string;
}


@Component({
  selector: 'app-lich-bay',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzTimePickerModule,
    NzSelectModule,
    NzTableModule,
    NzDatePickerModule,
    NzInputNumberModule,
    FormsModule
  ],
  templateUrl: './lich-bay.component.html',
  styleUrl: './lich-bay.component.css'
})
export class LichBayComponent implements OnInit {
  @ViewChild('modalContent') modalContent!: TemplateRef<any>;

  timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  dayOptions: { label: string; value: string }[] = [
    { label: 'Mon', value: 'Monday' },
    { label: 'Tue', value: 'Tuesday' },
    { label: 'Wed', value: 'Wednesday' },
    { label: 'Thu', value: 'Thursday' },
    { label: 'Fri', value: 'Friday' },
    { label: 'Sat', value: 'Saturday' },
    { label: 'Sun', value: 'Sunday' }
  ];

  selectedDays: string[] = [];
  isAddEventModalVisible = false;
  eventForm: FormGroup;
  currentDate = new Date();
  weekDays: { name: string; date: Date }[] = [];
  currentWeekDisplay: string = '';
  flights: Flight[] = [];
  scheduleEvents: ScheduleEvent[] = [];
  selectedTime: Date | null = null;
  selectedDay: any = null;
  airports: Airport[] = [];
  aircrafts: AircraftDTO[] = [];
  isEditMode = false;
  selectedEvent: ScheduleEvent | null = null;

  formatterVND = (value: number): string => `₫ ${value}`;
  parserVND = (value: string): string => value.replace('₫ ', '');

  readonly flightColors = [
    { bg: '#e6f4ff', border: '#1890ff' },
    { bg: '#fff7e6', border: '#ffa940' },
    { bg: '#f6ffed', border: '#52c41a' },
    { bg: '#fff1f0', border: '#ff4d4f' },
    { bg: '#f9f0ff', border: '#722ed1' },
    { bg: '#e6fffb', border: '#13c2c2' },
    { bg: '#fcffe6', border: '#a0d911' },
    { bg: '#fff0f6', border: '#eb2f96' }
  ];

  constructor(
    private fb: FormBuilder,
    private flightService: FlightService,
    private airportService: AirportService,
    private aircraftService: AircraftService,
    private message: NzMessageService
  
  ) {
    this.eventForm = this.fb.group({
      flightCode: ['', Validators.required],
      departureTime: [null, Validators.required],
      arrivalTime: [null, Validators.required],
      basePrice: [null, [Validators.required, Validators.min(0)]],
      status: [1, Validators.required], // Default status
      departureAirportId: [null, Validators.required],
      arrivalAirportId: [null, Validators.required],
      aircraftId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.currentDate = new Date('2025-03-25');
    this.updateWeekDays();
    this.loadFlights();
    this.loadAirports();
    this.loadAircrafts();
  }

  loadFlights() {
    this.flightService.getFlights().subscribe({
      next: (flights) => {
        this.flights = flights;
     
        this.scheduleEvents = flights.map(flight => ({
          flight: flight,
          title: `${flight.flightCode}`,
          days: [this.getDayOfWeek(new Date(flight.departureTime))],
          startTime: new Date(flight.departureTime),
          endTime: new Date(flight.arrivalTime),
          description: `Flight ${flight.flightCode}`
        }));
      },
      error: (error) => console.error('Error loading flights:', error)
    });
  }

  private getDayOfWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  updateWeekDays() {
    const startOfWeek = new Date(this.currentDate);
    startOfWeek.setDate(this.currentDate.getDate() - this.currentDate.getDay() + 1);

    this.weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      this.weekDays.push({
        name: this.dayOptions[i].value,
        date: date
      });
    }

    const firstDay = this.weekDays[0].date;
    const lastDay = this.weekDays[6].date;
    this.currentWeekDisplay = `${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}`;
  }

  previousWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.updateWeekDays();
    this.loadFlights(); 
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.updateWeekDays();
    this.loadFlights(); 
  }

  openAddEventModal(day: string, timeSlot: string): void {
    this.selectedDays = [day];
    const startHour = parseInt(timeSlot.split(':')[0], 10);
    const startTime = new Date();
    startTime.setHours(startHour, 0, 0);
    
    const endTime = new Date();
    endTime.setHours((startHour + 2) % 24, 0, 0); 
    
    this.eventForm.patchValue({
      startTime: startTime,
      endTime: endTime
    });

    this.isAddEventModalVisible = true;
  }

  onCellClick(day: any, time: string, event: MouseEvent): void {

    const target = event.target as HTMLElement;
    if (target.closest('.schedule-event')) {
      return; 
    }


    this.resetForm();
    

    const date = new Date(day.date);
    const [hours] = time.split(':');
    date.setHours(parseInt(hours, 10), 0, 0);
    
    this.selectedTime = date;
    this.isEditMode = false; 
    this.isAddEventModalVisible = true;
    
 
    this.eventForm.patchValue({
      departureTime: date,
      arrivalTime: new Date(date.getTime() + 2 * 60 * 60 * 1000), 
      status: 1 
    });
  }

  onEventClick(event: any, e: MouseEvent): void {
    e.stopPropagation(); 
    
    this.selectedEvent = event;
    this.isEditMode = true;

    this.eventForm.patchValue({
      flightCode: event.flight.flightCode,
      departureTime: new Date(event.flight.departureTime),
      arrivalTime: new Date(event.flight.arrivalTime),
      basePrice: event.flight.basePrice,
      status: event.flight.status,
      departureAirportId: event.flight.departureAirportId,
      arrivalAirportId: event.flight.arrivalAirportId,
      aircraftId: event.flight.aircraftId
    });
    
    this.isAddEventModalVisible = true;
  }

  submitEventForm(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      // Chuyển đổi thời gian về đúng múi giờ local
      const formatDateTime = (date: Date): string => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().slice(0, 19);
      };

      const requestData = {
        id: this.isEditMode && this.selectedEvent ? this.selectedEvent.flight.id : 0,
        flightCode: formValue.flightCode,
        departureTime: formatDateTime(formValue.departureTime),
        arrivalTime: formatDateTime(formValue.arrivalTime),
        basePrice: Number(formValue.basePrice),
        status: Number(formValue.status),
        departureAirportId: Number(formValue.departureAirportId),
        arrivalAirportId: Number(formValue.arrivalAirportId),
        aircraftId: Number(formValue.aircraftId),
        airlineId: this.selectedEvent?.flight.airlineId || 0
      };

      if (this.isEditMode && this.selectedEvent) {
        this.flightService.updateFlight(this.selectedEvent.flight.id, requestData as Flight).subscribe({
          next: () => {
            this.message.success('Cập nhật chuyến bay thành công!');
            this.isAddEventModalVisible = false;
            this.loadFlights();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error updating flight:', error);
            this.message.error('Cập nhật thất bại!');
          }
        });
      } else {
        this.flightService.createFlight(requestData as Flight).subscribe({
          next: () => {
            this.isAddEventModalVisible = false;
            this.loadFlights();
            this.resetForm();
          },
          error: (error) => console.error('Error creating flight:', error)
        });
      }
    }
  }

  getEventsForCell(day: string, timeSlot: string): any[] {
    const slotHour = parseInt(timeSlot.split(':')[0], 10);
    
    return this.scheduleEvents.filter(event => {
      const eventStartDate = new Date(event.flight.departureTime);
      const eventEndDate = new Date(event.flight.arrivalTime);
      const cellDate = this.weekDays.find(d => d.name === day)?.date;
      
      if (!cellDate) return false;

      // Kiểm tra xem có chênh lệch ngày không
      const isDifferentDays = eventStartDate.getDate() !== eventEndDate.getDate() ||
                            eventStartDate.getMonth() !== eventEndDate.getMonth() ||
                            eventStartDate.getFullYear() !== eventEndDate.getFullYear();

      if (isDifferentDays) {
        // PHẦN 1: Ngày khởi hành, chỉ hiển thị nếu giờ bắt đầu của ô trùng với giờ khởi hành
        const isPart1 = 
          cellDate.getDate() === eventStartDate.getDate() &&
          cellDate.getMonth() === eventStartDate.getMonth() &&
          cellDate.getFullYear() === eventStartDate.getFullYear() &&
          slotHour === eventStartDate.getHours();

        // PHẦN 2: Ngày đến, chỉ hiển thị ở ô 00:00
        const isPart2 = 
          cellDate.getDate() === eventEndDate.getDate() &&
          cellDate.getMonth() === eventEndDate.getMonth() &&
          cellDate.getFullYear() === eventEndDate.getFullYear() &&
          slotHour === 0;

        // Debug log để theo dõi
        if (isPart1 || isPart2) {
          console.log(`Event trong ô ${day} ${timeSlot}:`, {
            flightCode: event.flight.flightCode,
            isPart1,
            isPart2,
            isDifferentDays,
            startDate: eventStartDate.toLocaleString(),
            endDate: eventEndDate.toLocaleString(),
            cellDate: cellDate.toLocaleString(),
            slotHour
          });
        }

        return isPart1 || isPart2;
      } else {
        // Chuyến bay trong ngày
        const isSameDay = 
          cellDate.getDate() === eventStartDate.getDate() &&
          cellDate.getMonth() === eventStartDate.getMonth() &&
          cellDate.getFullYear() === eventStartDate.getFullYear() &&
          slotHour === eventStartDate.getHours();

        return isSameDay;
      }
    });
  }

  getEventHeight(event: ScheduleEvent): string {
    const start = new Date(event.flight.departureTime);
    const end = new Date(event.flight.arrivalTime);
    

    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    

    const cellHeight = 60;
    const height = cellHeight * durationHours;
    
    return `${height}px`;
  }

  getEventStyle(event: any): any {
    const departureTime = new Date(event.flight.departureTime);
    const arrivalTime = new Date(event.flight.arrivalTime);
    
    // Kiểm tra xem có chênh lệch ngày không
    const isDifferentDays = departureTime.getDate() !== arrivalTime.getDate() ||
                           departureTime.getMonth() !== arrivalTime.getMonth() ||
                           departureTime.getFullYear() !== arrivalTime.getFullYear();
                           
    // Xác định đây là phần 1 hay phần 2
    const isSecondPart = isDifferentDays && this.weekDays.find(d => 
      d.date.getDate() === arrivalTime.getDate() && 
      d.date.getMonth() === arrivalTime.getMonth() && 
      d.date.getFullYear() === arrivalTime.getFullYear()
    );
    
    // Xử lý riêng cho từng phần
    if (isDifferentDays) {
      if (isSecondPart) {
        // PHẦN 2: Từ 00:00 đến arrival time
        const startHour = 0;
        const startMinutes = 0;
        const durationHours = arrivalTime.getHours() + (arrivalTime.getMinutes() / 60);
        const topPercentage = 0; // Bắt đầu từ 00:00 nên top = 0%
        const height = durationHours * 60; // 1 giờ = 60px
        
        console.log('PHẦN 2 (Ngày đến):', {
          flightCode: event.flight.flightCode,
          startTime: '00:00',
          endTime: arrivalTime.toLocaleTimeString(),
          durationHours,
          height: `${height}px`
        });
        
        // Return riêng cho PHẦN 2
        return {
          position: 'absolute',
          top: `${topPercentage}%`,
          left: '4px',
          right: '4px',
          height: `${height}px`,
          backgroundColor: '#fff0f6', // Màu khác cho phần 2
          borderLeft: `4px solid #eb2f96`, // Viền khác cho phần 2
          padding: '4px 8px',
          zIndex: 1,
          cursor: 'pointer',
          borderRadius: '4px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        };
      } else {
        // PHẦN 1: Từ departure time đến 23:59
        const startHour = departureTime.getHours();
        const startMinutes = departureTime.getMinutes();
        const durationHours = (24 - startHour - (startMinutes / 60));
        const totalMinutesFromDayStart = startHour * 60 + startMinutes;
        const topPercentage = (totalMinutesFromDayStart / (24 * 60)) * 100;
        const height = durationHours * 60; // 1 giờ = 60px
        
        console.log('PHẦN 1 (Ngày khởi hành):', {
          flightCode: event.flight.flightCode,
          startTime: departureTime.toLocaleTimeString(),
          endTime: '23:59',
          durationHours,
          height: `${height}px`
        });
        
        // Return riêng cho PHẦN 1
        return {
          position: 'absolute',
          top: `${topPercentage}%`,
          left: '4px',
          right: '4px',
          height: `${height}px`,
          backgroundColor: '#e6f4ff', // Màu cho phần 1
          borderLeft: `4px solid #1890ff`, // Viền cho phần 1
          padding: '4px 8px',
          zIndex: 1,
          cursor: 'pointer',
          borderRadius: '4px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        };
      }
    } else {
      // CHUYẾN BAY TRONG NGÀY
      const startHour = departureTime.getHours();
      const startMinutes = departureTime.getMinutes();
      const durationHours = (arrivalTime.getTime() - departureTime.getTime()) / (1000 * 60 * 60);
      const totalMinutesFromDayStart = startHour * 60 + startMinutes;
      const topPercentage = (totalMinutesFromDayStart / (24 * 60)) * 100;
      const height = durationHours * 60; // 1 giờ = 60px
      
      console.log('CHUYẾN BAY TRONG NGÀY:', {
        flightCode: event.flight.flightCode,
        startTime: departureTime.toLocaleTimeString(),
        endTime: arrivalTime.toLocaleTimeString(),
        durationHours,
        height: `${height}px`
      });
      
      // Return cho chuyến bay trong ngày
      return {
        position: 'absolute',
        top: `${topPercentage}%`,
        left: '4px',
        right: '4px',
        height: `${height}px`,
        backgroundColor: this.flightColors[event.flight.id % this.flightColors.length].bg,
        borderLeft: `4px solid ${this.flightColors[event.flight.id % this.flightColors.length].border}`,
        padding: '4px 8px',
        zIndex: 1,
        cursor: 'pointer',
        borderRadius: '4px',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      };
    }
  }

  handleModalCancel(): void {
    this.isAddEventModalVisible = false;
    this.eventForm.reset();
  }

  resetForm(): void {
    this.eventForm.reset();
    this.isEditMode = false;
    this.selectedEvent = null;
    this.selectedDays = [];
  }

  toggleDay(day: string): void {
    const index = this.selectedDays.indexOf(day);
    if (index === -1) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays.splice(index, 1);
    }
  }

  resetSchedule(): void {
    this.scheduleEvents = [];
  }

  private parseTimeString(timeStr: string): Date {
    const [hours] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, 0, 0, 0);
    return date;
  }

  onAddClick(): void {
    this.isAddEventModalVisible = true;
  }

  saveAsPng(): void {
    const scheduleElement = document.querySelector('.schedule-container') as HTMLElement;
    if (!scheduleElement) return;

    // Lưu lại các style ban đầu
    const originalStyles = new Map();
    const elementsToModify = [
      scheduleElement,
      ...Array.from(scheduleElement.querySelectorAll('.schedule-table')),
      ...Array.from(scheduleElement.querySelectorAll('.schedule-row')),
      ...Array.from(scheduleElement.querySelectorAll('.time-cell')),
      ...Array.from(scheduleElement.querySelectorAll('.day-cell'))
    ];

    elementsToModify.forEach((element) => {
      const htmlElement = element as HTMLElement;
      originalStyles.set(htmlElement, {
        height: htmlElement.style.height,
        maxHeight: htmlElement.style.maxHeight,
        overflow: htmlElement.style.overflow,
        position: htmlElement.style.position,
        display: htmlElement.style.display
      });

    
      htmlElement.style.height = 'auto';
      htmlElement.style.maxHeight = 'none';
      htmlElement.style.overflow = 'visible';
    });


    setTimeout(() => {
      html2canvas(scheduleElement, {
        allowTaint: true,
        useCORS: true,
        scale: 2, 
        backgroundColor: '#ffffff',
        logging: true,
        scrollY: 0,
        scrollX: 0,
        windowHeight: document.documentElement.scrollHeight,
        width: scheduleElement.scrollWidth, 
        height: scheduleElement.scrollHeight, 
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.schedule-container') as HTMLElement;
          if (clonedElement) {

            clonedElement.style.width = `${scheduleElement.scrollWidth}px`;
            clonedElement.style.height = `${scheduleElement.scrollHeight}px`;
            

            const clonedRows = clonedElement.querySelectorAll('.schedule-row, .time-cell, .day-cell');
            clonedRows.forEach((row) => {
              const htmlRow = row as HTMLElement;
              htmlRow.style.height = 'auto';
              htmlRow.style.maxHeight = 'none';
              htmlRow.style.overflow = 'visible';
            });
          }
        }
      }).then(canvas => {

        const imgData = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `schedule_${new Date().toISOString().replace(/:/g, '-').slice(0, 19)}.png`;
        link.href = imgData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);


        elementsToModify.forEach((element) => {
          const htmlElement = element as HTMLElement;
          const originalStyle = originalStyles.get(htmlElement);
          if (originalStyle) {
            Object.keys(originalStyle).forEach(key => {
              htmlElement.style[key as any] = originalStyle[key];
            });
          }
        });
      }).catch(err => {
        console.error('Failed to generate image', err);
        elementsToModify.forEach((element) => {
          const htmlElement = element as HTMLElement;
          const originalStyle = originalStyles.get(htmlElement);
          if (originalStyle) {
            Object.keys(originalStyle).forEach(key => {
              htmlElement.style[key as any] = originalStyle[key];
            });
          }
        });
      });
    }, 100);
  }

  formatFlightTime(timeStr: string): Date {
    return new Date(timeStr);
  
  }

  loadAirports() {
    this.airportService.getAllAirports().subscribe({
      next: (airports) => {
        this.airports = airports;
      },
      error: (error) => console.error('Error loading airports:', error)
    });
  }

  loadAircrafts() {
    this.aircraftService.getAllAircraft().subscribe({
      next: (aircrafts) => {
        this.aircrafts = aircrafts;
      },
      error: (error) => console.error('Error loading aircrafts:', error)
    });
  }
}
