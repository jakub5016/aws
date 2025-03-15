`resource "aws_elastic_beanstalk_application" "app" {
  name        = "my-docker-app"
}

resource "aws_elastic_beanstalk_environment" "env" {
  name                = "my-docker-env"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2 v3.4.2 running Docker"
  
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }
}

output "app_url" {
  value = aws_elastic_beanstalk_environment.env.endpoint_url
}
`