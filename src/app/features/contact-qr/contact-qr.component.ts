import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { VCardService } from '../../core/services/vcard.service';
import { QrService } from '../../core/services/qr.service';
import { Contact, PhoneType, EmailType } from '../../core/models/contact.model';

@Component({
  selector: 'app-contact-qr',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-qr.component.html',
  styleUrls: ['./contact-qr.component.scss']
})
export class ContactQrComponent implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  qrPngDataUrl: string = '';
  qrSvgString: string = '';
  vcardContent: string = '';
  payloadByteCount: number = 0;
  isGenerated: boolean = false;
  isGenerating: boolean = false;
  toastMessage: string = '';
  showToast: boolean = false;
  showPrivacyModal: boolean = false;

  private formSubscription?: Subscription;
  private formChange$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private vcardService: VCardService,
    private qrService: QrService
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Auto-update generated QR on change if already generated
    this.formSubscription = this.formChange$
      .pipe(
        debounceTime(350),
        filter(() => this.isGenerated && this.contactForm.valid)
      )
      .subscribe(() => {
        this.generateQrCode(false);
      });
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      organization: [''],
      title: [''],
      department: [''],
      phones: this.fb.array([
        this.createPhoneGroup('mobile', '')
      ]),
      emails: this.fb.array([
        this.createEmailGroup('work', '')
      ]),
      urls: this.fb.array([
        this.fb.control('')
      ]),
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: ['']
      }),
      notes: ['']
    });

    this.contactForm.valueChanges.subscribe(() => {
      this.formChange$.next();
    });
  }

  get phonesArray(): FormArray {
    return this.contactForm.get('phones') as FormArray;
  }

  get emailsArray(): FormArray {
    return this.contactForm.get('emails') as FormArray;
  }

  get urlsArray(): FormArray {
    return this.contactForm.get('urls') as FormArray;
  }

  createPhoneGroup(type: PhoneType = 'mobile', number: string = ''): FormGroup {
    return this.fb.group({
      type: [type],
      number: [number]
    });
  }

  createEmailGroup(type: EmailType = 'work', email: string = ''): FormGroup {
    return this.fb.group({
      type: [type],
      email: [email, [Validators.email]]
    });
  }

  addPhone(type: PhoneType = 'mobile'): void {
    this.phonesArray.push(this.createPhoneGroup(type, ''));
  }

  removePhone(index: number): void {
    if (this.phonesArray.length > 1) {
      this.phonesArray.removeAt(index);
    } else {
      this.phonesArray.at(0).reset({ type: 'mobile', number: '' });
    }
    this.formChange$.next();
  }

  addEmail(type: EmailType = 'work'): void {
    this.emailsArray.push(this.createEmailGroup(type, ''));
  }

  removeEmail(index: number): void {
    if (this.emailsArray.length > 1) {
      this.emailsArray.removeAt(index);
    } else {
      this.emailsArray.at(0).reset({ type: 'work', email: '' });
    }
    this.formChange$.next();
  }

  addUrl(): void {
    this.urlsArray.push(this.fb.control(''));
  }

  removeUrl(index: number): void {
    if (this.urlsArray.length > 1) {
      this.urlsArray.removeAt(index);
    } else {
      this.urlsArray.at(0).reset('');
    }
    this.formChange$.next();
  }

  async generateQrCode(showToastNotice: boolean = true): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isGenerating = true;

    try {
      const formVal = this.contactForm.value;
      const contact: Contact = {
        fullName: formVal.fullName,
        organization: formVal.organization,
        title: formVal.title,
        department: formVal.department,
        phones: (formVal.phones || []).filter((p: { number: string }) => p.number && p.number.trim()),
        emails: (formVal.emails || []).filter((e: { email: string }) => e.email && e.email.trim()),
        urls: (formVal.urls || []).filter((u: string) => u && u.trim()),
        address: formVal.address,
        notes: formVal.notes
      };

      const vcard = this.vcardService.generateVCard(contact);
      this.vcardContent = vcard;
      this.payloadByteCount = new TextEncoder().encode(vcard).length;

      // Generate both PNG and SVG outputs
      const [pngUrl, svgStr] = await Promise.all([
        this.qrService.generatePngDataUrl(vcard, { errorCorrectionLevel: 'M', margin: 3, width: 640 }),
        this.qrService.generateSvgString(vcard, { errorCorrectionLevel: 'M', margin: 3, width: 640 })
      ]);

      this.qrPngDataUrl = pngUrl;
      this.qrSvgString = svgStr;
      this.isGenerated = true;

      if (showToastNotice) {
        this.triggerToast('QR code generated successfully!');
      }
    } catch (error) {
      console.error('QR Generation failed:', error);
      this.triggerToast('Failed to generate QR code. Please check your contact fields.');
    } finally {
      this.isGenerating = false;
    }
  }

  downloadPng(): void {
    if (!this.qrPngDataUrl) return;
    const name = this.contactForm.value.fullName;
    const filename = this.qrService.sanitizeFilename(name, 'contact-qr', 'png');
    this.qrService.downloadDataUrl(this.qrPngDataUrl, filename);
    this.triggerToast(`Downloaded ${filename}`);
  }

  downloadSvg(): void {
    if (!this.qrSvgString) return;
    const name = this.contactForm.value.fullName;
    const filename = this.qrService.sanitizeFilename(name, 'contact-qr', 'svg');
    this.qrService.downloadTextFile(this.qrSvgString, filename, 'image/svg+xml');
    this.triggerToast(`Downloaded ${filename}`);
  }

  downloadVcf(): void {
    if (!this.vcardContent) return;
    const name = this.contactForm.value.fullName;
    const filename = this.qrService.sanitizeFilename(name, '', 'vcf');
    this.qrService.downloadTextFile(this.vcardContent, filename, 'text/vcard');
    this.triggerToast(`Downloaded ${filename}`);
  }

  async copyVCard(): Promise<void> {
    if (!this.vcardContent) return;
    const success = await this.qrService.copyToClipboard(this.vcardContent);
    if (success) {
      this.triggerToast('vCard copied to clipboard!');
    } else {
      this.triggerToast('Could not copy to clipboard.');
    }
  }

  printQr(): void {
    if (!this.isGenerated) return;
    window.print();
  }

  resetForm(): void {
    this.contactForm.reset();
    this.phonesArray.clear();
    this.emailsArray.clear();
    this.urlsArray.clear();
    this.phonesArray.push(this.createPhoneGroup('mobile', ''));
    this.emailsArray.push(this.createEmailGroup('work', ''));
    this.urlsArray.push(this.fb.control(''));
    this.qrPngDataUrl = '';
    this.qrSvgString = '';
    this.vcardContent = '';
    this.payloadByteCount = 0;
    this.isGenerated = false;
    this.triggerToast('Form cleared. Memory state reset.');
  }

  loadSampleData(): void {
    this.contactForm.patchValue({
      fullName: 'Syed Mashrur Rahman',
      organization: 'ABN Group',
      title: 'Legal Officer',
      department: 'Corporate Advisory',
      address: {
        street: '275/G Road No. 27 (Old), Dhanmondi R/A',
        city: 'Dhaka',
        state: '',
        postalCode: '1205',
        country: 'Bangladesh'
      },
      notes: 'Available for corporate and IP advisory consultations.'
    });

    this.phonesArray.clear();
    this.phonesArray.push(this.createPhoneGroup('mobile', '+880 17 2504 4615'));
    this.phonesArray.push(this.createPhoneGroup('work', '+880 2 9103931'));

    this.emailsArray.clear();
    this.emailsArray.push(this.createEmailGroup('work', 'mashrur@smralaw.com'));

    this.urlsArray.clear();
    this.urlsArray.push(this.fb.control('https://smralaw.com'));

    this.generateQrCode(true);
  }

  triggerToast(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  get formValues() {
    return this.contactForm.value;
  }
}
