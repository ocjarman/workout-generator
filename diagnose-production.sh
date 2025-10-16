#!/bin/bash

echo "🔍 DIAGNOSING PRODUCTION ISSUE: POST requests failing"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKEND_URL="https://workout-generator-j3np.onrender.com"

echo "1️⃣  Testing Backend API Endpoints..."
echo "-----------------------------------"

# Test GET request
echo -n "Testing GET /api/workouts: "
GET_RESULT=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/workouts")
if [ "$GET_RESULT" = "200" ]; then
    echo -e "${GREEN}✓ Success (HTTP $GET_RESULT)${NC}"
else
    echo -e "${RED}✗ Failed (HTTP $GET_RESULT)${NC}"
fi

# Test POST request without CORS (from server side)
echo -n "Testing POST /api/users/save: "
POST_RESULT=$(curl -s -o /dev/null -w "%{http_code}" \
    -X POST "$BACKEND_URL/api/users/save" \
    -H "Content-Type: application/json" \
    -d '{"auth0_id":"test123","email":"test@test.com"}')
if [ "$POST_RESULT" = "200" ]; then
    echo -e "${GREEN}✓ Success (HTTP $POST_RESULT)${NC}"
else
    echo -e "${RED}✗ Failed (HTTP $POST_RESULT)${NC}"
fi

# Test OPTIONS (CORS preflight)
echo -n "Testing OPTIONS /api/users/save (CORS preflight): "
OPTIONS_RESULT=$(curl -s -o /dev/null -w "%{http_code}" \
    -X OPTIONS "$BACKEND_URL/api/users/save" \
    -H "Origin: https://workout-eta.vercel.app" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type")
if [ "$OPTIONS_RESULT" = "200" ] || [ "$OPTIONS_RESULT" = "204" ]; then
    echo -e "${GREEN}✓ Success (HTTP $OPTIONS_RESULT)${NC}"
else
    echo -e "${RED}✗ Failed (HTTP $OPTIONS_RESULT) - This is likely your problem!${NC}"
fi

echo ""
echo "2️⃣  Checking CORS Headers..."
echo "-----------------------------------"
CORS_HEADERS=$(curl -s -I -X OPTIONS "$BACKEND_URL/api/users/save" \
    -H "Origin: https://workout-eta.vercel.app" \
    -H "Access-Control-Request-Method: POST")

echo "$CORS_HEADERS" | grep -i "access-control" || echo -e "${RED}No CORS headers found!${NC}"

echo ""
echo "3️⃣  Testing POST with Full CORS Headers..."
echo "-----------------------------------"
curl -i -X POST "$BACKEND_URL/api/users/save" \
    -H "Origin: https://workout-eta.vercel.app" \
    -H "Content-Type: application/json" \
    -d '{"auth0_id":"test_cors","email":"test@cors.com"}' 2>&1 | head -20

echo ""
echo "4️⃣  Checking if Backend is Deployed..."
echo "-----------------------------------"
echo "Backend URL: $BACKEND_URL"
echo -n "Status: "
PING=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/workouts")
if [ "$PING" = "200" ]; then
    echo -e "${GREEN}✓ Backend is UP and responding${NC}"
else
    echo -e "${RED}✗ Backend returned HTTP $PING${NC}"
fi

echo ""
echo "=================================================="
echo "📋 DIAGNOSIS SUMMARY"
echo "=================================================="
echo ""

if [ "$OPTIONS_RESULT" = "200" ] || [ "$OPTIONS_RESULT" = "204" ]; then
    echo -e "${GREEN}✓ CORS Preflight: Working${NC}"
else
    echo -e "${RED}✗ CORS Preflight: FAILING${NC}"
    echo ""
    echo "  💡 FIX: Deploy the updated server code with CORS fix"
    echo "     1. git add ."
    echo "     2. git commit -m 'Fix CORS for POST requests'"
    echo "     3. git push origin main"
    echo "     4. Wait for Render to auto-deploy (~2-3 min)"
fi

if [ "$POST_RESULT" = "200" ]; then
    echo -e "${GREEN}✓ POST Endpoint: Working${NC}"
else
    echo -e "${RED}✗ POST Endpoint: Issues detected${NC}"
fi

if [ "$GET_RESULT" = "200" ]; then
    echo -e "${GREEN}✓ GET Endpoint: Working${NC}"
else
    echo -e "${RED}✗ GET Endpoint: Issues detected${NC}"
fi

echo ""
echo "📝 NEXT STEPS:"
echo ""
echo "1. If CORS Preflight is failing:"
echo "   - The updated CORS code needs to be deployed to Render"
echo "   - Run: git push origin main"
echo "   - Wait for Render to auto-deploy"
echo ""
echo "2. Check Vercel Environment Variables:"
echo "   - Go to: https://vercel.com/dashboard"
echo "   - Settings → Environment Variables"
echo "   - Ensure VITE_API_URL = $BACKEND_URL"
echo "   - Redeploy Vercel with cache disabled"
echo ""
echo "3. Test in browser:"
echo "   - Open DevTools (F12) → Network tab"
echo "   - Filter by 'Fetch/XHR'"
echo "   - Try to save a workout"
echo "   - Check if OPTIONS request returns 200/204"
echo ""

