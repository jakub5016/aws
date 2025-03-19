variable "vpc" {}
variable "subnet" {}
variable "repo_directory" {
  
}
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
  subnet= var.subnet
  bucket_name = module.bucket.bucket_name
}

module "frontend" {
  source    = "./modules/frontend"
  depends_on = [module.backend]
  backend_url = module.backend.backend_url
  vpc= var.vpc
  subnet= var.subnet
  bucket_name = module.bucket.bucket_name
}