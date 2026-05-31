# Amar Bagan — Deployment Guide (Phone-Based)

This guide takes the Amar Bagan codebase from the downloaded zip to a live
website, performed entirely from a Samsung S23 Ultra. No desktop computer and
no terminal are required. The path runs through GitHub and Vercel, both of
which work well in a mobile browser.

The whole process, first time through, takes roughly 45–90 minutes. Most of
that is the one-time Firebase setup; future code changes deploy in seconds.

---

## OVERVIEW — THE FIVE PARTS

1. Create the Firebase project (database + admin sign-in).
2. Put the code on GitHub from your phone.
3. Deploy on Vercel and set the environment variables.
4. Deploy the Firestore security rules.
5. Connect Make.com for the empathetic WhatsApp automation.

Do them in order. Parts 1 and 3 are where the real values get created, so keep
a notes app open to paste keys into as you go.

---

## PART 1 — FIREBASE PROJECT

Firebase is the database (Firestore) and the admin login (Google sign-in).

### 1.1 Create the project
1. In your phone browser, go to **console.firebase.google.com**.
2. Sign in with the Google account you want to own the project. Using
   **contactamarbagan@gmail.com** is sensible, because that is the admin email
   already written into the security rules.
3. Tap **Create a project**. Name it `amar-bagan`. You can disable Google
   Analytics for now to keep it simple. Tap through to create.

### 1.2 Create the database
1. In the left menu (the hamburger icon on mobile), open **Build → Firestore
   Database**.
2. Tap **Create database**.
3. Choose **Start in production mode** (we deploy our own rules in Part 4).
4. For location, pick a region close to Bangladesh. **asia-south1 (Mumbai)** is
   the best balance of proximity and availability.
5. Tap **Enable**.

### 1.3 Turn on Google sign-in (for the admin dashboard)
1. Open **Build → Authentication**.
2. Tap **Get started**.
3. Under **Sign-in method**, tap **Google**, toggle **Enable**, set the support
   email to your address, and **Save**.

### 1.4 Register the web app and copy the config
1. Open **Project settings** (the gear icon, top of the left menu).
2. Scroll to **Your apps**, tap the **web** icon (`</>`).
3. Nickname it `amar-bagan-web`. Do NOT tick Firebase Hosting. Tap **Register
   app**.
4. Firebase shows a `firebaseConfig` block. Copy the six values into your notes.
   You will need each one in Part 3. They look like this:

   ```
   apiKey:            "AIza...."
   authDomain:        "amar-bagan.firebaseapp.com"
   projectId:         "amar-bagan"
   storageBucket:     "amar-bagan.appspot.com"
   messagingSenderId: "123456789012"
   appId:             "1:1234...:web:abcd...."
   ```

Keep these five-plus-one values safe. They are not secret in the dangerous
sense — the API key only identifies your project to Google, and your real
protection is the security rules in Part 4 — but you still need them to hand.

---

## PART 2 — PUT THE CODE ON GITHUB (FROM YOUR PHONE)

GitHub stores the code; Vercel watches GitHub and rebuilds whenever it changes.

### 2.1 Make a GitHub account and repo
1. Go to **github.com** in your browser (or install the **GitHub** app).
2. Sign up or sign in.
3. Tap **+ → New repository**. Name it `amar-bagan`. Set it to **Private**.
   Do NOT add a README or .gitignore (the project already has them). Tap
   **Create repository**.

### 2.2 Upload the project files
The phone-friendly method is GitHub's web uploader.

1. First, unzip the downloaded `amar-bagan-phase3.zip` on your phone. Samsung's
   built-in **My Files** app can extract zips: long-press the file → **Extract**.
   You will get an `amar-bagan` folder containing all the project files.
2. In your new empty GitHub repo, tap **uploading an existing file** (the link
   in the "Quick setup" box), or **Add file → Upload files**.
3. Here is the important detail: you must upload the **contents** of the
   `amar-bagan` folder, not the folder itself. Select everything inside it —
   the `app`, `components`, `lib`, and `public` folders, plus `package.json`,
   `tailwind.config.js`, `next.config.js`, `firestore.rules`, and the rest.
4. The mobile browser's file picker lets you select multiple files. Folders
   upload with their structure intact. If the picker will not let you select
   folders, see the fallback below.
5. At the bottom, write a commit message like `Initial Amar Bagan codebase`
   and tap **Commit changes**.

