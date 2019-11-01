import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Observable } from 'rxjs';
import { NotificationsFacade } from '../+state/notifications.facade';

@Component({
  selector: 'swrx-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent implements OnInit {
  notifications$: Observable<any[]>;
  constructor(private facade: NotificationsFacade) {}

  ngOnInit() {
    this.notifications$ = this.facade.allNotifications$;
  }

  fetchData() {}

  addNotification() {}
}
