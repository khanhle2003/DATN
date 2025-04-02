import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { StatisticsService } from '../../../services/statistics.service';

@Component({
  selector: 'app-chart-total-byyear',
  standalone: true,
  imports: [ChartModule, DropdownModule, CommonModule, FormsModule, CalendarModule, InputNumberModule],
  templateUrl: './chart-total-byyear.component.html',
  styleUrl: './chart-total-byyear.component.css'
})
export class ChartTotalByyearComponent implements OnInit {
  data: any = {
    labels: [],
    datasets: [
      {
        label: 'Tổng tiền',
        data: [],
        backgroundColor: '#42A5F5'
      }
    ]
  };

  options: any = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    }
  };

  years: number[] = [];
  selectedStartYear: number | null = null;
  selectedEndYear: number | null = null;
  minYear = new Date().getFullYear() - 10;
  maxYear = new Date().getFullYear();

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 10; year <= currentYear; year++) {
      this.years.push(year);
    }

    this.selectedEndYear = currentYear;
    this.selectedStartYear = currentYear - 4; 
    this.onApply();
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
      
      this.statisticsService.getYearlyStatistics(years).subscribe(data => {
        this.data = {
          labels: data.map(item => item.year.toString()),
          datasets: [{
            label: 'Tổng tiền',
            data: data.map(item => item.total),
            backgroundColor: '#42A5F5'
          }]
        };
      });
    }
  }

  onApply() {
    this.updateChart();
  }
}