**If the mobile uploader struggles with folders** (some browsers do), the
reliable fallback is **GitHub Codespaces**, which gives you a real terminal in
a browser tab:
   - On your repo page, tap **Code → Codespaces → Create codespace on main**.
   - Wait for it to load (about a minute).
   - Use the Codespace's upload to drag the extracted files in, then in its
     terminal run:
     ```
     git add .
     git commit -m "Initial Amar Bagan codebase"
     git push
     ```

Either way, when finished your repo should show the `app`, `components`, `lib`,
`public` folders at the top level — NOT a single `amar-bagan` folder containing
them. If you see a nested folder, the deploy in Part 3 will fail, and you fix
it by moving the files up one level.

---

## PART 3 — DEPLOY ON VERCEL

### 3.1 Connect Vercel to GitHub
1. Go to **vercel.com** and tap **Sign Up** (or log in). Choose **Continue
   with GitHub** so the two are linked.
2. On your Vercel dashboard, tap **Add New → Project**.
3. Find `amar-bagan` in the list of your GitHub repos and tap **Import**.

### 3.2 Set the environment variables BEFORE deploying
This is the most important step. On the import screen, expand
**Environment Variables** and add each of the following, one row at a time.
The names must match exactly.

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | your apiKey from Part 1.4 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | your authDomain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | your projectId |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | your storageBucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | your messagingSenderId |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | your appId |
| `NEXT_PUBLIC_META_PIXEL_ID` | your Meta Pixel ID (see note below) |
| `NEXT_PUBLIC_ADMIN_EMAILS` | `contactamarbagan@gmail.com` |

A note on the admin emails: this must match the email written in
`firestore.rules`. If you want more than one admin, separate them with commas,
for example `contactamarbagan@gmail.com,someone@gmail.com`, and add each one to
the rules file too (Part 4).

A note on the Meta Pixel ID: if you do not have it yet, you may leave that one
variable out for now — the site builds and runs fine without it, and the Pixel
simply stays dormant. To get it: go to **business.facebook.com → Events
Manager → Connect Data Sources → Web → Meta Pixel**, create one named
`Amar Bagan`, and copy the 15–16 digit ID. You can add the variable to Vercel
later and redeploy.

### 3.3 Deploy
1. Leave the framework preset as **Next.js** (Vercel detects it automatically).
2. Tap **Deploy**.
3. Wait two to four minutes. When it finishes you get a live URL like
   `amar-bagan.vercel.app`. Tap it to see your site.

### 3.4 Authorise the live domain in Firebase
Google sign-in will refuse to work on the live URL until you allow it.
1. Back in Firebase Console → **Authentication → Settings → Authorized
   domains**.
2. Tap **Add domain** and add your Vercel domain, e.g. `amar-bagan.vercel.app`.
   (If you later connect a custom domain like `amarbagan.com`, add that too.)

---

## PART 4 — DEPLOY THE FIRESTORE SECURITY RULES

The rules are the real protection: they enforce the 200 BDT minimum advance and
restrict order data to your admin email. They live in `firestore.rules` in the
project.

The phone-friendly way is to paste them straight into the console.
1. Open the `firestore.rules` file (in the GitHub repo, tap the file to read
   it, then copy its entire contents).
2. In Firebase Console → **Firestore Database → Rules** tab.
3. Select everything in the editor and replace it with what you copied.
4. **Important:** check the admin email near the top of the rules. It must
   read `'contactamarbagan@gmail.com'` (or whichever admin emails you set in
   Vercel). If you added more admins, add each as a quoted, comma-separated
   entry in the list.
5. Tap **Publish**.

From this moment, no order can be written with an advance below 200, and only
your admin email can read the order list or change a status — enforced on
Google's servers, not just in the app.

---

## PART 5 — MAKE.COM: EMPATHETIC WHATSAPP AUTOMATION

This is the bridge that sends the guilt-reducing WhatsApp message when you mark
an order as Shipped, so customers feel they are letting down real farmers rather
than a faceless website — the core of the anti-ghosting strategy.

There are two architectural options. I describe the simpler, more reliable one
first.

### Option A (recommended): trigger from the Admin Dashboard via webhook

Instead of having Make.com poll the database, the cleanest design is for the
admin action itself to notify Make.com. This requires one small code addition
(noted at the end) but is far more reliable and instant.

**The Make.com scenario:**

