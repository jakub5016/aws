output "app_client_id" {
  value = aws_cognito_user_pool_client.user_pool_client.id
  sensitive = true
}

output "app_client_secret" {
  value = aws_cognito_user_pool_client.user_pool_client.client_secret
  sensitive = true
}

output "user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}