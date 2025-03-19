variable "vpc" {}
variable "subnet" {}
variable "bucket_name" {}

resource "aws_elastic_beanstalk_application" "backend" {
  name = "Backend"
}

resource "aws_elastic_beanstalk_application_version" "backend_version" {
  name        = "1"
  application = aws_elastic_beanstalk_application.backend.name
  bucket      = var.bucket_name
  key         = "backend-app-zipped"
}

resource "aws_elastic_beanstalk_environment" "backend_env" {
  name                = "backend-env"
  application         = aws_elastic_beanstalk_application.backend.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.4.4 running Docker"
  tier                = "WebServer"
  version_label       = aws_elastic_beanstalk_application_version.backend_version.name

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t3.nano"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "LabInstanceProfile"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = var.vpc
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = var.subnet
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = "LabRole"
  }

  setting {
    namespace = "aws:elasticbeanstalk:managedactions"
    name      = "ManagedActionsEnabled"
    value     = "false"
  }

}