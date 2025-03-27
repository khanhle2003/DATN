import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from "./card/card.component";
import { DichVuComponent } from "./dich-vu/dich-vu.component";
import { PhuongChamComponent } from "./phuong-cham/phuong-cham.component";
import { CamOnComponent } from "./cam-on/cam-on.component";
@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, CardComponent,DichVuComponent,PhuongChamComponent,CamOnComponent],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  city: string | undefined; 

  constructor() { }

  ngOnInit() {
    this.getLocation(); 
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error);
    } 
  }

  success(position: GeolocationPosition) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
  
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`)
      .then(response => response.json())
      .then(data => {
        this.city = data.principalSubdivision || data.city || data.locality; 
        console.log(`Bạn đang ở: ${this.city}`);
      })
      .catch(err => console.error(err));
  }

  error() {
    console.log("Không thể lấy vị trí của bạn.");
  }
}
