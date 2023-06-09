import { Component, Input, OnInit } from "@angular/core";
import { Message } from "../../models/Message";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() message!: Message;
  alertClass?: string;
  alertMessage?: string;

  ngOnInit() {
    if (this.message.error) {
      this.alertClass = 'danger';
      this.alertMessage = this.message.error;
    } else if (this.message.success) {
      this.alertClass = 'success';
      this.alertMessage = this.message.success;
    } else if (this.message.info) {
      this.alertClass = 'info';
      this.alertMessage = this.message.info;
    }
  }
}
