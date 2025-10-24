#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:5000"

echo "🧪 Testing Sports Store API..."
echo "================================"

# Test 1: Health Check
echo -e "\n${YELLOW}Test 1: Health Check${NC}"
response=$(curl -s -w "\n%{http_code}" ${BASE_URL})
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed (HTTP $http_code)${NC}"
    exit 1
fi

# Test 2: Register User
echo -e "\n${YELLOW}Test 2: Register New User${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST ${BASE_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "full_name": "Test User"
  }')
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 201 ]; then
    echo -e "${GREEN}✓ User registration passed${NC}"
    # Extract token for next tests
    TOKEN=$(echo "$response" | head -n-1 | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}✗ User registration failed (HTTP $http_code)${NC}"
    echo "$response" | head -n-1
fi

# Test 3: Login
echo -e "\n${YELLOW}Test 3: Login${NC}"
response=$(curl -s -w "\n%{http_code}" -X POST ${BASE_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kiwisport.vn",
    "password": "admin123"
  }')
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Login passed${NC}"
    ADMIN_TOKEN=$(echo "$response" | head -n-1 | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${YELLOW}⚠ Login failed - Admin user might not exist${NC}"
fi

# Test 4: Get Categories
echo -e "\n${YELLOW}Test 4: Get Categories${NC}"
response=$(curl -s -w "\n%{http_code}" ${BASE_URL}/api/categories)
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Get categories passed${NC}"
else
    echo -e "${RED}✗ Get categories failed (HTTP $http_code)${NC}"
fi

# Test 5: Get Products
echo -e "\n${YELLOW}Test 5: Get Products${NC}"
response=$(curl -s -w "\n%{http_code}" ${BASE_URL}/api/products)
http_code=$(echo "$response" | tail -n1)
if [ "$http_code" -eq 200 ]; then
    echo -e "${GREEN}✓ Get products passed${NC}"
else
    echo -e "${RED}✗ Get products failed (HTTP $http_code)${NC}"
fi

# Test 6: Get Cart (requires auth)
if [ ! -z "$TOKEN" ]; then
    echo -e "\n${YELLOW}Test 6: Get Cart (Authenticated)${NC}"
    response=$(curl -s -w "\n%{http_code}" ${BASE_URL}/api/cart \
      -H "Authorization: Bearer $TOKEN")
    http_code=$(echo "$response" | tail -n1)
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✓ Get cart passed${NC}"
    else
        echo -e "${RED}✗ Get cart failed (HTTP $http_code)${NC}"
    fi
fi

# Test 7: Get Profile (requires auth)
if [ ! -z "$TOKEN" ]; then
    echo -e "\n${YELLOW}Test 7: Get User Profile${NC}"
    response=$(curl -s -w "\n%{http_code}" ${BASE_URL}/api/auth/me \
      -H "Authorization: Bearer $TOKEN")
    http_code=$(echo "$response" | tail -n1)
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✓ Get profile passed${NC}"
    else
        echo -e "${RED}✗ Get profile failed (HTTP $http_code)${NC}"
    fi
fi

echo -e "\n================================"
echo -e "${GREEN}✅ API Tests Completed!${NC}"
echo -e "\n💡 Tips:"
echo "  - Import sample data from database.sql"
echo "  - Create admin user to test admin endpoints"
echo "  - Use Postman for more detailed testing"
