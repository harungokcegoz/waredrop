#!/bin/bash

# Get the IP address
IP=$(ipconfig getifaddr en0)

if [ -z "$IP" ]; then
    echo "Error: Could not retrieve IP address. Make sure you're connected to a network."
    exit 1
fi

# Update the .env file
sed -i '' "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=http://$IP:3000/api|" .env

echo "Updated .env file with IP address: $IP"
echo "EXPO_PUBLIC_API_URL is now set to: http://$IP:3000/api"

# Install dependencies
npm install

# Rebuild the app
npm run build

# Start the Expo server
npm run ios