import { Routes } from '@angular/router';
import { LoginComponent } from './component/auth/login/login.component';
import { DashboardComponent } from './component/layout/dashboard/dashboard.component';
import { WelcomeComponent } from './pages/client/welcome/welcome.component';
import { AppComponent } from './app.component';
import { AboutusComponent } from './pages/client/aboutus/aboutus.component';
import { RegisterComponent } from './component/auth/register/register.component';
import { DetailFlightComponent } from './pages/client/detail-flight/detail-flight.component';
import { ThemChuyenBayComponent } from './pages/admin/them-chuyen-bay/them-chuyen-bay.component';
import { ThemHangBayComponent } from './pages/admin/them-hang-bay/them-hang-bay.component';
  import { ThemMayBayComponent } from './pages/admin/them-may-bay/them-may-bay.component';
  import { ThenSanBayComponent } from './pages/admin/then-san-bay/then-san-bay.component';
  import { QlyTaiKhoanComponent } from './pages/admin/qly-tai-khoan/qly-tai-khoan.component';
import { QlyDatChoComponent } from './pages/admin/qly-dat-cho/qly-dat-cho.component';
import { QlyThanhToanComponent } from './pages/admin/qly-thanh-toan/qly-thanh-toan.component';
import { ThongTinTaiKhoanComponent } from './pages/client/thong-tin-tai-khoan/thong-tin-tai-khoan.component';
import { VeChungToiComponent } from './pages/client/ve-chung-toi/ve-chung-toi.component';
import { GioHangComponent } from './pages/client/gio-hang/gio-hang.component';
import { ThanhToanComponent } from './pages/client/thanh-toan/thanh-toan.component';
import { ChartMainpageComponent } from './pages/chart-mainpage/chart-mainpage.component';
import { LichBayComponent } from './pages/admin/lich-bay/lich-bay.component';




  export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path: 'aboutus', component: AboutusComponent },
      { path: 'flight-detail/:id', component: DetailFlightComponent }, 
      { path: 'admin/them-chuyen-bay', component: ThemChuyenBayComponent },
      { path: 'admin/them-hang-bay', component: ThemHangBayComponent },
      { path: 'admin/them-may-bay', component: ThemMayBayComponent },
      { path: 'admin/them-san-bay', component: ThenSanBayComponent },
      { path: 'admin/qly-tai-khoan', component: QlyTaiKhoanComponent },
      { path: 'admin/qly-dat-cho', component: QlyDatChoComponent},
      { path: 'admin/qly-thanh-toan', component: QlyThanhToanComponent},
      { path: 'admin/chart-mainpage', component: ChartMainpageComponent},
      { path: 'client/thong-tin-tai-khoan', component: ThongTinTaiKhoanComponent},
      { path: 'client/ve-chung-toi', component: VeChungToiComponent},
      { path: 'client/gio-hang', component: GioHangComponent},
      { path: 'client/thanh-toan', component: ThanhToanComponent},
      { path: 'auth/flight-list', component: LichBayComponent},
    ],
  },
  
];
