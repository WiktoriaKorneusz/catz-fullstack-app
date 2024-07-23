import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ContactForm } from '../_models/contactForm';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  sendContactMessage(contactForm: ContactForm) {
    return this.http.post(this.apiUrl + 'mail/send', contactForm);
  }
}
