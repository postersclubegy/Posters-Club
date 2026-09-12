# 📧 POSTERS CLUB - EmailJS Setup Guide

This guide helps you set up automated emails for customer orders. Customers will receive confirmation emails, and you'll get notified of new orders!

---

## 📋 What You'll Get

✅ **Customer receives email** when they place an order  
✅ **You receive email** when a customer places an order  
✅ **Customer receives confirmation email** when you approve the order on WhatsApp  
✅ **All FREE** - EmailJS allows 200 emails/month free

---

## 🚀 STEP 1: Create EmailJS Account

1. Go to **[EmailJS.com](https://www.emailjs.com/)**
2. Click **"Sign Up Free"**
3. Sign up using:
   - Gmail, Yahoo, Google account OR
   - Email + password
4. Click the confirmation link in your email
5. ✅ You're now logged in

---

## 🔑 STEP 2: Get Your EmailJS Credentials

### Get Your Public Key:
1. In EmailJS dashboard, click **"Account"** (top right)
2. Look for **"Public Key"** section
3. Copy the key (looks like: `abc123def456`)
4. **Save this** - you'll need it

### Get Your Service ID:
1. Click **"Email Services"** (left sidebar)
2. Click **"Connect a new service"**
3. Select **"Gmail"** (recommended) or your email provider
4. Click **"Connect"**
5. A popup opens - authorize EmailJS to access your email
6. Once connected, you'll get a **Service ID** (looks like: `service_abc123`)
7. **Copy and save** this Service ID

---

## 📝 STEP 3: Create Email Templates

EmailJS uses templates to format emails. We need 3 templates:

### Template 1: Customer Order Confirmation

1. In EmailJS dashboard, click **"Email Templates"** (left sidebar)
2. Click **"Create New Template"**
3. **Template Name**: `template_customer_order`
4. Fill in the template:

**Subject:**
```
Order Confirmation - Posters Club ({{order_id}})
```

**Body:**
```
Hello {{customer_name}},

Thank you for your order! 🎉

Order ID: {{order_id}}

Items:
{{order_items}}

Total: {{total_price}} EGP
Poster Size: {{poster_size}}
Delivery Address: {{delivery_address}}

Next Step:
We will contact you on WhatsApp at {{whatsapp_number}} to confirm your order and discuss shipping details.

WhatsApp: {{owner_whatsapp}}
Store: Posters Club
Instagram: @postersclub.egy

We're excited to send you your posters! 🎨

Best regards,
{{owner_name}}
```

5. Click **"Save"**

---

### Template 2: Owner Notification

1. Click **"Create New Template"**
2. **Template Name**: `template_owner_notification`
3. Fill in:

**Subject:**
```
New Order Received - {{order_id}} from {{customer_name}}
```

**Body:**
```
You have a new order! 📦

Order ID: {{order_id}}
Customer Name: {{customer_name}}
Customer Email: {{customer_email}}
Customer WhatsApp: {{customer_whatsapp}}

Items Ordered:
{{order_items}}

Total: {{total_price}} EGP
Poster Size: {{poster_size}}
Delivery Address: {{delivery_address}}

Action Needed:
1. Contact customer on WhatsApp: {{customer_whatsapp}}
2. Confirm order details
3. Arrange printing & shipping
4. Send confirmation email (see template_order_confirmation)

Store: Posters Club
```

5. Click **"Save"**

---

### Template 3: Order Confirmation (After WhatsApp)

1. Click **"Create New Template"**
2. **Template Name**: `template_order_confirmation`
3. Fill in:

**Subject:**
```
Order Confirmed - {{order_id}}
```

**Body:**
```
Hello {{customer_name}},

Great news! Your order {{order_id}} has been confirmed! ✅

We will now print your poster and prepare it for shipment. You'll receive shipping tracking information soon.

Thank you for choosing Posters Club! 🎨

Best regards,
{{owner_name}}
Posters Club
@postersclub.egy
```

4. Click **"Save"**

---

## 🔧 STEP 4: Update Your Website Code

### 1. Open `script.js` file

Look for this section at the top:
```javascript
// Initialize EmailJS
(function() {
    emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); // Will be replaced with actual key
})();

// YOUR EMAIL CONFIGURATION
const OWNER_EMAIL = "your-email@gmail.com"; // Replace with your email
const OWNER_NAME = "Posters Club";
const WHATSAPP_NUMBER = "+201234567890"; // Your WhatsApp number
```

### 2. Replace with Your Details:

- **`YOUR_EMAILJS_PUBLIC_KEY`** → Paste your Public Key from Step 2
- **`your-email@gmail.com`** → Your Gmail address (where you get order notifications)
- **`Posters Club`** → Your store name
- **`+201234567890`** → Your WhatsApp number (with country code)

### Example:
```javascript
emailjs.init("pk_1234567890abc");

const OWNER_EMAIL = "postersclub.egypt@gmail.com";
const OWNER_NAME = "Posters Club Egypt";
const WHATSAPP_NUMBER = "+201012345678";
```

### 3. Save the file (Ctrl+S)

---

## ✅ STEP 5: Test It Out

1. Open your website (local or live)
2. Add a poster to cart
3. Click "Proceed to Checkout"
4. Fill in the form with:
   - **Name**: Your name
   - **Email**: Your email address
   - **WhatsApp**: Your WhatsApp number
   - **Address**: Your address
   - **Size**: Pick a size
5. Click **"Place Order & Send Email"**
6. Check your email inbox for confirmation! 📧

---

## 🆘 Troubleshooting

### Email not sent?

**Error: "Service ID is undefined"**
- Solution: Make sure you added Service ID in script.js

**Error: "Invalid Public Key"**
- Solution: Check you copied the Public Key correctly (no spaces)

**Email goes to spam?**
- That's normal for new services
- Click "Not spam" to train Gmail
- Emails will improve over time

### Can't connect Gmail?

1. Check your Gmail account has 2-factor authentication enabled
2. Generate an **App Password** on Google Account
3. Use that App Password in EmailJS instead

### Still not working?

1. Open browser console (F12)
2. Look for error messages
3. Compare your Service ID and Public Key with EmailJS dashboard
4. Make sure template names match exactly

---

## 📊 Monitor Your Emails

1. Go to EmailJS dashboard
2. Click **"Logs"** (left sidebar)
3. See all emails sent/failed
4. Check for errors

---

## 🎯 Email Flow Explained

### When Customer Places Order:
1. Customer fills form on website
2. Website sends to EmailJS
3. EmailJS sends customer confirmation email
4. EmailJS sends you notification email
5. You get notified on email
6. Customer gets order confirmation

### When You Confirm on WhatsApp:
1. You contact customer on WhatsApp
2. You confirm order details
3. You manually trigger confirmation email in admin panel
4. Customer receives confirmation they paid
5. You print and ship

---

## 💡 Pro Tips

**Tip 1**: Always confirm payment before printing!

**Tip 2**: Send confirmation email within 24 hours of WhatsApp conversation

**Tip 3**: Use templates to save time and keep messaging professional

**Tip 4**: Check spam folder if customer doesn't see email

**Tip 5**: Test every template before going live

---

## 🚀 You're All Set!

Your email system is now:
- ✅ Automated for customers
- ✅ Professional notifications for you
- ✅ Free to use (200/month)
- ✅ Working 24/7

Now customers can place orders and you'll know immediately! 📧

---

## 📞 Need More Help?

- **EmailJS Docs**: [emailjs.com/docs](https://www.emailjs.com/docs)
- **EmailJS Support**: [emailjs.com/support](https://www.emailjs.com/support)
- **Gmail App Passwords**: [support.google.com](https://support.google.com/accounts/answer/185833)

---

*Your Posters Club email system is now live! 🎉*
