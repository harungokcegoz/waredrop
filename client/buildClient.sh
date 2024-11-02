#!/bin/bash

# ANSI color code for green
GREEN='\033[0;32m'
# ANSI color code to reset text color
NC='\033[0m' # No Color

# Get the IP address
IP=$(ipconfig getifaddr en0)

if [ -z "$IP" ]; then
    echo "Error: Could not retrieve IP address. Make sure you're connected to a network."
    exit 1
fi

# Update the .env file
sed -i '' "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=http://$IP:3000/api|" .env

echo "${GREEN}Updated .env file with IP address: $IP${NC}"
echo "${GREEN}EXPO_PUBLIC_API_URL is now set to: http://$IP:3000/api${NC}"

# Install dependencies
npm install

# Rebuild the app
npm run build

# Start the Expo server
npm run ios