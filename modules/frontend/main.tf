variable "vpc" {}
variable "subnet" {}
variable "backend_url" {}
variable "bucket_name" {}

resource "aws_elastic_beanstalk_application" "fronted" {
  name = "Fronted"
}

resource "aws_elastic_beanstalk_application_version" "fronted_version" {
  name        = "1"
  application = aws_elastic_beanstalk_application.fronted.name
  bucket      = var.bucket_name
  key         = "frontend-app-zipped"
}

resource "aws_elastic_beanstalk_environment" "fronted_env" {
  name                = "fronted-env"
  application         = aws_elastic_beanstalk_application.fronted.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.4.4 running Docker"
  tier                = "WebServer"
  version_label       = aws_elastic_beanstalk_application_version.fronted_version.name

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t3.small"
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

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "REACT_APP_API_URL"
    value     = var.backend_url
  }
}