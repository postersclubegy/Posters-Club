# 📧 POSTERS CLUB - EMAIL SYSTEM QUICK START

Your website now has a **complete email notification system**! Here's how to set it up in 10 minutes.

---

## 🎯 What You Get

✅ **Automatic email** when customer places order  
✅ **Notification email** to you from customers  
✅ **Confirmation email** when you approve the order  
✅ **Free** - 200 emails per month  
✅ **No coding** - Just copy & paste your credentials

---

## ⚡ Quick Setup (10 Minutes)

### STEP 1: EmailJS Account (2 min)
1. Go to [emailjs.com](https://www.emailjs.com)
2. Click "Sign Up Free"
3. Sign up with Gmail/Google/Email
4. Verify your email ✅

### STEP 2: Connect Your Email (3 min)
1. Login to EmailJS dashboard
2. Click "Email Services" (left menu)
3. Click "Connect a new service"
4. Select "Gmail" → Click "Connect"
5. Authorize EmailJS to access your Gmail
6. **Copy and save your Service ID** 📋

### STEP 3: Get Your Public Key (1 min)
1. Click "Account" (top right)
2. Find "Public Key"
3. **Copy it** 📋

### STEP 4: Create Email Templates (3 min)
Follow the detailed instructions in **EMAILJS_SETUP.md** to create 3 templates:
- `template_customer_order` - Customer receives this when they order
- `template_owner_notification` - You receive this when customer orders
- `template_order_confirmation` - Customer receives this after you confirm

### STEP 5: Update Your Website (1 min)
Open `script.js` and find this section:

```javascript
// Initialize EmailJS
(function() {
    emailjs.init("YOUR_EMAILJS_PUBLIC_KEY"); 
})();

const OWNER_EMAIL = "your-email@gmail.com"; 
const OWNER_NAME = "Posters Club";
const WHATSAPP_NUMBER = "+201234567890";
```

**Replace with YOUR details:**
- `YOUR_EMAILJS_PUBLIC_KEY` → Your Public Key from Step 3
- `your-email@gmail.com` → Your Gmail address
- `Posters Club` → Your store name  
- `+201234567890` → Your WhatsApp number

**SAVE** the file ✅

---

## 🧪 Test It

1. Open your website
2. Add a poster to cart
3. Click "Proceed to Checkout"
4. Fill in the form:
   - Name: Your name
   - Email: Your email
   - WhatsApp: Your WhatsApp number
   - Address: Your address
   - Size: Any size
5. Click "Place Order & Send Email"
6. **Check your email** - You should see 2 emails! 📧

---

## 📱 How Customer Orders Work

### Customer Side:
1. Visits your website
2. Browses posters
3. Adds items to cart
4. Clicks "Proceed to Checkout"
5. **Fills form with:**
   - Name
   - Email
   - WhatsApp number
   - Delivery address
   - Poster size
6. Clicks "Place Order"
7. **Receives confirmation email** ✉️

### Your Side:
1. **Email notification** arrives
2. See all order details
3. **Contact customer on WhatsApp**
4. Discuss & confirm order
5. **Open admin dashboard** (admin-dashboard.html)
6. Send confirmation email
7. Print & ship poster

---

## 🎯 Using the Admin Dashboard

After confirming with customer on WhatsApp:

1. Open **admin-dashboard.html** in your browser
2. Fill in:
   - Customer name (from WhatsApp)
   - Customer email (from order notification)
   - Order ID (from notification email)
   - Optional: Personal message
3. Click "Send Confirmation Email"
4. Done! ✅ They get confirmation email

**Bookmark admin-dashboard.html** so you can access it quickly!

---

## 📧 Email Types Explained

### Email 1: Customer Order Confirmation
- **Who receives**: Customer
- **When**: Immediately after they place order
- **Contains**: Order details, items, your WhatsApp number
- **Purpose**: Confirms their order was received

### Email 2: Owner Notification
- **Who receives**: You
- **When**: Immediately after customer orders
- **Contains**: All customer details, order items, address
- **Purpose**: You know immediately to contact them

### Email 3: Order Confirmation
- **Who receives**: Customer
- **When**: After you contact on WhatsApp & confirm
- **Contains**: Confirmation that order was approved
- **Purpose**: Customer knows you're printing it

---

## 🔧 Troubleshooting

### Email not sending?
**Check 1**: Did you replace YOUR credentials in script.js?
- Missing Public Key?
- Wrong email format?
- Typo in Service ID?

**Check 2**: Open browser console (F12)
- Look for error messages
- Copy the error and Google it

**Check 3**: Check EmailJS logs
- Login to emailjs.com
- Click "Logs" (left menu)
- See failed emails with error reasons

### Email goes to spam?
- Gmail learns over time
- Click "Not spam" when you see it
- After 2-3 emails, will go to inbox

### Customer says they didn't receive email?
1. Check Gmail spam folder
2. Verify email address was spelled correctly
3. Send again from admin dashboard

### AdminJS says "Service undefined"
- You didn't update script.js
- Double-check the Service ID
- It should be in quotes: "service_abc123"

---

## 💡 Pro Tips

**Tip 1**: Always verify customer email before sending confirmation  
**Tip 2**: Send confirmation email within 24 hours of WhatsApp chat  
**Tip 3**: Add personal message in admin dashboard for better customer service  
**Tip 4**: Keep the admin dashboard link bookmarked  
**Tip 5**: Check EmailJS logs weekly to monitor all emails

---

## 🚀 Full Setup Checklist

- [ ] Created EmailJS account
- [ ] Connected Gmail to EmailJS
- [ ] Got Public Key (saved it)
- [ ] Got Service ID (saved it)
- [ ] Created 3 email templates in EmailJS
- [ ] Updated script.js with Public Key
- [ ] Updated script.js with email/name/WhatsApp
- [ ] Tested by placing an order
- [ ] Received 2 test emails
- [ ] Bookmarked admin-dashboard.html
- [ ] Ready to launch! 🚀

---

## 📚 Files You Have

### Website Files (Deploy these):
- `index.html` - Main website
- `style.css` - Styling
- `script.js` - Shopping cart + email integration

### Admin Files (Keep for yourself):
- `admin-dashboard.html` - Send confirmations to customers
- `EMAILJS_SETUP.md` - Detailed EmailJS setup
- `POSTERS_CLUB_GUIDE.md` - Full store guide
- `CUSTOMIZE_YOUR_POSTERS.md` - How to change products

---

## 🎉 You're All Set!

Your Posters Club now has:
✅ Professional website  
✅ Shopping cart  
✅ Automatic emails  
✅ Order notifications  
✅ Customer confirmations  
✅ Admin dashboard  

**Everything is FREE and ready to launch!**

---

## 📞 Need Help?

- **EmailJS Help**: [emailjs.com/docs](https://www.emailjs.com/docs)
- **Gmail Issues**: [support.google.com](https://support.google.com)
- **Website Questions**: Check POSTERS_CLUB_GUIDE.md

---

## 🚀 Next Steps

1. ✅ Set up EmailJS (follow this guide)
2. ✅ Test emails (place an order)
3. ✅ Deploy website to Netlify
4. ✅ Share link on Instagram
5. ✅ Start selling! 📮

---

*Your email system is now live! Start taking orders! 📧🎉*
