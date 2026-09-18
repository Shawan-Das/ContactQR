import { Component } from '@angular/core';
import { ContactQrComponent } from './features/contact-qr/contact-qr.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContactQrComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'contact-qr';
}
