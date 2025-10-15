# Troubleshooting "Invalid Compact JWS" Error

## Summary

Your Auth0 configuration appears to be set correctly (audience values match), but you're getting an "Invalid Compact JWS" error. This guide will help you debug and fix the issue.

## What Changed

I've added extensive debugging to both client and server to help identify the exact problem:

### Client Side (App.tsx)
- ✅ Added token validation (checks if JWT has 3 parts)
- ✅ Added detailed console logging
- ✅ Added helpful error messages with solutions

### Server Side (index.ts)
- ✅ Added request logging
- ✅ Added token inspection (length, parts count)
- ✅ Added detailed error responses
- ✅ Better error handling with hints

## How to Debug

### Step 1: Clear Auth0 Cache

The most common cause of this error is **stale Auth0 data** in your browser.

1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Run this command:
   ```javascript
   localStorage.clear(); sessionStorage.clear(); location.reload();
   ```

### Step 2: Restart Your Servers

```bash
# Stop both servers (Ctrl+C)

# Terminal 1: Start the server
cd server
npm run dev

# Terminal 2: Start the client
cd client
npm run dev
```

### Step 3: Login and Check Console Logs

After logging in, check **both** the browser console and the server terminal for detailed logs.

#### What You Should See in Browser Console (Success):

```
🔐 Attempting to get access token...
✅ Token retrieved successfully
Token length: 800 (or similar, should be 200+)
Token preview: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6...
📡 Sending user data to: http://localhost:3000/api/users/me
✅ User synced successfully: {id: 1, email: "user@example.com", ...}
```

#### What You Should See in Server Terminal (Success):

```
📨 Received POST /api/users/me request
Authorization header present: true
Token length: 800
Token preview: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6...
Token parts: 3 (should be 3 for JWT)
Auth0 ID: auth0|123456789
User email: user@example.com
✅ User synced successfully: 1 user@example.com
```

## Common Issues and Solutions

### Issue 1: Token has only 1 part (Opaque Token)

**Symptom:**
```
Token parts: 1 (should be 3 for JWT)
```

**Cause:** Auth0 is not issuing JWT tokens because the audience is not being used.

**Solution:**
1. Make sure you've created an **API** in Auth0 Dashboard (not just an Application)
2. Verify `VITE_AUTH0_AUDIENCE` in `client/.env` matches your Auth0 API identifier
3. Clear browser cache and login again

### Issue 2: "consent_required" error

**Symptom:**
```
❌ Error syncing user: {...}
⚠️ User consent required for API access
```

**Solution:**
1. Go to Auth0 Dashboard
2. Navigate to **Applications** → **APIs** → Your API
3. Go to **Settings** tab
4. Enable **"Allow Skipping User Consent"**
5. Save changes
6. Clear browser cache and login again

### Issue 3: Audience mismatch

**Symptom:**
```
InvalidTokenError: Invalid Compact JWS
```

**Solution:**
Run the test script to verify configuration:
```bash
./test-auth0.sh
```

Make sure the audience values match exactly:
```bash
# Should output the same value
grep VITE_AUTH0_AUDIENCE client/.env
grep AUTH0_AUDIENCE server/.env
```

### Issue 4: Token is undefined or null

**Symptom:**
```
Token length: undefined
Authorization header present: false
```

**Solution:**
1. Check that your Auth0 Application has the API permissions
2. In Auth0 Dashboard → Applications → Your App → APIs tab
3. Make sure your API is authorized
4. Check the scopes are granted

## Verify Your Auth0 Setup

### Check 1: Auth0 API Exists
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **APIs**
3. You should see your API (e.g., "Workout Generator API")
4. Click on it and note the **Identifier** (this is your audience)

### Check 2: Environment Variables
Run the test script:
```bash
./test-auth0.sh
```

All checks should pass ✅

### Check 3: Application Settings
1. Go to **Applications** → **Applications** → Your App
2. Click on **APIs** tab
3. Make sure your API is listed and authorized

## Still Not Working?

If you're still getting the error after following these steps:

1. **Copy all the console logs** from both browser and server
2. **Check the token at jwt.io**: Copy the token from the console and paste it at https://jwt.io/
   - If it says "Invalid Token", that confirms it's not a proper JWT
   - If it decodes successfully, the issue is with the verification

3. **Verify Auth0 Dashboard Settings**:
   - Domain matches: `dev-k72b14bf7lqd4jeh.us.auth0.com`
   - Audience matches: `https://workout-generator-api`
   - API uses RS256 signing algorithm

4. **Try a fresh login**:
   - Logout from your app
   - Clear all browser data (localStorage, sessionStorage, cookies)
   - Close and reopen the browser
   - Login again

## Quick Test Commands

```bash
# Test Auth0 configuration
./test-auth0.sh

# Check environment variables
cat client/.env | grep AUTH0
cat server/.env | grep AUTH0

# Restart servers
pkill -f "node.*server" && pkill -f "vite" && cd server && npm run dev & cd client && npm run dev
```

## Need More Help?

Check the detailed setup guide: [AUTH0_SETUP.md](./AUTH0_SETUP.md)

