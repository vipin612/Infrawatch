variable "aws_region" {
  description = "AWS region to deploy the cluster"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "infrawatch"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS nodes"
  type        = string
  default     = "t3.medium"
}

variable "min_nodes" {
  description = "Minimum number of nodes in the EKS node group"
  type        = number
  default     = 2
}

variable "max_nodes" {
  description = "Maximum number of nodes in the EKS node group"
  type        = number
  default     = 5
}

variable "desired_nodes" {
  description = "Desired number of nodes in the EKS node group"
  type        = number
  default     = 3
}
