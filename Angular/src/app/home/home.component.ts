import { Component, OnInit, ViewChild } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {
  
images = [
  {title: 'Build your Network through us', short: 'Social Platform', src: "https://picsum.photos/id/700/900/500"},
  {title: 'Share your Ideas and Thougts', short: 'Post the Images and Videos', src: "https://picsum.photos/id/1011/900/500"},
  {title: 'Make World in your hand', short: 'Chat with your Freinds and Families', src: "https://picsum.photos/id/984/900/500"}
];
  constructor(config:NgbCarouselConfig) {
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  ngOnInit(): void {
  }


}
