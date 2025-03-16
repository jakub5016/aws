variable "vpc" {}
variable "subnet" {}

provider "aws" {
  region = "us-east-1"
}

module "bucket" {
  source    = "./modules/bucket"
}

module "backend" {
  source    = "./modules/backend"
  depends_on = [module.bucket]
  vpc= var.vpc
  subnet= var.subnet
}

module "frontend" {
  source    = "./modules/frontend"
  depends_on = [module.backend]
  backend_url = module.backend.backend_url
  vpc= var.vpc
  subnet= var.subnet
}