#!/bin/bash

echo "Starting setup script..." > /var/log/user-data-log.txt
date >> /var/log/user-data-log.txt

# Function to check the last command's exit status and log errors
check_status() {
    local exit_status=$?  # Capture the exit status of the last command
    if [ $exit_status -ne 0 ]; then
        error_message="Error: $1 failed"
        echo "$error_message" >> /var/log/user-data-log.txt
        echo "$error_message"
        exit 1
    else
        echo -e "\033[32m$1 is successfully set up.\033[0m" >> /var/log/user-data-log.txt
    fi
}

# Update and install dependencies
echo "Updating system and installing dependencies..."
sudo apt-get update
check_status "System update"
sudo apt-get install -y docker.io curl git
sudo apt-get install -y docker.io curl git nginx
check_status "Installing dependencies"

echo "${file_content}" > /var/www/html/index.nginx-debian.html
check_status "Writing content to index.nginx-debian.html"

# Start and enable NGINX
echo "Starting NGINX service..."
sudo systemctl start nginx
check_status "Starting NGINX service"
sudo systemctl enable nginx
check_status "Enabling NGINX service"
echo "Setup script completed." >> /var/log/user-data-log.txt



# Configure Docker
echo "Configuring Docker..."
sudo systemctl start docker
check_status "Starting Docker service"
sudo systemctl enable docker
check_status "Enabling Docker service"
sudo usermod -aG docker ubuntu
check_status "Adding user to docker group"

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
check_status "Downloading Docker Compose"
sudo chmod +x /usr/local/bin/docker-compose
check_status "Setting Docker Compose permissions"

# Clone the repository using the GitLab token
echo "Cloning repository..."
sudo -u ubuntu git clone -b ${branch_name} https://oauth2:${gitlab_access_token}@gitlab.com/saxionnl/hbo-ict/aad/backend/74.git /home/ubuntu/digital-closet
check_status "Cloning repository"

sleep 10


# Add prometheus.yml if missing
if [ ! -f /home/ubuntu/digital-closet/backend/node/prometheus.yml ]; then
    echo "prometheus.yml not found, creating a placeholder..."
    cat <<EOL > /home/ubuntu/digital-closet/backend/node/prometheus.yml
global:
  scrape_interval: 15s
rule_files:
  - /etc/prometheus/alert_rules.yml

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - ${eip_public_ip}:9093 
scrape_configs:
  - job_name: 'nodejs-app'
    static_configs:
      - targets: ['${eip_public_ip}:3000']
    metrics_path: '/api/metrics'
EOL
    check_status "Creating prometheus.yml"
fi

# Set up and run the application
echo "Setting up and running the application..."
cd /home/ubuntu/digital-closet/backend/node || exit 1
docker-compose up --build -d 
check_status "Starting containers"

echo "Setup script completed." >> /var/log/user-data-log.txt