variable "vpc" {}
variable "subnet1" {}
variable "subnet2" {}
variable "repo_directory" {}
variable "db_username" {}
variable "db_password" {}
variable "security_group" {}


provider "aws" {
  region = "us-east-1"
}

module "bucket" {
  source    = "./modules/bucket"
  repo_directory = var.repo_directory
}

module "backend" {
  source    = "./modules/backend"
  depends_on = [module.bucket]
  vpc= var.vpc
  subnet1= var.subnet1
  subnet2= var.subnet2
  bucket_name = module.bucket.bucket_name
  db_password = var.db_password
  db_username = var.db_username
  security_group = var.security_group
}

module "frontend" {
  source    = "./modules/frontend"
  depends_on = [module.backend]
  backend_url = module.backend.backend_url
  vpc= var.vpc
  subnet1 = var.subnet1
  bucket_name = module.bucket.bucket_name
  app_client_id = ""
  user_pool_id = ""
  cognito_domain = ""
}