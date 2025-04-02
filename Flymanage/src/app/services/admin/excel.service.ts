import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  
  constructor() { }
  
  exportFlightSchedule(timeSlots: string[], weekDays: any[], getEventsForCell: Function): void {
    const excelData: any[] = [];
    
    // Tạo hàng tiêu đề
    const headerRow = ['Time'];
    weekDays.forEach(day => {
      headerRow.push(`${day.name} (${new Date(day.date).toLocaleDateString()})`);
    });
    excelData.push(headerRow);

    // Tạo mảng để theo dõi các ô cần merge
    const mergeCells: { s: { r: number, c: number }, e: { r: number, c: number } }[] = [];
    
    // Xử lý tất cả các chuyến bay và lập lịch merge cells
    const flightMergeCellsInfo = new Map();
    
    // Lưu thông tin tất cả các chuyến bay trước
    for (let colIndex = 0; colIndex < weekDays.length; colIndex++) {
      const day = weekDays[colIndex];
      
      for (let rowIndex = 0; rowIndex < timeSlots.length; rowIndex++) {
        const timeSlot = timeSlots[rowIndex];
        const events = getEventsForCell(day.name, timeSlot);
        
        for (const event of events) {
          const flightId = event.flight.id.toString();
          const departureTime = new Date(event.flight.departureTime);
          const arrivalTime = new Date(event.flight.arrivalTime);
          
          // Kiểm tra xem chuyến bay có qua đêm không
          const isCrossingMidnight = departureTime.getDate() !== arrivalTime.getDate() ||
                                    departureTime.getMonth() !== arrivalTime.getMonth() ||
                                    departureTime.getFullYear() !== arrivalTime.getFullYear();
          
          // Tìm vị trí bắt đầu trong bảng
          const departureHour = departureTime.getHours();
          const startRowIndex = timeSlots.findIndex(slot => parseInt(slot.split(':')[0]) === departureHour);
          
          if (startRowIndex !== -1) {
            if (isCrossingMidnight) {
              // Phần 1: Từ giờ khởi hành đến cuối ngày
              const hoursUntilMidnight = 24 - departureHour;
              const endRowIndex1 = Math.min(startRowIndex + hoursUntilMidnight - 1, timeSlots.length - 1);
              
              flightMergeCellsInfo.set(flightId + '_part1_' + colIndex, {
                startRow: startRowIndex + 1, // +1 do có hàng tiêu đề
                endRow: endRowIndex1 + 1,
                column: colIndex + 1, // +1 do có cột Time
                event: event,
                part: 1, // Đánh dấu là phần 1
                processed: false
              });
              
              // Phần 2: Từ 00:00 đến giờ hạ cánh (nếu ngày hôm sau nằm trong tuần)
              if (colIndex < weekDays.length - 1) {
                const arrivalHour = arrivalTime.getHours();
                const endRowIndex2 = Math.min(arrivalHour, timeSlots.length - 1);
                
                flightMergeCellsInfo.set(flightId + '_part2_' + (colIndex + 1), {
                  startRow: 1, // Bắt đầu từ 00:00
                  endRow: endRowIndex2 + 1,
                  column: colIndex + 2, // Cột của ngày hôm sau
                  event: event,
                  part: 2, // Đánh dấu là phần 2
                  processed: false
                });
              }
            } else {
              // Chuyến bay trong cùng một ngày
              const durationMs = arrivalTime.getTime() - departureTime.getTime();
              const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
              const endRowIndex = Math.min(startRowIndex + durationHours - 1, timeSlots.length - 1);
              
              flightMergeCellsInfo.set(flightId + '_' + colIndex, {
                startRow: startRowIndex + 1, // +1 do có hàng tiêu đề
                endRow: endRowIndex + 1,
                column: colIndex + 1, // +1 do có cột Time
                event: event,
                part: 0, // Chuyến bay không qua đêm
                processed: false
              });
            }
          }
        }
      }
    }
    
    // Tạo các hàng dữ liệu
    timeSlots.forEach((timeSlot, rowIndex) => {
      const row = [timeSlot];
      
      weekDays.forEach((day, colIndex) => {
        const cellEvents: string[] = [];
        
        // Kiểm tra các chuyến bay bắt đầu tại ô này
        flightMergeCellsInfo.forEach((info, key) => {
          if (info.startRow === rowIndex + 1 && info.column === colIndex + 1 && !info.processed) {
            const event = info.event;
            let eventText = '';
            
            // Thông tin máy bay từ database
            const aircraftInfo = event.flight.aircraftType || `Aircraft ID: ${event.flight.aircraftId}`;
            
            if (info.part === 1) {
              // Phần 1 của chuyến bay qua đêm
              const departDate = new Date(event.flight.departureTime).toLocaleDateString();
              const departTime = new Date(event.flight.departureTime).toLocaleTimeString();
              eventText = `${event.flight.flightCode} (${departDate} ${departTime} - 23:59)\n${event.flight.departureAirportName} → ${event.flight.arrivalAirportName}\nMáy bay: ${aircraftInfo}`;
            } else if (info.part === 2) {
              // Phần 2 của chuyến bay qua đêm
              const arrivalDate = new Date(event.flight.arrivalTime).toLocaleDateString();
              const arrivalTime = new Date(event.flight.arrivalTime).toLocaleTimeString();
              eventText = `${event.flight.flightCode} (00:00 - ${arrivalDate} ${arrivalTime})\n${event.flight.departureAirportName} → ${event.flight.arrivalAirportName}\nMáy bay: ${aircraftInfo}`;
            } else {
              // Chuyến bay không qua đêm
              const departDate = new Date(event.flight.departureTime).toLocaleDateString();
              const departTime = new Date(event.flight.departureTime).toLocaleTimeString();
              const arrivalDate = new Date(event.flight.arrivalTime).toLocaleDateString();
              const arrivalTime = new Date(event.flight.arrivalTime).toLocaleTimeString();
              eventText = `${event.flight.flightCode} (${departDate} ${departTime} - ${arrivalDate} ${arrivalTime})\n${event.flight.departureAirportName} → ${event.flight.arrivalAirportName}\nMáy bay: ${aircraftInfo}`;
            }
            
            cellEvents.push(eventText);
            
            // Đánh dấu đã xử lý
            info.processed = true;
            
            // Thêm merge nếu kéo dài nhiều hơn 1 giờ
            if (info.endRow > info.startRow) {
              mergeCells.push({
                s: { r: info.startRow, c: info.column },
                e: { r: info.endRow, c: info.column }
              });
            }
          }
        });
        
        row.push(cellEvents.length > 0 ? cellEvents.join('\n\n') : '');
      });
      
      excelData.push(row);
    });
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    
    // Áp dụng các merge đã xác định
    ws['!merges'] = mergeCells;
    
    const colWidths = [
      { wch: 10 }, 
      { wch: 40 }, 
      { wch: 40 }, 
      { wch: 40 }, 
      { wch: 40 }, 
      { wch: 40 }, 
      { wch: 40 }, 
      { wch: 40 }  
    ];
    ws['!cols'] = colWidths;
    
    XLSX.utils.book_append_sheet(wb, ws, 'Flight Schedule');
    
    const fileName = `flight_schedule_${new Date().toISOString().slice(0, 10)}.xlsx`;
    
    XLSX.writeFile(wb, fileName);
  }
} 