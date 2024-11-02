#!/bin/bash

update_env_variable() {
  local key=$1
  local value=$2
  local env_file=".env"

  # Check if the .env file exists, if not create it
  if [ ! -f "$env_file" ]; then
    touch "$env_file"
  fi

  # Use awk instead of sed for better cross-platform compatibility
  awk -v key="$key" -v value="$value" '
    BEGIN { FS=OFS="=" }
    $1 == key { $2 = value; found = 1 }
    { print }
    END { if (!found) print key, value }
  ' "$env_file" > "${env_file}.tmp" && mv "${env_file}.tmp" "$env_file"

  echo "Updated $key in $env_file"
}

update_aws_credentials() {
  echo "Please enter your AWS Access Key ID:"
  read aws_access_key_id
  echo "Please enter your AWS Secret Access Key:"
  read aws_secret_access_key
  echo "Please enter your AWS Session Token:"
  read aws_session_token

  update_env_variable "AWS_ACCESS_KEY_ID" "$aws_access_key_id"
  update_env_variable "AWS_SECRET_ACCESS_KEY" "$aws_secret_access_key"
  update_env_variable "AWS_SESSION_TOKEN" "$aws_session_token"
  sleep 3
  clear
  echo -e "\033[32mAWS credentials updated successfully!\033[0m"
}

read_aws_credentials() {
  if [ -f .env ]; then
    source .env
    if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ] && [ -n "$AWS_SESSION_TOKEN" ]; then
      echo -e "\033[34mAWS credentials read from .env file.\033[0m"
    else
      echo -e "\033[31mAWS credentials not found or incomplete in .env file.\033[0m"
      update_aws_credentials
    fi
  else

    echo -e "\033[31m.env file not found.\033[0m"
    update_aws_credentials
  fi
}

update_gitlab_token() {
    echo "System needs your GitLab access token to clone the backend on the instances." 
    echo "To generate a GitLab access token, follow these steps:"
    echo "1. Sign in to your GitLab account."
    echo "2. Click on your avatar in the aside bar's corner on left and click on 'Preferences'."
    echo "3. In the left sidebar, click on 'Access Tokens'."
    echo "4. Click on 'Add new token'."
    echo "5. Enter a name for the token, set an optional expiration date, and select the desired scopes. For this script, you will need the 'api' scope."
    echo "6. Select all the scopes and click on 'Create personal access token'."
    echo "7. Copy the generated token and use it when prompted below."

    echo -e "\033[34mPlease enter your GitLab personal access token:\033[0m"
    read gitlab_access_token
    update_env_variable "GITLAB_ACCESS_TOKEN" "$gitlab_access_token"
    echo -e "\033[32mGitLab token updated successfully!\033[0m"
}

read_gitlab_token() {
  if [ -f .env ]; then
    source .env
    if [ -n "$GITLAB_ACCESS_TOKEN" ]; then
      gitlab_access_token=$GITLAB_ACCESS_TOKEN
      echo -e "\033[34mGitLab token read from .env file.\033[0m"
    else
      echo -e "\033[31mGITLAB_ACCESS_TOKEN not found in .env file.\033[0m"
      update_gitlab_token
    fi
  else
    echo -e "\033[31m.env file not found.\033[0m"
    update_gitlab_token
  fi
}

check_credentials() {
  read_aws_credentials
  read_gitlab_token
}

run_terraform() {
  local action=$1
  
  # Export AWS credentials for Terraform to use
  export AWS_ACCESS_KEY_ID
  export AWS_SECRET_ACCESS_KEY
  export AWS_SESSION_TOKEN

  case $action in
    plan)
      echo -e "\033[34mPlanning Terraform changes...\033[0m"
      terraform plan -var="gitlab_access_token=$gitlab_access_token" 
      echo -e "\033[34mApplying Terraform changes...\033[0m"
      terraform apply -var="gitlab_access_token=$gitlab_access_token" -auto-approve
      ;;
    destroy)
      echo -e "\033[31mWARNING: This will destroy all resources managed by Terraform.\033[0m"
      read -p "Are you sure you want to proceed? (y/n): " confirm
      if [[ $confirm == "y" || $confirm == "Y" ]]; then
      
        echo -e "\033[32mDestroying Terraform-managed resources...\033[0m"
        terraform destroy -var="gitlab_access_token=$gitlab_access_token" -auto-approve
      else
        echo -e "\033[31mDestroy operation cancelled.\033[0m"
      fi
      ;;
    *)
      echo -e "\033[31mInvalid action. Use 'plan', 'apply', or 'destroy'.\033[0m"
      exit 1
      ;;
  esac
}

# Ask if user has correct credentials in env file 
read -p "Do you want to update the credentials in .env file? (y/n): " update_credentials
if [[ $update_credentials == "y" || $update_credentials == "Y" ]]; then
  echo -e "\033[34mUpdating credentials.\033[0m"
  update_aws_credentials
  else
    echo -e "\033[34mUsing existing credentials.\033[0m"
fi

# Ask if user has correct gitlab token in env file 
read -p "Do you want to update the gitlab token in .env file? (y/n): " update_gitlab_token
if [[ $update_gitlab_token == "y" || $update_gitlab_token == "Y" ]]; then
  echo -e "\033[34mUpdating gitlab token.\033[0m"
  update_gitlab_token
else
  echo -e "\033[34mUsing existing gitlab token.\033[0m"
fi

# Main script execution with blue color
echo -e "\033[34mInitializing Terraform...\033[0m"
terraform init 

check_credentials

# Prompt user for action
echo "Choose an action:"
echo "1) Plan and apply changes"
echo "2) Destroy resources"
read -p "Enter your choice (1/2): " choice

case $choice in
  1) run_terraform plan ;;
  2) run_terraform destroy ;;
  *) echo -e "\033[31mInvalid choice. Exiting.\033[0m"; exit 1 ;;
esac