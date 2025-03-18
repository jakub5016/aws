resource "aws_s3_bucket" "my_docker_bucket" {
  bucket = "awsbuckera"
}

resource "aws_s3_object" "backend_app_zip" {
  bucket = aws_s3_bucket.my_docker_bucket.id
  key    = "backend-app.zip"
  source = "~/environment/aws/project/backend/backend-app.zip"
  etag = filemd5("~/environment/aws/project/backend/backend-app.zip")
}

resource "aws_s3_object" "frontend_app_zip" {
  bucket = aws_s3_bucket.my_docker_bucket.id
  key    = "frontend-app.zip"
  source = "~/environment/aws/project/frontend/frontend-app.zip"
  etag = filemd5("~/environment/aws/project/frontend/frontend-app.zip")
}

output "bucket_name" {
  value = aws_s3_bucket.main_bucket.bucket
}