import { TestBed } from '@angular/core/testing';
import { QrService } from './qr.service';

describe('QrService', () => {
  let service: QrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a PNG data URL from payload', async () => {
    const dataUrl = await service.generatePngDataUrl('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nEND:VCARD');
    expect(dataUrl).toBeTruthy();
    expect(dataUrl.startsWith('data:image/png;base64,')).toBeTrue();
  });

  it('should generate an SVG string from payload', async () => {
    const svg = await service.generateSvgString('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nEND:VCARD');
    expect(svg).toBeTruthy();
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('should sanitize filenames safely and avoid illegal characters', () => {
    const rawName = 'Syed Mashrur/Rahman: <Test>*?';
    const filename = service.sanitizeFilename(rawName, 'contact-qr', 'png');
    expect(filename).toBe('syed-mashrur-rahman-test-contact-qr.png');
    expect(filename).not.toContain('/');
    expect(filename).not.toContain(':');
    expect(filename).not.toContain('*');
    expect(filename).not.toContain('?');
    expect(filename).not.toContain('<');
  });

  it('should provide fallback name when name is empty', () => {
    const filename = service.sanitizeFilename('', '', 'vcf');
    expect(filename).toBe('contact.vcf');
  });
});
