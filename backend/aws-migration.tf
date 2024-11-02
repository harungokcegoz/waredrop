provider "aws" {
  region = "us-east-1"
}

# Default VPC and Subnets
data "aws_vpc" "default" {
  default = true
}

# Fetch the subnets for the default VPC
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}
# Elastic IP
data "aws_eip" "app_eip" {
  id = aws_eip.app_eip.id
}

# Prometheus Config File
resource "local_file" "prometheus_config" {
  filename = "${path.module}/prometheus.yml"

  content = templatefile("${path.module}/prometheus.tpl.yml", {
    eip_public_ip = data.aws_eip.app_eip.public_ip
  })
}

# Blue Environment
resource "aws_instance" "app_server_blue" {
  count         = var.enable_blue_env ? var.blue_instance_count : 0
  ami           = "ami-0e86e20dae9224db8"
  instance_type = "t2.medium"
  key_name      = var.aws_key_pair_name

  vpc_security_group_ids = [aws_security_group.allow_web.id]

  tags = {
    Name = "Digital-Closet-Server-Blue"
  }

  user_data = base64encode(templatefile("${path.module}/setup_instance.tpl", {
    gitlab_access_token = var.gitlab_access_token
    branch_name         = var.branch_name
    eip_public_ip       = data.aws_eip.app_eip.public_ip
    file_content        = "Digital-Closet-Server-Blue Version: 1.0 - ${count.index}"
  }))



  monitoring = true

  root_block_device {
    volume_type = "gp2"
    volume_size = 20
    encrypted   = true
  }

  depends_on = [aws_security_group.allow_web]
}

# Green Environment
resource "aws_instance" "app_server_green" {
  count         = var.enable_green_env ? var.green_instance_count : 0
  ami           = "ami-0e86e20dae9224db8"
  instance_type = "t2.medium"
  key_name      = var.aws_key_pair_name

  vpc_security_group_ids = [aws_security_group.allow_web.id]

  tags = {
    Name = "Digital-Closet-Server-Green"
  }

  user_data = base64encode(templatefile("${path.module}/setup_instance.tpl", {
    gitlab_access_token = var.gitlab_access_token
    branch_name         = var.branch_name
    eip_public_ip       = data.aws_eip.app_eip.public_ip
    file_content        = "Digital-Closet-Server-Green Version: 1.0 - ${count.index}"
  }))

  monitoring = true

  root_block_device {
    volume_type = "gp2"
    volume_size = 20
    encrypted   = true
  }

  depends_on = [aws_security_group.allow_web]
}

# Load Balancer
resource "aws_lb" "app_lb" {
  name               = "digital-closet-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow_web.id]
  subnets            = data.aws_subnets.default.ids

  enable_deletion_protection = false
  idle_timeout               = 60

  tags = {
    Name = "Digital-Closet-LB"
  }
}

# Blue Target Group
resource "aws_lb_target_group" "blue_tg" {
  name        = "blue-target-group"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "instance"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
  }
}

# Green Target Group
resource "aws_lb_target_group" "green_tg" {
  name        = "green-target-group"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "instance"

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
  }
}

# Listener
resource "aws_lb_listener" "app_lb_listener" {
  load_balancer_arn = aws_lb.app_lb.arn
  port              = 80
  protocol          = "HTTP"

  dynamic "default_action" {
    for_each = var.switch_traffic_to_green ? [1] : []
    content {
      type             = "forward"
      target_group_arn = aws_lb_target_group.green_tg.arn
    }
  }

  dynamic "default_action" {
    for_each = var.switch_traffic_to_green ? [] : [1]
    content {
      type             = "forward"
      target_group_arn = aws_lb_target_group.blue_tg.arn
    }
  }
}

# Target Group Attachments
resource "aws_lb_target_group_attachment" "blue_tg_attachment" {
  count            = length(aws_instance.app_server_blue)
  target_group_arn = aws_lb_target_group.blue_tg.arn
  target_id        = aws_instance.app_server_blue[count.index].id
  port             = 3000
  depends_on       = [aws_lb.app_lb]
}

resource "aws_lb_target_group_attachment" "green_tg_attachment" {
  count            = length(aws_instance.app_server_green)
  target_group_arn = aws_lb_target_group.green_tg.arn
  target_id        = aws_instance.app_server_green[count.index].id
  port             = 3000
  depends_on       = [aws_lb.app_lb]
}

# Security Group for Web Traffic
resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic_new"
  description = "Allow inbound web traffic"

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Application Port"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["89.205.128.193/32"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Elasticsearch"
    from_port   = 9200
    to_port     = 9200
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Kibana"
    from_port   = 5601
    to_port     = 5601
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Logstash"
    from_port   = 5044
    to_port     = 5044
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Prometheus"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Grafana"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Alertmanager"
    from_port   = 9093
    to_port     = 9093
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_web"
  }
}

# Associate Elastic IP
resource "aws_eip_association" "eip_assoc" {
  count = length(aws_instance.app_server_blue)
  # count       = length(aws_instance.app_server_blue)
  instance_id = aws_instance.app_server_blue[count.index].id
  # instance_id = aws_instance.app_server_blue[count.index].id
  # instance_id   = aws_instance.app_server.id 
  allocation_id = data.aws_eip.app_eip.id

  depends_on = [aws_instance.app_server_blue]
}

# Output the load balancer DNS
output "elb_dns" {
  value = aws_lb.app_lb.dns_name
}

# Output the Public IP
output "public_ip" {
  value = data.aws_eip.app_eip.public_ip
}

output "blue_instance_info" {
  value = [
    for inst in aws_instance.app_server_blue : {
      id   = inst.id
      name = inst.tags["Name"]
    }
  ]
}

output "green_instance_info" {
  value = [
    for inst in aws_instance.app_server_green : {
      id   = inst.id
      name = inst.tags["Name"]
    }
  ]
}
