#!/bin/bash

# Exit on error
set -e

# ANSI color codes
GREEN='\033[0;32m'
NC='\033[0m' # No Color
RED='\033[0;31m'

echo -e "${GREEN}Setting up Node.js/Express project...${NC}"

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Create .env file if it doesn't exist and prompt for values
if [ ! -f .env ]; then
    echo -e "${GREEN}Creating .env file...${NC}"
    touch .env
fi

# Function to get or prompt for env variable
get_env_var() {
    local var_name=$1
    local prompt_message=$2
    local default_value=$3

    if grep -q "^$var_name=" .env; then
        echo -e "${GREEN}Using existing $var_name from .env file${NC}"
    else
        read -p "$(echo -e ${GREEN}$prompt_message [$default_value]: ${NC})" user_input
        user_input=${user_input:-$default_value}
        echo "$var_name=$user_input" >> .env
    fi
}

# Prompt for environment variables if they don't exist
get_env_var "DATABASE_URL" "Enter your DATABASE_URL" "postgresql://postgres:postgres@localhost:5432/digital_closet"
get_env_var "GOOGLE_CLIENT_ID" "Enter your GOOGLE_CLIENT_ID" ""

# Generate a new JWT_SECRET every time
echo -e "${GREEN}Generating new secure JWT_SECRET...${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
sed -i '' '/^JWT_SECRET=/d' .env
echo "JWT_SECRET=$JWT_SECRET" >> .env

echo -e "${RED}Please ensure all values in the .env file are correct.${NC}"

# Build the project
echo -e "${GREEN}Building the project...${NC}"
npm run build

# Start the server
echo -e "${GREEN}Starting the server...${NC}"
npm run start:with-init

echo -e "${GREEN}Node.js/Express project is now running!${NC}"
