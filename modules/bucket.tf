resource "aws_s3_bucket" "main_bucket" {
  bucket = "main_bucket"
}

resource "aws_s3_bucket_object" "backend_app_zip" {
  bucket = aws_s3_bucket.main_bucket.id
  key    = "backend-app.zip"
  source = "./project/backend/backend-app.zip"
}


resource "aws_s3_bucket_object" "frontend-app" {
  bucket = aws_s3_bucket.main_bucket.id
  key    = "frontend-app.zip"
  source = "./project/fronted/frontend-app.zip"
}
