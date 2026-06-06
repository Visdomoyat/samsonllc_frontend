# Eliteforge Peptide — Website Guide (For Clients)

This guide explains how your website works in everyday language — no technical background needed.

---

## What is this website?

Your website is the **public online store** for Eliteforge Peptide. Customers can:

- Learn about your brand on the **Home** page  
- Browse and search **products** on the **Shop** page  
- Add items to a **cart**  
- **Check out** with their shipping details  
- Pay with **card (Stripe)** or **PayPal**  
- See a **confirmation** when payment succeeds  

There is **no customer login** on this site. Anyone can shop as a guest.

---

## Main pages

| Page | What customers see |
|------|-------------------|
| **Home** | Welcome message, why choose Eliteforge, and a few featured products |
| **Shop** | Full list of products with photos, descriptions, prices, and “Add to cart” |
| **Contact** | A form where customers can send you a message |
| **Checkout** | Where customers enter name, address, and pay |

The **menu at the top** appears on every page: Home, Shop, Contact, search, and the cart icon.

---

## How a customer shops (step by step)

1. **Browse** — Customer visits Home or Shop and looks at products.  
2. **Search** — They can use the search bar in the menu to find products by name.  
3. **Add to cart** — On any product, they click **Add to cart**.  
4. **View cart** — They click the **cart icon** (top right). A panel slides in from the right — this is not a separate page.  
5. **Adjust cart** — They can change quantities or remove items.  
6. **Checkout** — They click **Checkout** and fill in name, email, and shipping address.  
7. **Pay** — They choose **Pay with card** or **Pay with PayPal** and complete payment on Stripe or PayPal’s secure page.  
8. **Confirmation** — After paying, they return to your site and see an order confirmation with their order details.

If they cancel payment, the order is still saved but marked as **not paid** — they can try again from checkout.

---

## The shopping cart

- The cart **remembers items** if the customer refreshes the page (on the same browser).  
- The **number on the cart icon** shows how many items are in the cart.  
- The cart opens as a **sidebar** on the right — customers do not leave the page they’re on.

---

## Payments

- **Card payments** go through **Stripe** (industry-standard, secure checkout).  
- **PayPal** opens PayPal’s own login/approval screen.  
- Your website **does not store card numbers** — Stripe and PayPal handle that.  
- Which buttons appear depends on what is turned on in your backend settings.

---

## Contact page

The Contact page shows a form (name, email, message).  
If you need form submissions emailed to you automatically, that can be set up separately — ask your developer.

---

## What customers do *not* see

- **Admin / staff login** — Managing products and viewing paid orders is done on a separate **backend** system (not this public website).  
- The URL `…/shop/` on your server with a **login screen** is for **staff**, not for regular shoppers. Shoppers use your **Netlify** store URL (e.g. your `.netlify.app` or custom domain).

---

## Where products come from

Products shown on Home and Shop are loaded from your **backend database**.  

- If the shop looks **empty**, products may need to be added in the admin/backend system.  
- Each product can have a **name**, **description**, **price**, and **photo**.  
- Changes in the backend usually appear on the website after a refresh (and sometimes after a short delay if the site is cached).

---

## Your live website vs. local testing

| | **Live site (customers)** | **Developer testing (local)** |
|--|---------------------------|-------------------------------|
| **Who uses it** | Your customers | You or your developer |
| **Address** | Your Netlify URL or custom domain | `localhost:5173` on a developer’s computer |
| **Purpose** | Real shopping and payments | Building and testing before going live |

Customers should only use the **live** address you give them (not localhost).

---

## Branding on the site

- **Logo** — Top left of every page; links to Home.  
- **Colors** — Light background with navy blue text and buttons (matches Eliteforge branding).  
- **Home page hero** — Product vial image with a gentle up-and-down animation.  
- **Bottom banner** — “Ready to place an order?” with vial images on the sides.

Visual tweaks (photos, wording, layout) can be updated by your developer.

---

## After a customer pays

1. They see a **success page** with order number and summary.  
2. The order is stored in your **backend** with status **paid** (once Stripe/PayPal confirms).  
3. You can use the admin/backend to see orders, mark them shipped, and send tracking (depending on how your backend is set up).

---

## Common questions

**Why is the shop empty?**  
Products may not be added in the backend yet, or the live site may not be connected to the correct API.

**Can customers create an account?**  
Not on this version of the site — checkout is guest-only (name + email + address).

**Can I edit text myself?**  
Page wording and images are in the website code. For non-technical edits, work with your developer or ask for a content admin tool in the future.

**Is the site mobile-friendly?**  
Yes. The menu, shop, cart, and checkout work on phones and tablets.

**What if payment fails?**  
The customer sees an error message and can try again. The order may stay “pending” until payment succeeds.

---

## Who to contact for help

| Need | Who |
|------|-----|
| Change wording, images, or layout | Your web developer |
| Add/edit/remove products | Backend admin or developer |
| Payment issues (Stripe/PayPal) | Developer + your Stripe/PayPal account dashboard |
| Domain name (e.g. www.eliteforge.com) | Netlify + domain registrar, often with developer help |
| Orders not showing as paid | Developer (check backend and payment settings) |

---

## Quick summary

Your website is a **modern online store**: browse → cart → checkout → pay → confirmation.  
It connects to your **backend** for products and orders and to **Stripe/PayPal** for payments.  
**Staff tools** (login, inventory admin) live on the backend, separate from what customers see.

---

*Last updated for the Eliteforge Peptide React storefront.*
