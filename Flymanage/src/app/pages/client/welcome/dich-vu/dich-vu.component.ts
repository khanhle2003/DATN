import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
@Component({
  selector: 'app-dich-vu',
  standalone: true,
  imports: [ButtonModule, CarouselModule],
  templateUrl: './dich-vu.component.html',
  styleUrl: './dich-vu.component.css'
})
export class DichVuComponent {
  responsiveOptions: any[] = [];
  numVisible: number = 3;
  numScroll: number = 1;
  circular: boolean = true;
  autoplayInterval: number = 3000;
services = [
  {
    title: 'Dịch vụ chuyển phát hàng hóa giá trị cao',
    description: 'Dịch vụ chuyển phát hàng hóa giá trị cao: Chúng tôi cam kết bảo đảm an toàn cho hàng hóa và giao hàng đúng giờ, mang lại sự yên tâm cho khách hàng khi gửi hàng hóa có giá trị cao.',
    image: 'https://th.bing.com/th/id/OIP.TSKhXUp59zREZX0GKouRewHaEz?rs=1&pid=ImgDetMain'
  },
  {
    title: 'Dịch vụ chuyển phát hẹn giờ, giao hàng theo yêu cầu',
    description: 'Dịch vụ chuyển phát hẹn giờ, giao hàng theo yêu cầu: Chúng tôi cung cấp dịch vụ chuyển phát hẹn giờ, giúp bạn tạo bất ngờ cho những người thân yêu với những món quà đúng thời điểm.',
    image: 'https://storage.timviec365.vn/timviec365/pictures/news/2020/06/26/yho1593179988.jpg'
  },
  {
    title: 'Dịch vụ chăm sóc khách hàng',
    description: 'Dịch vụ chăm sóc khách hàng: Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho khách hàng, đảm bảo mọi thắc mắc và yêu cầu được giải quyết nhanh chóng và hiệu quả.',
    image: 'https://als.com.vn/api/file-management/file-descriptor/view/7b7006d4-9325-9316-8276-3a11cda3bd63'
  },
  {
    title: 'Dịch vụ chuyển phát hỏa tốc',
    description: 'Dịch vụ chuyển phát hỏa tốc: Với dịch vụ chuyển phát nhanh hỏa tốc, chúng tôi đảm bảo hàng hóa của bạn sẽ được giao đến tay người nhận trong thời gian ngắn nhất.',
    image: 'https://www.ntlogistics.vn/assets/images/mobile/hoatoc.png'
  },
  {
    title: 'Dịch vụ đăng ký hàng hóa',
    description: 'Dịch vụ đăng ký hàng hóa: Chúng tôi cung cấp dịch vụ đăng ký hàng hóa, giúp bạn theo dõi và quản lý hàng hóa của mình một cách dễ dàng và hiệu quả.',
    image: 'https://airasiacargo.vn/wp-content/uploads/2023/06/Red-and-Blue-Modern-Logistic-Company-Presentation-7-1024x576.png'
  },
  {
    title: 'Luôn luôn lắng nghe khách hàng',
    description: 'Luôn luôn lắng nghe khách hàng: Chúng tôi coi trọng ý kiến của khách hàng và luôn lắng nghe để cải thiện dịch vụ, mang lại trải nghiệm tốt nhất cho bạn.',
    image: 'https://th.bing.com/th/id/R.e0143652876d8178ccf0b1fb8e25da1e?rik=NUUXBDSMrfqA%2fA&pid=ImgRaw&r=0'
  },
  {
    title: 'Dịch vụ vận chuyển hàng công kênh, nặng',
    description: 'Dịch vụ vận chuyển hàng công kênh, nặng: Chúng tôi chuyên cung cấp dịch vụ vận chuyển hàng công kênh và hàng nặng, đảm bảo an toàn và hiệu quả trong quá trình vận chuyển.',
    image: 'https://als.com.vn/api/file-management/file-descriptor/view/7b7006d4-9325-9316-8276-3a11cda3bd63'
  },
  
  
  
]


reponsiveOptions = [
  {
    breakpoint: 768,
    numVisible: 1,
    numScroll: 1
  },
  {
    breakpoint: 520,
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: 400,
    numVisible: 3,
    numScroll: 1
  },
  {
    breakpoint: 300,
    numVisible: 4,
    numScroll: 1
  },  
{
  breakpoint: 200,
  numVisible: 5,
  numScroll: 1
},
{
  breakpoint: 100,
  numVisible: 6,
  numScroll: 1
}
]
}
