terraform init
cd ./project/backend
zip -r backend-app.zip .
cd ../frontend
zip -r frontend-app.zip ./src ./public Dockerfile package.json config-overrides.js
cd ../..
terraform apply --auto-approve