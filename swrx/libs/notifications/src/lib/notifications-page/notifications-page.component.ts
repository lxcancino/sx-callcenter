import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'swrx-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent implements OnInit {
  notifications$: Observable<any[]>;
  constructor(private service: NotificationService) {}

  ngOnInit() {
    this.notifications$ = this.service.fetchNotifications();
  }

  fetchData() {
    this.service.fetchNotifications();
  }

  addNotification() {
    this.service.addNotification();
  }
}
