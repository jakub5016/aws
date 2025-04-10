resource "aws_cognito_user_pool" "user_pool" {
  name = "my_user_pool"

  auto_verified_attributes = ["email"]

  schema {
    attribute_data_type = "String"
    name               = "email"
    required           = true
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
  }
}

resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = "my_user_pool_client"
  user_pool_id = aws_cognito_user_pool.user_pool.id
  generate_secret = true
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
  ]
}