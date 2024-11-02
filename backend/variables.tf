variable "gitlab_access_token" {
  description = "GitLab personal access token for cloning the repository"
  type        = string
  sensitive   = true
}

variable "branch_name" {
  description = "The branch that will be cloned"
  type        = string
  default     = "demo-school"
}

variable "aws_key_pair_name" {
  description = "Name of the AWS key pair to use for the EC2 instance"
  type        = string
  default     = "aws-key-pair"
}


variable "blue_instance_count" {
  description = "Number of instances in the blue environment"
  type        = number
  default     = 1
}

variable "enable_blue_env" {
  description = "Enable the blue environment"
  type        = bool
  default     = true
}

variable "green_instance_count" {
  description = "Number of instances in the green environment"
  type        = number
  default     = 1
}

variable "enable_green_env" {
  description = "Enable the green environment"
  type        = bool
  default     = true
}

variable "switch_traffic_to_green" {
  description = "Switch traffic to green environment if true, otherwise blue."
  type        = bool
  default     = false
}
