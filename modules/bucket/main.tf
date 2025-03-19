variable "repo_directory" {}

resource "aws_s3_bucket" "my_docker_bucket" {
  bucket = "awsbuckera"
}

resource "aws_s3_object" "backend_app_zip" {
  bucket = aws_s3_bucket.my_docker_bucket.id
  key    = "backend-app-zipped"
  source = "${var.repo_directory}/backend/backend-app.zip"
  etag = filemd5("${var.repo_directory}/backend/backend-app.zip")
}

resource "aws_s3_object" "frontend_app_zip" {
  bucket = aws_s3_bucket.my_docker_bucket.id
  key    = "frontend-app-zipped"
  source = "${var.repo_directory}/frontend/frontend-app.zip"
  etag = filemd5("${var.repo_directory}/frontend/frontend-app.zip")
}
