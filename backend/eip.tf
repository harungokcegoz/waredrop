resource "aws_eip" "app_eip" {
  domain = "vpc"

  tags = {
    Name = "app_eip"
  }
}

output "eip_id" {
  value = aws_eip.app_eip.id
}

output "eip_public_ip" {
  value = aws_eip.app_eip.public_ip
}
