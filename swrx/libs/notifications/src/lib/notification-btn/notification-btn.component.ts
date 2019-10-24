import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'swrx-notification-btn',
  templateUrl: './notification-btn.component.html',
  styleUrls: ['./notification-btn.component.scss']
})
export class NotificationBtnComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  show() {
    console.log('Show notifications ');
    this.router.navigateByUrl('/notifications');
  }
}
