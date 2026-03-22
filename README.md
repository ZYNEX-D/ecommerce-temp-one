1. Navigate to the Login Page
Open your browser and go to the login URL: http://localhost:3000/auth/login

2. Use the Admin Credentials
Use the following default credentials (which are seeded in your database):

Email: admin@apexauto.com
Password: admin123


.env configurations

DATABASE_URL="mysql://root:@localhost:3306/mydb"
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=apex_auto_secret_key_2024_performance_spares
AUTH_SECRET="h63920970-1616-419b-8772-972bcc75aa54" # Added for Auth.js v5



Remove .env file by gitignore file