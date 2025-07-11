# Recruitment System

A complete, production-ready web application for managing recruitment processes with role-based access control.

## Features

### Candidate Area
- User registration and secure login
- Profile management
- Submit applications with document uploads
- View application status and receive email notifications

### Administrator Area
- Manage recruitment announcements
- Review and process applications
- Manage academic years
- Search and filter candidates

### Super Administrator Area
- Create administrator accounts
- Manage user roles

## Technology Stack

- **Backend**: Spring Boot (Java 17)
- **Frontend**: Angular 17
- **Database**: MySQL 8.0
- **Email**: MailDev (SMTP)
- **Containerization**: Docker & Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Ports 3306, 4200, 8080, 1025, 1080 available

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Start all services:

```bash
docker-compose up --build
```

### Access Points

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **MailDev Interface**: http://localhost:1080
- **MySQL**: localhost:3306

### Default Accounts

Create a super admin account by registering and manually updating the database:

```sql
UPDATE users SET role = 'SUPER_ADMIN' WHERE email = 'your-email@example.com';
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Applications
- `GET /api/applications/my` - Get user applications
- `POST /api/applications/submit` - Submit application
- `GET /api/applications/search` - Search applications (Admin)
- `PUT /api/applications/{id}/status` - Update status (Admin)

### Announcements
- `GET /api/announcements/active` - Get active announcements
- `POST /api/announcements` - Create announcement (Admin)
- `PUT /api/announcements/{id}/toggle` - Toggle status (Admin)

### Academic Years
- `GET /api/academic-years` - Get all years
- `POST /api/academic-years` - Create year (Admin)
- `PUT /api/academic-years/{id}/toggle` - Toggle status (Admin)

## File Upload Constraints

- Maximum file size: 10MB
- Supported formats: PDF only
- Required documents: CV, Degree Certificate, Cover Letter

## Security Features

- JWT-based authentication
- Role-based access control (CANDIDATE, ADMIN, SUPER_ADMIN)
- Secure password hashing with BCrypt
- File upload validation
- CORS configuration

## Development

### Backend Development
```bash
cd backend
mvn spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## Production Deployment

1. Update environment variables in docker-compose.yml
2. Configure proper SMTP settings
3. Set up SSL/TLS certificates
4. Configure reverse proxy (nginx)
5. Set up database backups

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3306, 4200, 8080, 1025, 1080 are available
2. **Database connection**: Wait for MySQL to fully initialize before starting backend
3. **File uploads**: Check upload directory permissions and disk space

### Logs
```bash
docker-compose logs [service-name]
```

## License

This project is licensed under the MIT License.