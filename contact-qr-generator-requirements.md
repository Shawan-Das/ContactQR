# Contact QR Generator — Full System Requirements & Process

## 1. Project Overview

Build a simple, privacy-first web application that allows a user to enter contact information and generate a QR code containing that contact information in standard **vCard** format.

The application must be **100% client-side**.

### Core principle

> The application must generate the contact QR code without storing, transmitting, or persisting the user's contact information.

There must be:

- No user registration
- No login
- No database
- No backend API
- No server-side contact storage
- No account/profile system
- No requirement to send contact information to any server
- No dynamic QR system
- No permanent contact URL

The application can be deployed as a static web application.

---

# 2. Main User Goal

A user should be able to:

1. Open the website.
2. Enter a person's contact information.
3. Click **Generate QR Code**.
4. See a QR code generated from the entered information.
5. Download the QR code as an image.
6. Optionally download the generated contact as a `.vcf` file.
7. Print or share the QR code.
8. Another person scans the QR code with a phone.
9. The phone recognizes the embedded vCard/contact information.
10. The recipient can add the contact to their phone.

Example:

```text
User enters contact information
        ↓
Browser creates vCard
        ↓
vCard is encoded into QR
        ↓
QR displayed on screen
        ↓
User downloads/prints/shares QR
        ↓
Another person scans QR
        ↓
Phone reads vCard
        ↓
Contact information appears
        ↓
Recipient chooses Add Contact
```

---

# 3. Important Architecture Requirement

## Client-side only

The application must perform all contact processing inside the browser.

```text
Browser
  │
  ├── Contact Form
  │
  ├── vCard Generator
  │
  ├── QR Code Generator
  │
  ├── QR Preview
  │
  └── File Download
```

There should be no application server involved in generating the contact.

The hosting platform only needs to serve the frontend files.

---

# 4. Privacy Requirements

Privacy is one of the most important requirements.

### Contact information must not be sent to a server.

When the user enters:

- Name
- Phone number
- Email
- Company
- Address
- Website
- etc.

the browser should process the information locally.

Do not implement:

```text
POST /contacts
POST /generate
POST /users
POST /profiles
```

There should be no API for contact information.

### No database

Do not create:

- PostgreSQL
- MySQL
- MongoDB
- Supabase
- Firebase database
- Any other persistent database

### No permanent storage

Do not automatically save contact information in:

- localStorage
- sessionStorage
- IndexedDB
- cookies

unless a future requirement explicitly adds a local-only draft feature.

The default behavior should be temporary browser memory only.

When the page is refreshed/closed, the entered contact information should disappear.

---

# 5. Technology Requirements

Use a modern frontend framework.

Preferred:

- Angular
- TypeScript
- SCSS

The implementation should be clean, modular, maintainable and production-ready.

Use a reliable QR-code library rather than implementing the QR algorithm manually.

Use a standard vCard format.

---

# 6. Application Pages

The application should preferably be a single-page application.

## Main page

Route:

```text
/
```

The main page contains:

- Application header
- Contact information form
- QR preview area
- Generation controls
- Download controls
- Helpful instructions
- Privacy statement

No login page is required.

No dashboard is required.

No profile page is required.

---

# 7. Main UI Concept

Create a professional, modern, clean interface.

The design should feel like a polished utility application rather than an enterprise administration panel.

Recommended structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ Logo / App Name                              Privacy        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              Create Contact QR Code                         │
│     Generate a QR code that lets others save your           │
│                  contact information.                       │
│                                                             │
├──────────────────────────┬──────────────────────────────────┤
│                          │                                  │
│  Contact Information     │       QR Preview                 │
│                          │                                  │
│  Form                    │       QR Code                     │
│                          │                                  │
│                          │       Contact Name                 │
│                          │       Company / Title              │
│                          │                                  │
│  [ Generate QR Code ]    │       [Download PNG]             │
│                          │       [Download SVG]              │
│                          │       [Download vCard]            │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

On mobile, the layout should become a single column:

```text
Form
 ↓
Generate
 ↓
QR Preview
 ↓
Download buttons
```

---

# 8. Contact Form

The form should be divided into logical sections.

## 8.1 Personal Information

### Full Name

Required.

Field:

```text
Full Name *
```

This should become the vCard `FN` value.

Example:

```text
Syed Mashrur Rahman
```

---

## 8.2 Professional Information

### Organization

Optional.

Example:

