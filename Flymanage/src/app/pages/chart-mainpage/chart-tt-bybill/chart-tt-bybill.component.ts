import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsService } from '../../../services/statistics.service';

@Component({
  selector: 'app-chart-tt-bybill',
  standalone: true,
  imports: [ChartModule, InputNumberModule, CommonModule, FormsModule],
  templateUrl: './chart-tt-bybill.component.html',
  styleUrl: './chart-tt-bybill.component.css'
})
export class ChartTtBybillComponent implements OnInit {
  data: any;
  options: any;
  selectedStartYear: number = new Date().getFullYear() - 4;
  selectedEndYear: number = new Date().getFullYear();
  minYear = new Date().getFullYear() - 10;
  maxYear = new Date().getFullYear();

  constructor(private statisticsService: StatisticsService) {
    this.options = {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
  
            font: {
              size: 14
            }
          }
        },
  
      }
    };
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.selectedEndYear = currentYear;
    this.selectedStartYear = currentYear - 4;
    this.updateChart();
  }

  onYearChange() {
    if (this.selectedStartYear && this.selectedEndYear) {
      if (this.selectedEndYear - this.selectedStartYear >= 10) {
        this.selectedEndYear = this.selectedStartYear + 9;
      }
      this.updateChart();
    }
  }

  updateChart() {
    if (this.selectedStartYear && this.selectedEndYear) {
      const years: number[] = [];
      const startYear = Math.min(this.selectedStartYear, this.selectedEndYear);
      const endYear = Math.max(this.selectedStartYear, this.selectedEndYear);
      
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      
      this.statisticsService.getBookingStatistics(years).subscribe(data => {
        this.data = {
          labels: data.map(item => item.period),
          datasets: [{
            label: 'Số lượng đặt phòng',
            data: data.map(item => item.totalBookings),
            backgroundColor: '#42A5F5'
          }]
        };
      });
    }
  }
}
