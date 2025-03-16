variable "vpc" {}
variable "subnet" {}

resource "aws_elastic_beanstalk_application" "backend" {
  name = "Backend"
}

resource "aws_elastic_beanstalk_application_version" "backend_version" {
  name        = "1"
  application = aws_elastic_beanstalk_application.backend.name
  bucket      = aws_s3_bucket.main_bucket.id
  key         = aws_s3_object.backend_app_zip.key
}

resource "aws_elastic_beanstalk_environment" "backend_env" {
  name                = "backend-envv"
  application         = aws_elastic_beanstalk_application.backend.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.5 running Docker" # Ensure this version is up to date
  tier                = "WebServer"
  version_label       = aws_elastic_beanstalk_application_version.fronted_version.name

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

output "backend_url" {
  value = aws_elastic_beanstalk_environment.backend_env.endpoint_url
}