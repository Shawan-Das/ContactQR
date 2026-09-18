import { TestBed } from '@angular/core/testing';
import { VCardService } from './vcard.service';
import { Contact } from '../models/contact.model';

describe('VCardService', () => {
  let service: VCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate valid standard vCard 3.0', () => {
    const contact: Contact = {
      fullName: 'Syed Mashrur Rahman',
      organization: 'ABN Group',
      title: 'Legal Officer',
      phones: [{ type: 'mobile', number: '+880 17 2504 4615' }],
      emails: [{ type: 'work', email: 'mashrur@smralaw.com' }],
      urls: ['https://smralaw.com']
    };

    const vcard = service.generateVCard(contact);

    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('VERSION:3.0');
    expect(vcard).toContain('FN:Syed Mashrur Rahman');
    expect(vcard).toContain('N:Rahman;Syed Mashrur;;;');
    expect(vcard).toContain('ORG:ABN Group');
    expect(vcard).toContain('TITLE:Legal Officer');
    expect(vcard).toContain('TEL;TYPE=CELL:+880 17 2504 4615');
    expect(vcard).toContain('EMAIL;TYPE=WORK,INTERNET:mashrur@smralaw.com');
    expect(vcard).toContain('URL:https://smralaw.com');
    expect(vcard).toContain('END:VCARD');
  });

  it('should correctly escape special characters: comma, semicolon, backslash, newline', () => {
    const contact: Contact = {
      fullName: 'Doe, John; Jr.\\Sr.',
      organization: 'Acme, Inc.; Global',
      title: 'Head of R&D; Tech',
      phones: [],
      emails: [],
      urls: [],
      notes: 'Line 1\nLine 2; special, text\\test'
    };

    const vcard = service.generateVCard(contact);

    expect(vcard).toContain('FN:Doe\\, John\\; Jr.\\\\Sr.');
    expect(vcard).toContain('ORG:Acme\\, Inc.\\; Global');
    expect(vcard).toContain('TITLE:Head of R&D\\; Tech');
    expect(vcard).toContain('NOTE:Line 1\\nLine 2\\; special\\, text\\\\test');
  });

  it('should support Bengali / Unicode names and characters correctly', () => {
    const contact: Contact = {
      fullName: 'শাওন দাস',
      organization: 'প্রযুক্তি লিমিটেড',
      title: 'প্রকৌশলী',
      phones: [{ type: 'mobile', number: '+880 1711 000000' }],
      emails: [{ type: 'work', email: 'shaon@example.com' }],
      urls: [],
      address: {
        street: 'ধানমন্ডি ২৭',
        city: 'ঢাকা',
        country: 'বাংলাদেশ'
      }
    };

    const vcard = service.generateVCard(contact);

    expect(vcard).toContain('FN:শাওন দাস');
    expect(vcard).toContain('N:দাস;শাওন;;;');
    expect(vcard).toContain('ORG:প্রযুক্তি লিমিটেড');
    expect(vcard).toContain('TITLE:প্রকৌশলী');
    expect(vcard).toContain('ADR;TYPE=WORK:;;ধানমন্ডি ২৭;ঢাকা;;;বাংলাদেশ');
  });

  it('should format structured address correctly with empty state/postalCode', () => {
    const contact: Contact = {
      fullName: 'Jane Doe',
      phones: [],
      emails: [],
      urls: [],
      address: {
        street: '123 Tech Lane',
        city: 'Austin',
        country: 'USA'
      }
    };

    const vcard = service.generateVCard(contact);
    expect(vcard).toContain('ADR;TYPE=WORK:;;123 Tech Lane;Austin;;;USA');
  });

  it('should handle multiple phone numbers with specific types', () => {
    const contact: Contact = {
      fullName: 'Alex Morgan',
      phones: [
        { type: 'mobile', number: '+1 (555) 123-4567' },
        { type: 'work', number: '+1 (555) 987-6543' },
        { type: 'home', number: '+1 (555) 111-2222' },
        { type: 'fax', number: '+1 (555) 333-4444' }
      ],
      emails: [],
      urls: []
    };

    const vcard = service.generateVCard(contact);
    expect(vcard).toContain('TEL;TYPE=CELL:+1 (555) 123-4567');
    expect(vcard).toContain('TEL;TYPE=WORK:+1 (555) 987-6543');
    expect(vcard).toContain('TEL;TYPE=HOME:+1 (555) 111-2222');
    expect(vcard).toContain('TEL;TYPE=FAX:+1 (555) 333-4444');
  });

  it('should handle multiple email addresses', () => {
    const contact: Contact = {
      fullName: 'Sam Taylor',
      phones: [],
      emails: [
        { type: 'work', email: 'sam@company.com' },
        { type: 'home', email: 'sam.personal@gmail.com' }
      ],
      urls: []
    };

    const vcard = service.generateVCard(contact);
    expect(vcard).toContain('EMAIL;TYPE=WORK,INTERNET:sam@company.com');
    expect(vcard).toContain('EMAIL;TYPE=HOME,INTERNET:sam.personal@gmail.com');
  });

  it('should return empty string if full name is missing', () => {
    const contact: Contact = {
      fullName: '',
      phones: [],
      emails: [],
      urls: []
    };

    expect(service.generateVCard(contact)).toBe('');
  });
});