```text
ABN Group
```

vCard:

```text
ORG:ABN Group
```

### Job Title

Optional.

Example:

```text
Legal Officer
```

vCard:

```text
TITLE:Legal Officer
```

### Department

Optional.

If supported, map appropriately in the vCard.

---

# 9. Phone Numbers

Support multiple phone numbers.

At minimum:

### Mobile

Optional.

```text
+880 17 2504 4615
```

### Work

Optional.

```text
+880 2 9103931
```

### Home

Optional.

### Fax

Optional.

The UI should allow the user to add/remove additional phone fields if desired.

Example:

```text
Phone Numbers

[ Mobile ]     [ +880 17 2504 4615 ]     [ Remove ]

[ Work   ]     [ +880 2 9103931    ]     [ Remove ]

[ + Add Phone Number ]
```

Do not require every phone type.

At least one contact method should be present besides the required name, unless the UX intentionally allows name-only cards.

---

# 10. Email Addresses

Support multiple email addresses.

At minimum:

```text
Email
```

Example:

```text
mashrur@smralaw.com
```

Allow adding another email if needed.

Example:

```text
[ Work ] mashrur@smralaw.com
[ Home ] example@gmail.com

[ + Add Email ]
```

---

# 11. Website

Optional.

Example:

```text
https://example.com
```

Also allow URLs such as:

```text
https://linkedin.com/in/example
https://facebook.com/example
```

The application should not force social networks into separate fields unless that improves UX.

A general website/URL field is sufficient for the first version.

---

# 12. Address

Support a structured address rather than a single large text field.

Fields:

```text
Street / Address
City
State / Province
Postal Code
Country
```

Example:

```text
Street:
275/G Road No. 27 (Old), Dhanmondi R/A

City:
Dhaka

Postal Code:
1205

Country:
Bangladesh
```

Generate the appropriate vCard `ADR` value.

---

# 13. Additional Contact Information

Optional fields may include:

- Birthday
- Notes
- Role
- Department
- Organization
- Multiple URLs

These should not make the interface unnecessarily complicated.

The first version should prioritize common business-card information.

---

# 14. Optional Contact Photo

Consider supporting an optional contact photo.

However, this should be implemented carefully.

If included:

- The image must be processed entirely in the browser.
- It must never be uploaded.
- It should be converted/embedded into the vCard if the selected vCard version and target phone compatibility support it.
- Large images should be resized/compressed locally.
- Provide a clear explanation that embedding a photo can make the QR code significantly larger.

If photo support causes QR reliability or compatibility problems, it can be excluded from the first release.

---

# 15. vCard Generation

The central technical feature is generating a valid vCard.

Prefer:

```text
VERSION:3.0
```

for broad compatibility unless testing demonstrates a better standard/version.

Basic example:

```text
BEGIN:VCARD
VERSION:3.0
FN:Syed Mashrur Rahman
ORG:ABN Group
TITLE:Legal Officer
TEL;TYPE=CELL:+8801725044615
TEL;TYPE=WORK:+88029103931
TEL;TYPE=FAX:+880249345300
EMAIL;TYPE=WORK:mashrur@smralaw.com
URL:https://example.com
ADR;TYPE=WORK:;;275/G Road No. 27 (Old), Dhanmondi R/A;Dhaka;;1205;Bangladesh
END:VCARD
```

The generator must correctly escape vCard special characters.

At minimum handle:

```text
\
,
;
newline
```

Do not simply concatenate raw user input into the vCard without escaping.

---

# 16. QR Code Generation

After the vCard is generated:

```text
Contact Form
    ↓
Contact Model
    ↓
vCard Generator
    ↓
vCard string
    ↓
QR Code Generator
    ↓
QR Image
```

The QR must encode the actual vCard text.

It must NOT encode:

```text
https://yourwebsite.com/contact/123
```

or any dynamic URL.

The QR must directly contain the contact data.

---

# 17. QR Reliability

The generated QR must remain reliably scannable.

Use appropriate:

- QR error correction
- QR size
- Quiet zone/margin
- Contrast
- Encoding

Default recommendation:

- Black QR
- White background
- Adequate quiet zone
- High enough resolution
- Error correction appropriate for normal use

Do not make the QR excessively decorative if it reduces scan reliability.

---

# 18. QR Preview

After generation, show a large QR code.

Example:

```text
┌──────────────────────────┐
│                          │
│                          │
│       QR CODE            │
│                          │
│                          │
└──────────────────────────┘

Syed Mashrur Rahman
Legal Officer
ABN Group

Scan to save this contact
```

The preview should be large enough to test with a phone.

---

# 19. Generate Button

Primary action:

```text
Generate QR Code
```

Behavior:

1. Validate form.
2. Build contact model.
3. Generate vCard.
4. Generate QR.
5. Display QR preview.
6. Enable download buttons.

If the user changes contact information after generation, either:

### Preferred

Automatically update the QR after a short debounce.

OR:

Require clicking:

```text
Update QR Code
```

Choose the UX that provides the cleanest experience.

---

# 20. Download QR as PNG

Button:

```text
Download PNG
```

The downloaded file should contain the generated QR code.

Suggested filename:

```text
syed-mashrur-rahman-contact-qr.png
```

Sanitize the filename.

Do not use unsafe characters.

---

# 21. Download QR as SVG

Button:

```text
Download SVG
```

SVG is useful for:

- Printing
- Business cards
- Graphic design
- High-resolution documents

Suggested filename:

```text
syed-mashrur-rahman-contact-qr.svg
```

---

# 22. Download vCard

Provide:

```text
Download Contact (.vcf)
```

The browser should download the same vCard used inside the QR.

Example:

```text
syed-mashrur-rahman.vcf
```

This gives users an alternative way to share the contact.

---

# 23. Copy vCard

Optional but useful:

```text
Copy vCard
```

Clicking it copies the generated vCard text to the clipboard.

Show a small success message:

```text
vCard copied to clipboard.
```

---

# 24. Print

Optional feature:

```text
Print QR
```

Create a clean print layout containing:

- Contact name
- Organization
- Job title
- QR code
- "Scan to save contact"

The print layout should not include website navigation or unnecessary UI elements.

---

# 25. Reset

Provide:

```text
Clear / Start Over
```

This should:

- Clear the form
- Remove the QR preview
- Clear generated vCard from memory
- Disable download buttons

No information should remain in browser storage.

---

# 26. Validation

Required:

```text
Full Name
```

Optional validation:

### Email

If supplied, validate basic email syntax.

### URL

If supplied, validate URL syntax where practical.

### Phone

Do not be overly restrictive.

International phone numbers can contain:

```text
+
spaces
-
()
```

Normalize only where necessary.

Do not reject legitimate international formats unnecessarily.

---

# 27. Empty State

Before generating a QR:

```text
Your QR code will appear here.

Enter the contact information and click
"Generate QR Code".
```

Do not display an empty broken QR area.

---

# 28. Generated State

After generation:

```text
QR Code Ready

[ QR ]

Scan this QR code to save the contact.

[ Download PNG ]
[ Download SVG ]
[ Download Contact (.vcf) ]
[ Copy vCard ]
[ Print ]
```

---

# 29. Privacy Message

Display a clear privacy statement.

Example:

> Your contact information is processed entirely in your browser. We do not upload or store your contact information.

This is important because the application is specifically intended to be privacy-friendly.

Do not claim anything stronger than what the implementation actually guarantees.

---

# 30. No Analytics by Default

Do not add third-party analytics that could collect form information.

If analytics are ever added in the future, they must not capture form values.

For the initial version, no analytics is preferred.

---

# 31. No External Contact Storage

Do not create functionality such as:

```text
Save Contact Online
Create Profile
Share Profile Link
Manage Contacts
Contact History
My Contacts
```

Those belong to a different dynamic contact-management product.

This application is only a QR generator.

---

# 32. Browser Storage

Do not use:

```text
localStorage
sessionStorage
IndexedDB
cookies
```

for contact information in the initial version.

All contact data should exist only in runtime memory.

---

# 33. Security

Although there is no backend, still follow frontend security best practices.

Do not use unsafe HTML rendering for user-entered values.

Do not inject user-entered strings directly into HTML.

Escape vCard values correctly.

Avoid unnecessary third-party scripts.

Keep dependencies minimal.

---

# 34. Responsive Design

The application must work well on:

- Desktop
- Laptop
- Tablet
- Mobile

Mobile layout is especially important because users may create a QR directly from their phone.

Desktop:

```text
Form                  QR Preview
────────────────────────────────────
```

Mobile:

```text
Form
 ↓
Generate
 ↓
QR Preview
 ↓
Downloads
```

---

# 35. Accessibility

Follow basic accessibility standards.

Requirements:

