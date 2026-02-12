# 🔧 Troubleshooting: WebAuthn TLS Error

You are seeing the error: **"WebAuthn is not supported on sites with TLS certificate errors."**

This happens because Passkeys (WebAuthn) require a **Secure Context**. This means the site must be served over:
1.  **`http://localhost`** (Logic: Localhost is considered secure by browsers)
2.  **`https://`** with a **Valid, Trusted Certificate**

## 🚫 The Problem
You are likely accessing the app via:
- `https://localhost:3000` (with a self-signed/invalid certificate)
- `http://192.168.x.x:3000` (Local IP address is NOT secure)
- A tunnel (ngrok/localtunnel) with certificate warnings

## ✅ The Fixes

### Option 1: Use HTTP Localhost (Recommended for Desktop)
1.  Check your browser URL bar.
2.  Ensure it says **`http://localhost:3000`** exactly.
3.  If it says `https://`, manually change it to `http://`.
4.  If Chrome forces HTTPS, try opening the link in **Incognito Mode** or a different browser.

### Option 2: Use 127.0.0.1
Sometimes browsers act weird with `localhost`. Try accessing:
> **http://127.0.0.1:3000**

### Option 3: Testing on Mobile?
If you are trying to test on your phone, you **cannot** use your computer's IP address (`192.168...`) because it's not secure. You MUST use a secure tunnel.

**Setup LocalTunnel (Free & Easy):**
1.  Stop the current server (`Ctrl+C`).
2.  Run: `npx localtunnel --port 3000`
3.  Copy the `https://...loca.lt` URL it gives you.
4.  Open that URL on your phone.
5.  **Important:** LocalTunnel often shows a warning page first. You must click "Click to Continue" before the app loads.

### Option 4: Clear HSTS Cache (Chrome)
If Chrome keeps forcing HTTPS on localhost:
1.  Go to `chrome://net-internals/#hsts`
2.  Scroll to **"Delete domain security policies"**
3.  Enter `localhost` and click **Delete**.
4.  Restart Chrome.
