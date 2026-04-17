# Reusable Lead Capture Landing Page

This is a beginner-friendly static landing page template for service businesses.

It is designed to work as a beginner-friendly static catalog-style landing page for service or product-based businesses.

## Files

- `index.html` - page layout and lightweight dynamic placeholders
- `styles.css` - reusable styling and mobile responsiveness
- `config.js` - client-specific settings

## How To Customize For A New Client

1. Open `config.js`
2. Replace the values in `window.CLIENT_CONFIG`
3. Save the file
4. Deploy the folder to any static host

## Variables To Update

```js
window.CLIENT_CONFIG = {
  businessName: "Acme Detailing",
  serviceType: "Car Detailing",
  primaryColor: "#0D5C46",
  phoneNumber: "(312) 555-0123",
  location: "Chicago",
  offerText: "Interior and exterior detailing with fast turnaround.",
  products: [
    {
      name: "Signature Cover",
      price: "$29.99",
      image: "https://example.com/product.jpg",
      tag: "NEW",
      description: "Short clean description",
    },
  ],
};
```

## How The Lead Flow Works

1. Visitor lands on the page
2. Visitor explores featured products
3. Visitor clicks to call or request more information
4. Business follows up directly

## Deployment

Because this is a static template, you can deploy it immediately on:

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- Any cPanel hosting with static file support

## Notes

- The phone buttons automatically use the number from `config.js`
- The product catalog renders automatically from `config.js`
- The page title updates automatically using the business name
- The mobile sticky CTA appears on smaller screens for better conversion