- Proper form labels
- Keyboard navigation
- Visible focus states
- Accessible buttons
- Appropriate contrast
- Error messages associated with fields
- Screen-reader-friendly structure
- Do not use placeholder text as the only label

---

# 36. Suggested Component Structure

Use a clean Angular component structure.

Example:

```text
src/
└── app/
    ├── core/
    │   ├── models/
    │   │   └── contact.model.ts
    │   └── services/
    │       ├── vcard.service.ts
    │       └── qr.service.ts
    │
    ├── features/
    │   └── contact-qr/
    │       ├── contact-qr.component.ts
    │       ├── contact-qr.component.html
    │       ├── contact-qr.component.scss
    │       │
    │       ├── contact-form/
    │       ├── qr-preview/
    │       └── download-actions/
    │
    ├── shared/
    │   ├── components/
    │   └── utilities/
    │
    └── app.routes.ts
```

Antigravity may reorganize this if it has a better Angular architecture.

The architecture should remain modular.

---

# 37. Suggested Contact Model

Create a strongly typed TypeScript model.

Conceptually:

```typescript
interface Contact {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  fullName: string;

  organization?: string;
  title?: string;
  department?: string;

  phones: ContactPhone[];
  emails: ContactEmail[];

  urls: string[];

  address?: ContactAddress;

  birthday?: string;
  note?: string;
}
```

Phone:

```typescript
interface ContactPhone {
  type: 'mobile' | 'work' | 'home' | 'fax' | 'other';
  number: string;
}
```

Email:

```typescript
interface ContactEmail {
  type: 'work' | 'home' | 'other';
  email: string;
}
```

Address:

```typescript
interface ContactAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}
```

Antigravity can adjust the model according to the final implementation.

---

# 38. vCard Service

Create a dedicated service:

```text
VCardService
```

Responsibilities:

- Convert contact model to vCard
- Escape vCard values
- Format phone numbers
- Format emails
- Format address
- Generate valid vCard output

Example API:

```typescript
generateVCard(contact: Contact): string
```

The service should be independently testable.

---

# 39. QR Service

Create a dedicated QR service/component responsible for:

- Taking vCard text
- Generating QR
- Exporting PNG
- Exporting SVG
- Providing QR data to the preview

Example conceptual API:

```typescript
generate(data: string)
downloadPng()
downloadSvg()
```

Use a mature QR library.

---

# 40. Form Architecture

Use Angular Reactive Forms.

The form should support:

- Dynamic phone fields
- Dynamic email fields
- Dynamic URL fields if implemented
- Validation
- Reset
- Clean data extraction

Example:

```text
FormGroup
 ├── fullName
 ├── organization
 ├── title
 ├── phones[]
 ├── emails[]
 ├── urls[]
 └── address
```

---

# 41. QR Size Controls

Optional advanced feature.

Allow:

```text
Small
Medium
Large
```

or a size slider.

However, do not allow a size that creates an unreliable QR.

Recommended default should be suitable for both screen display and basic printing.

---

# 42. QR Customization

Optional.

Possible controls:

- QR foreground color
- Background color
- Margin
- Size

Default must prioritize scan reliability.

Avoid excessive customization in the first version.

---

# 43. Branding / Logo in QR

Optional future feature.

If implemented, allow a small logo in the center of the QR.

But:

- Maintain sufficient error correction.
- Keep the logo small.
- Preserve the quiet zone.
- Test scan reliability.

This should not be prioritized over a reliable standard QR.

---

# 44. Contact Preview

Besides the QR, show a human-readable preview.

Example:

```text
Syed Mashrur Rahman
Legal Officer
ABN Group

📱 +880 17 2504 4615
☎ +880 2 9103931
✉ mashrur@smralaw.com
🌐 example.com
📍 Dhaka, Bangladesh
```

This allows the user to verify that the information is correct before downloading.

---

# 45. Error Handling

If QR generation fails:

```text
We couldn't generate the QR code.
Please check the contact information and try again.
```

Do not expose technical stack traces.

If the vCard contains invalid data, show a meaningful field-level validation message.

---

# 46. User Flow

## Flow A — Normal generation

```text
Open website
    ↓
Enter name
    ↓
Enter contact information
    ↓
Click Generate QR Code
    ↓
Validate
    ↓
Create Contact object
    ↓
Generate vCard
    ↓
Generate QR
    ↓
Display QR
    ↓
Display contact preview
    ↓
Enable downloads
```

