export type PhoneType = 'mobile' | 'work' | 'home' | 'fax' | 'other';
export type EmailType = 'work' | 'home' | 'other';

export interface ContactPhone {
  type: PhoneType;
  number: string;
}

export interface ContactEmail {
  type: EmailType;
  email: string;
}

export interface ContactAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Contact {
  fullName: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  title?: string;
  department?: string;
  phones: ContactPhone[];
  emails: ContactEmail[];
  urls: string[];
  address?: ContactAddress;
  notes?: string;
}

export interface QROptions {
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  width: number;
}
