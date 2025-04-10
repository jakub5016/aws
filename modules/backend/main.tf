variable "vpc" {}
variable "bucket_name" {}
variable "subnet1" {}
variable "subnet2" {}

variable "db_username" {}
variable "db_password" {}

variable "app_client_id" {}
variable "app_client_secret" {}
variable "user_pool_id" {}

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
    value     = "${var.subnet1}, ${var.subnet2}"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = "LabRole"
  }
  # Cloudwach 
  setting {
    namespace = "aws:elasticbeanstalk:cloudwatch:logs"
    name      = "StreamLogs"
    value     = "true"
  }
  setting {
    namespace = "aws:elasticbeanstalk:cloudwatch:logs"
    name      = "DeleteOnTerminate"
    value     = "true"
  }
  # RDS Settings
  setting {
    namespace = "aws:rds:dbinstance"
    name      = "DBEngine"
    value     = "mysql"
  }
  setting {
    namespace = "aws:rds:dbinstance"
    name      = "DBAllocatedStorage"
    value     = 10
  }
  setting {
    namespace = "aws:rds:dbinstance"
    name = "DBInstanceClass"
    value = "db.t3.small"
  }
  setting {
    namespace = "aws:rds:dbinstance"
    name = "DBEngineVersion"
    value = "8.0.40"
  }
  setting {
    namespace = "aws:rds:dbinstance"
    name = "DBPassword"
    value = var.db_password
  }
  setting {
    namespace = "aws:rds:dbinstance"
    name = "DBUser"
    value = var.db_username
  }
  setting {
    namespace = "aws:rds:dbinstance"
    name = "HasCoupledDatabase"
    value = true
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "DBSubnets"
    value     = "${var.subnet1}, ${var.subnet2}"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "APP_CLIENT_ID"
    value     = var.app_client_id
  }
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name = "APP_CLIENT_SECRET"
    value = var.app_client_secret
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name = "AWS_REGION"
    value = "us-east-1"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name = "USER_POOL_ID"
    value = var.user_pool_id
  }
}