1. Create a free account at **make.com**.
2. Tap **Create a new scenario**.
3. **Module 1 — Webhooks → Custom webhook.**
   - Tap **Add**, name it `amar-bagan-shipped`, and Make gives you a webhook
     URL like `https://hook.eu2.make.com/abc123...`. Copy it.
4. **Module 2 — WhatsApp Business Cloud → Send a Message** (or Twilio
   WhatsApp, whichever account you have).
   - Connect your WhatsApp Business / Meta account.
   - Map the recipient to the phone number coming from the webhook
     (`{{1.phone}}`).
   - Set the message body to the empathetic template below.
5. Turn the scenario **ON**.

**The webhook payload your app will send** (structure to expect in Make):

```json
{
  "event": "order_shipped",
  "orderId": "AB12345",
  "customerName": "Rahim",
  "phone": "8801712345678",
  "city": "Dhaka",
  "selectedProduct": "10kg Family Crate",
  "balanceDue": 1200,
  "paymentPlan": "partial_cod_advance"
}
```

**The empathetic message template** (paste into the WhatsApp module body):

```
Assalamualaikum {{1.customerName}}. 🥭

Good news — our farmers in Rajshahi have just hand-packed your
{{1.selectedProduct}} with great care, and it is now on its way to {{1.city}}.

A rider will call you shortly. Please do receive their call — behind every box
is a small farming family whose hard work depends on each delivery reaching its
home. Your support means the world to them.

{{#if (eq 1.paymentPlan "partial_cod_advance")}}
Balance due on delivery: ৳{{1.balanceDue}}.
{{/if}}

With gratitude,
Amar Bagan / আমার বাগান
```

(If your Make plan does not support the conditional block, simply remove the
`{{#if}}...{{/if}}` lines and always state the balance, or omit it.)

### The one code addition for Option A

In `lib/orders.js`, the `updateOrderStatus` function is where you add the
webhook call. After the status is written, if the new status is `Shipped`, send
the payload to your Make webhook URL. Store that URL as a new Vercel environment
variable `NEXT_PUBLIC_MAKE_SHIPPED_WEBHOOK` and the function can read it. The
addition is small and I can provide the exact lines on request — I have left it
out of the committed code so that no half-configured webhook fires by accident
before you have built the Make scenario.

### Option B: Make.com watches Firestore directly

If you prefer no code change at all, Make.com can poll Firestore on a schedule:

1. **Module 1 — Google Cloud Firestore → Search Documents**, every 15 minutes,
   filtered to `orderStatus = "Shipped"` and a custom `notified` flag that is
   not yet true.
2. **Module 2 — WhatsApp** as above.
3. **Module 3 — Firestore → Update Document**, setting `notified = true` so the
   same order is never messaged twice.

Option B avoids touching the code but is slower (messages go out on the poll
interval, not instantly) and consumes more Make operations. For a premium brand
where the timing of that message matters, Option A is the better experience.

---

## AFTER LAUNCH — YOUR DAILY FLOW

- **Take orders:** customers order at your main URL. Full pre-payers are pushed
  the 2kg-free reward; everyone else commits at least 200 BDT. No pure COD.
- **Manage orders:** go to `yoursite.vercel.app/admin`, sign in with your
  Google admin account, and move orders through Pending → Shipped → Delivered.
  Marking Shipped is what triggers the WhatsApp message (once Make is connected).
- **Grow:** share `yoursite.vercel.app/affiliate` so customers can claim a
  referral link and promote you. Each confirmed order through their link is
  credited to them.
- **Let Facebook learn:** with the Pixel live, every purchase teaches Facebook's
  algorithm who your high-value buyers are, so your ad spend increasingly finds
  more solvent, pre-paying customers.

## UPDATING THE SITE LATER

Any change you push to the GitHub repo triggers an automatic Vercel rebuild and
redeploy within a couple of minutes. You never repeat Parts 1–4; they are
one-time. From your phone, edit a file directly in GitHub, commit it, and the
live site updates itself.

---

## A REALISTIC NOTE ON THE PHONE-ONLY CONSTRAINT

Everything above is genuinely doable from the S23 Ultra. The only step that can
feel fiddly on a phone is the GitHub file upload in Part 2, because mobile
browsers vary in how well they handle multi-folder uploads. If you hit a wall
there, the Codespaces fallback removes all doubt by giving you a real terminal
in a browser tab. Once the code is on GitHub the first time, you may never need
to touch that step again — all future updates are single-file edits committed
straight from the GitHub mobile interface.
