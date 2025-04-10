resource "aws_cloudwatch_metric_alarm" "too_many_write" {
  alarm_name          = "too_many_write"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "WriteLatency"
  namespace           = "AWS/RDS"
  period              = 300 # in seconds
  statistic           = "Sum"
  threshold           = 0.02 # in seconds

  alarm_description = "Alarm when write operations took to long"
}
