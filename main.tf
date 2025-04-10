variable "repo_directory" {}
variable "db_username" {}
variable "db_password" {}

provider "aws" {
  region = "us-east-1"
}

data "aws_vpc" "selected" {
  default = true
}

data "aws_subnets" "selected" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.selected.id]
  }
}

data "aws_subnet" "subnet1" {
  id = data.aws_subnets.selected.ids[0]
}

data "aws_subnet" "subnet2" {
  id = data.aws_subnets.selected.ids[1]
}


# Modules
module "bucket" {
  source    = "./modules/bucket"
  repo_directory = var.repo_directory
}

module "cognito" {
  source    = "./modules/cognito"
}

module "backend" {
  source    = "./modules/backend"
  depends_on = [module.bucket, module.cognito]
  vpc= data.aws_vpc.selected.id
  subnet1= data.aws_subnet.subnet1.id
  subnet2= data.aws_subnet.subnet2.id
  bucket_name = module.bucket.bucket_name
  db_password = var.db_password
  db_username = var.db_username
  app_client_id = module.cognito.app_client_id
  app_client_secret = module.cognito.app_client_secret
  user_pool_id = module.cognito.user_pool_id
}


module "frontend" {
  source    = "./modules/frontend"
  depends_on = [module.backend, module.cognito]
  backend_url = module.backend.backend_url
  vpc=  data.aws_vpc.selected.id
  subnet1= data.aws_subnet.subnet1.id
  bucket_name = module.bucket.bucket_name
  app_client_id = module.cognito.app_client_id
  app_client_secret = module.cognito.app_client_secret 
}

module "cloudwatch" {
  source    = "./modules/cloudwatch"
  depends_on = [module.backend]
}