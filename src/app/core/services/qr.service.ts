import { Injectable } from '@angular/core';
import * as QRCode from 'qrcode';
import { QROptions } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  private defaultOptions: QROptions = {
    errorCorrectionLevel: 'M',
    margin: 3,
    width: 600
  };

  /**
   * Generates a high-resolution PNG data URL for the given payload.
   */
  async generatePngDataUrl(payload: string, options?: Partial<QROptions>): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };
    return QRCode.toDataURL(payload, {
      errorCorrectionLevel: opts.errorCorrectionLevel,
      margin: opts.margin,
      width: opts.width,
      color: {
        dark: '#0f172a', // Slate 900 for high-contrast crisp readability
        light: '#ffffff'
      }
    });
  }

  /**
   * Generates a clean SVG string for high-definition print/vector output.
   */
  async generateSvgString(payload: string, options?: Partial<QROptions>): Promise<string> {
    const opts = { ...this.defaultOptions, ...options };
    return QRCode.toString(payload, {
      type: 'svg',
      errorCorrectionLevel: opts.errorCorrectionLevel,
      margin: opts.margin,
      width: opts.width,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
  }

  /**
   * Sanitizes a name to generate safe, readable filenames.
   */
  sanitizeFilename(name: string, suffix: string, extension: string): string {
    const clean = (name || 'contact')
      .trim()
      .toLowerCase()
      .replace(/[\/\\:*?"<>|]/g, '') // remove unsafe filesystem characters
      .replace(/\s+/g, '-') // spaces to dashes
      .replace(/-+/g, '-'); // collapse dashes

    const base = clean || 'contact';
    const post = suffix ? `-${suffix}` : '';
    return `${base}${post}.${extension}`;
  }

  /**
   * Triggers browser download of a data URL (PNG)
   */
  downloadDataUrl(dataUrl: string, filename: string): void {
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  /**
   * Triggers browser download of text content (SVG, VCF)
   */
  downloadTextFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }

  /**
   * Copies string content to system clipboard
   */
  async copyToClipboard(text: string): Promise<boolean> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        return this.fallbackCopy(text);
      }
    }
    return this.fallbackCopy(text);
  }

  private fallbackCopy(text: string): boolean {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch {
      success = false;
    }
    document.body.removeChild(textArea);
    return success;
  }
}