---

# 47. User Flow — Download PNG

```text
QR generated
    ↓
Click Download PNG
    ↓
Browser creates PNG
    ↓
Browser downloads file
```

No server request.

---

# 48. User Flow — Download vCard

```text
QR generated
    ↓
Click Download Contact
    ↓
Browser creates .vcf file
    ↓
Browser downloads file
```

No server request.

---

# 49. User Flow — Reset

```text
Click Clear
    ↓
Confirm only if necessary
    ↓
Clear form
    ↓
Clear QR
    ↓
Clear generated vCard from memory
```

No browser storage should remain.

---

# 50. Phone Scanning Requirement

The final QR should contain a valid vCard, not merely a URL.

Expected behavior:

```text
QR
 ↓
Phone QR scanner
 ↓
Recognizes contact/vCard information
 ↓
Shows contact details
 ↓
User can add/save contact
```

Important:

Different phone manufacturers and operating systems may present the contact-import UI differently. The application should not promise one exact screen or button label for every phone.

---

# 51. vCard Compatibility

Prioritize compatibility with:

- iPhone / iOS
- Android
- Google Contacts
- Samsung Contacts
- Other common contact applications

Use standards-compliant vCard formatting.

Test with multiple real devices.

---

# 52. Testing Requirements

## Unit tests

Test:

- vCard generation
- Special-character escaping
- Empty optional fields
- Multiple phone numbers
- Multiple email addresses
- Address generation
- Unicode names
- Bengali names
- International characters
- International phone numbers

Example:

```text
শাওন দাস
```

must generate a valid vCard.

---

# 53. QR Tests

Test:

- Short contact
- Long contact
- Multiple phone numbers
- Long address
- Unicode content
- Maximum practical contact size
- PNG export
- SVG export

Verify QR scanning using multiple phones.

---

# 54. Important QR Size Consideration

A vCard containing a lot of information produces a larger QR payload.

Therefore:

```text
More contact information
        ↓
Larger QR payload
        ↓
More dense QR pattern
        ↓
Potentially harder to scan
```

The application should avoid encouraging unnecessary fields.

The UI can show a warning if the generated payload becomes unusually large:

```text
This contact contains a lot of information and may produce a dense QR code.
Consider removing optional fields for easier scanning.
```

Do not block generation unless technically necessary.

---

# 55. Offline Capability

The application should ideally continue working after its static assets have loaded, without requiring an API connection.

Optional future enhancement:

- PWA
- Service worker
- Offline installation

This is not required for the first version.

---

# 56. Deployment

The application should be deployable as a static frontend.

Possible hosting:

- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel
- Any standard static web hosting

No backend environment variables should be required.

---

# 57. SEO / Metadata

Add basic metadata:

```text
Title:
Contact QR Generator

Description:
Create a QR code containing your contact information and let others save it directly to their phone.
```

Add appropriate Open Graph metadata.

---

# 58. Browser Compatibility

Target modern:

- Chrome
- Edge
- Firefox
- Safari
- Mobile Safari
- Android Chrome
- Samsung Internet

Do not require outdated browser support unless specifically requested.

---

# 59. Performance

The application should load quickly.

Avoid unnecessary:

- Frameworks
- Dependencies
- Large assets
- External requests

QR generation should happen quickly for normal contact information.

---

# 60. File Naming

Use safe, readable filenames.

Example:

```text
john-doe-contact-qr.png
john-doe-contact-qr.svg
john-doe.vcf
```

Sanitize:

- `/`
- `\\`
- `:`
- `*`
- `?`
- `"`
- `<`
- `>`
- `|`
- excessive whitespace

---

# 61. No Contact History

Do not maintain a history such as:

```text
Recently Generated
Previous Contacts
Saved QR Codes
```

This would introduce unnecessary storage and privacy concerns.

---

# 62. No Authentication

The application must not have:

```text
Login
Register
Forgot Password
User Profile
Account
```

The user can immediately use the application.

---

# 63. No Database

This is an explicit requirement.

Architecture must remain:

```text
                 STATIC HOST
                     │
                     ▼
              ANGULAR APP
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   Contact Form             QR Generator
        │                         │
        └──────────┬──────────────┘
                   ▼
                 vCard
                   │
                   ▼
                QR Code
                   │
          ┌────────┴────────┐
          ▼                 ▼
      PNG / SVG           .VCF
```

There is no:

