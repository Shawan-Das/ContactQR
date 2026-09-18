import { Injectable } from '@angular/core';
import { Contact, ContactPhone, ContactEmail, ContactAddress } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class VCardService {
  /**
   * Generates standard vCard 3.0 string from a Contact model
   */
  generateVCard(contact: Contact): string {
    const lines: string[] = [
      'BEGIN:VCARD',
      'VERSION:3.0'
    ];

    const fullName = (contact.fullName || '').trim();
    if (!fullName) {
      return '';
    }

    // Full name
    lines.push(`FN:${this.escapeValue(fullName)}`);

    // Structured Name: Family Names; Given Names; Additional Names; Honorific Prefixes; Honorific Suffixes
    const { lastName, firstName } = this.extractNameParts(contact);
    lines.push(`N:${this.escapeValue(lastName)};${this.escapeValue(firstName)};;;`);

    // Organization & Department
    const org = (contact.organization || '').trim();
    const dept = (contact.department || '').trim();
    if (org && dept) {
      lines.push(`ORG:${this.escapeValue(org)};${this.escapeValue(dept)}`);
    } else if (org) {
      lines.push(`ORG:${this.escapeValue(org)}`);
    }

    // Job Title
    const title = (contact.title || '').trim();
    if (title) {
      lines.push(`TITLE:${this.escapeValue(title)}`);
    }

    // Phone numbers
    if (contact.phones && contact.phones.length > 0) {
      contact.phones.forEach((phone: ContactPhone) => {
        const num = (phone.number || '').trim();
        if (num) {
          const type = this.mapPhoneType(phone.type);
          lines.push(`TEL;TYPE=${type}:${this.escapeValue(num)}`);
        }
      });
    }

    // Email addresses
    if (contact.emails && contact.emails.length > 0) {
      contact.emails.forEach((emailItem: ContactEmail) => {
        const email = (emailItem.email || '').trim();
        if (email) {
          const type = this.mapEmailType(emailItem.type);
          lines.push(`EMAIL;TYPE=${type}:${this.escapeValue(email)}`);
        }
      });
    }

    // URLs / Websites
    if (contact.urls && contact.urls.length > 0) {
      contact.urls.forEach((url: string) => {
        const trimmedUrl = (url || '').trim();
        if (trimmedUrl) {
          // Normalize URL prefix if missing protocol
          const finalUrl = this.normalizeUrl(trimmedUrl);
          lines.push(`URL:${this.escapeValue(finalUrl)}`);
        }
      });
    }

    // Structured Address: Post Office Box; Extended Address; Street; Locality; Region; Postal Code; Country
    if (contact.address && this.hasAddress(contact.address)) {
      const addr = contact.address;
      const street = this.escapeValue((addr.street || '').trim());
      const city = this.escapeValue((addr.city || '').trim());
      const state = this.escapeValue((addr.state || '').trim());
      const zip = this.escapeValue((addr.postalCode || '').trim());
      const country = this.escapeValue((addr.country || '').trim());

      lines.push(`ADR;TYPE=WORK:;;${street};${city};${state};${zip};${country}`);
    }

    // Notes
    const notes = (contact.notes || '').trim();
    if (notes) {
      lines.push(`NOTE:${this.escapeValue(notes)}`);
    }

    lines.push('END:VCARD');

    // Return with RFC-compliant CRLF line terminators
    return lines.join('\r\n');
  }

  /**
   * Escape vCard special characters according to RFC 2426
   */
  escapeValue(text: string): string {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\r?\n/g, '\\n');
  }

  private mapPhoneType(type: string): string {
    switch (type) {
      case 'mobile':
        return 'CELL';
      case 'work':
        return 'WORK';
      case 'home':
        return 'HOME';
      case 'fax':
        return 'FAX';
      case 'other':
      default:
        return 'VOICE';
    }
  }

  private mapEmailType(type: string): string {
    switch (type) {
      case 'work':
        return 'WORK,INTERNET';
      case 'home':
        return 'HOME,INTERNET';
      case 'other':
      default:
        return 'INTERNET';
    }
  }

  private extractNameParts(contact: Contact): { firstName: string; lastName: string } {
    if (contact.firstName || contact.lastName) {
      return {
        firstName: contact.firstName?.trim() || '',
        lastName: contact.lastName?.trim() || ''
      };
    }

    const full = (contact.fullName || '').trim();
    const parts = full.split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }
    const lastName = parts.pop() || '';
    const firstName = parts.join(' ');
    return { firstName, lastName };
  }

  private hasAddress(address: ContactAddress): boolean {
    return !!(
      address.street?.trim() ||
      address.city?.trim() ||
      address.state?.trim() ||
      address.postalCode?.trim() ||
      address.country?.trim()
    );
  }

  private normalizeUrl(url: string): string {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  }
}
