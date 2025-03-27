import { Component } from '@angular/core';
import { ChartTotalByyearComponent } from "./chart-total-byyear/chart-total-byyear.component";
import { ChartTtBybillComponent } from "./chart-tt-bybill/chart-tt-bybill.component";
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chart-mainpage',
  standalone: true,
  imports: [ChartTotalByyearComponent, ChartTtBybillComponent, CommonModule, NzTabsModule],
  templateUrl: './chart-mainpage.component.html',
  styleUrl: './chart-mainpage.component.css'
})
export class ChartMainpageComponent {
  selectedTab: string = 'year';
}