```text
Backend
Database
API
```

---

# 64. Recommended Final Feature Set

## Version 1 — Required

### Contact fields

- Full name
- Organization
- Job title
- Department
- Mobile phone
- Work phone
- Home phone
- Fax
- Email
- Website
- Street address
- City
- State/Province
- Postal code
- Country
- Notes

### QR

- Generate QR
- QR preview
- Reliable error correction
- Download PNG
- Download SVG

### Contact file

- Download `.vcf`
- Copy vCard

### UX

- Responsive design
- Form validation
- Clear/reset
- Contact preview
- Privacy message
- Accessible UI

---

# 65. Optional Version 2 Features

Only add these if they do not make the application unnecessarily complicated:

- Contact photo
- Multiple websites
- Multiple addresses
- QR size control
- QR color customization
- Print layout
- QR logo
- PWA/offline installation
- Import existing `.vcf`
- Drag/drop `.vcf`
- Import contact from phone where browser APIs permit

Do not add a backend merely to implement these features.

---

# 66. Design Direction

Antigravity should make its own design decisions while following these principles:

### Visual style

- Modern
- Professional
- Minimal
- Clean
- Premium utility-tool appearance
- Excellent typography
- Good spacing
- Subtle borders/shadows
- Strong visual hierarchy

Avoid:

- Old-fashioned Bootstrap-looking forms
- Excessively colorful UI
- Clutter
- Unnecessary animations
- Dashboard-style sidebars
- Excessive cards
- Huge decorative illustrations

The QR should be the visual focus after generation.

---

# 67. Suggested Header

Application name:

```text
Contact QR
```

Possible tagline:

```text
Create a QR code that makes sharing your contact effortless.
```

Keep branding simple.

---

# 68. Privacy Messaging

A small privacy indicator can be displayed near the form:

```text
🔒 Processed locally in your browser
```

With explanatory text:

```text
Your contact information is never uploaded or stored by this application.
```

Only use this statement if the final implementation genuinely performs all processing client-side and does not transmit the values.

---

# 69. Final Technical Principle

The most important implementation rule is:

```text
USER DATA
   │
   ▼
BROWSER MEMORY ONLY
   │
   ├── vCard Generator
   │
   └── QR Generator
          │
          ▼
      Download Files
```

Never:

```text
USER DATA
   │
   ▼
SERVER
   │
   ▼
DATABASE
```

The application should be a **stateless, client-side contact QR generator**.

---

# 70. Acceptance Criteria

The project is considered complete when all of the following are true:

- [ ] User can open the application without registration.
- [ ] User can enter a contact name.
- [ ] User can enter optional professional information.
- [ ] User can enter multiple phone numbers.
- [ ] User can enter multiple email addresses.
- [ ] User can enter website information.
- [ ] User can enter a structured address.
- [ ] User can enter optional notes.
- [ ] Application validates the form.
- [ ] Application generates a standards-compliant vCard.
- [ ] Application correctly escapes vCard special characters.
- [ ] Application generates a QR containing the actual vCard.
- [ ] QR is displayed clearly.
- [ ] QR can be scanned by common phones.
- [ ] Scanning exposes the contact information for saving/import.
- [ ] User can download PNG.
- [ ] User can download SVG.
- [ ] User can download `.vcf`.
- [ ] User can copy the vCard.
- [ ] User can clear the form.
- [ ] Contact data is not sent to an application backend.
- [ ] No database exists.
- [ ] No login exists.
- [ ] No contact data is stored in browser storage.
- [ ] No contact history exists.
- [ ] Application is responsive.
- [ ] Application is accessible.
- [ ] Application works on modern desktop and mobile browsers.
- [ ] Static hosting is sufficient.
- [ ] Contact information disappears from application state after page reload/close.
- [ ] QR generation and downloads work without an application API.

---

# 71. Instruction to Antigravity

Build the application from this specification.

You have freedom to make reasonable implementation and design decisions where the specification does not explicitly dictate a solution.

Prioritize:

1. Correct vCard generation
2. QR scan reliability
3. Privacy / client-side processing
4. Excellent UX
5. Responsive design
6. Accessibility
7. Maintainable Angular architecture
8. Minimal dependencies
9. Fast performance

Do not introduce a backend, database, authentication, or persistent contact storage.

Before considering the project complete, test generated QR codes with multiple contact datasets and verify that the resulting contact information can be imported/saved on both Android and iOS devices.

