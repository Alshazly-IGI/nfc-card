# NFC Card - Multi Client

This version keeps the existing design, QR modal, NFC logic and Dark/Light theme.

## Customer URLs

- Default: `?id=alshazly`
- Example: `?id=ahmed`

## Add a customer

Edit `data/customers.json` and add another object:

```json
"mohamed": {
  "name": "Mohamed Hassan",
  "job": "Doctor",
  "headline": "Consultant",
  "phone": "+201XXXXXXXXX",
  "whatsapp": "+201XXXXXXXXX",
  "email": "mohamed@example.com",
  "linkedin": "https://www.linkedin.com/in/mohamed",
  "website": "",
  "photo": "images/mohamed.jpg",
  "company": "",
  "bio": "",
  "active": true
}
```

Then use:

`https://YOUR-DOMAIN/nfc-card/?id=mohamed`

## NFC

The NFC writer should use:

```js
window.getNFCProfileURL()
```

This automatically writes the current customer's profile URL.

## QR

The QR generator should use:

```js
window.getNFCProfileURL()
```

This automatically generates the QR for the currently displayed customer.

## Important

`data/customers.json` is public when hosted with GitHub Pages.
Do not put passwords, API keys, private tokens, or sensitive/private data in it.
