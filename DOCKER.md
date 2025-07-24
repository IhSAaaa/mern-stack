# 🐳 **Docker Setup & Deployment Guide**

Comprehensive Docker setup for the MERN Stack Blog Platform with development and production configurations.

## 📋 **Table of Contents**

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Environment](#development-environment)
- [Production Environment](#production-environment)
- [Services Overview](#services-overview)
- [Configuration](#configuration)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Advanced Usage](#advanced-usage)

## 🔧 **Prerequisites**

### Required Software
- **Docker**: Version 20.10+ [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: Version 2.0+ [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git**: For version control

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 10GB free space
- **CPU**: 2 cores minimum (4 cores recommended)

## 🚀 **Quick Start**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mern-blog-platform.git
cd mern-blog-platform
```

### 2. Setup Environment Files
```bash
# Development
cp env.dev.example .env.dev
# Edit .env.dev with your configuration

# Production
cp env.prod.example .env.prod
# Edit .env.prod with your configuration
```

### 3. Start Development Environment
```bash
# Make scripts executable
chmod +x docker-scripts/*.sh

# Start development environment
./docker-scripts/dev.sh start
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Nginx Proxy**: http://localhost:80
- **MongoDB Express**: http://localhost:8081 (admin/admin123)

## 🛠️ **Development Environment**

### Features
- ✅ Hot reload for both frontend and backend
- ✅ Volume mounting for live code changes
- ✅ Debug ports exposed
- ✅ Development-friendly configurations
- ✅ MongoDB Express admin interface
- ✅ Redis for caching

### Commands

```bash
# Start development environment
./docker-scripts/dev.sh start

# Stop development environment
./docker-scripts/dev.sh stop

# Restart development environment
./docker-scripts/dev.sh restart

# View logs
./docker-scripts/dev.sh logs
./docker-scripts/dev.sh logs backend
./docker-scripts/dev.sh logs frontend

# Execute commands in containers
./docker-scripts/dev.sh exec backend npm test
./docker-scripts/dev.sh exec frontend npm install

# Check status
./docker-scripts/dev.sh status

# Clean up everything
./docker-scripts/dev.sh cleanup
```

### Development Workflow

1. **Start the environment**:
   ```bash
   ./docker-scripts/dev.sh start
   ```

2. **Make code changes** - Changes are automatically reflected due to volume mounting

3. **View logs**:
   ```bash
   ./docker-scripts/dev.sh logs backend
   ```

4. **Run tests**:
   ```bash
   ./docker-scripts/dev.sh exec backend npm test
   ```

5. **Stop when done**:
   ```bash
   ./docker-scripts/dev.sh stop
   ```

## 🚀 **Production Environment**

### Features
- ✅ Multi-stage builds for optimized images
- ✅ Load balancing with multiple replicas
- ✅ SSL/TLS encryption
- ✅ Production-grade security
- ✅ Monitoring with Prometheus & Grafana
- ✅ Database backup/restore
- ✅ Auto-scaling capabilities

### Deployment

```bash
# Deploy production environment
./docker-scripts/prod.sh deploy

# Stop production environment
./docker-scripts/prod.sh stop

# Restart production environment
./docker-scripts/prod.sh restart

# Scale services
./docker-scripts/prod.sh scale backend 3
./docker-scripts/prod.sh scale frontend 2

# Monitor services
./docker-scripts/prod.sh monitor

# Backup database
./docker-scripts/prod.sh backup

# Restore database
./docker-scripts/prod.sh restore backup_file.gz

# Update application
./docker-scripts/prod.sh update

# Rollback to specific commit
./docker-scripts/prod.sh rollback abc123
```

### SSL Configuration

1. **Generate SSL certificates** (for development):
   ```bash
   mkdir -p ssl
   openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
     -keyout ssl/key.pem -out ssl/cert.pem
   ```

2. **For production**, use Let's Encrypt or your preferred SSL provider:
   ```bash
   # Copy your certificates to ssl/ directory
   cp your-cert.pem ssl/cert.pem
   cp your-key.pem ssl/key.pem
   ```

## 🏗️ **Services Overview**

### Core Services

| Service | Port | Description | Health Check |
|---------|------|-------------|--------------|
| **Frontend** | 3000 | React application | http://localhost:3000 |
| **Backend** | 5000 | Node.js API | http://localhost:5000/api/health |
| **MongoDB** | 27017 | Database | mongosh ping |
| **Redis** | 6379 | Cache | redis-cli ping |
| **Nginx** | 80/443 | Reverse proxy | http://localhost/health |

### Development Services

| Service | Port | Description | Credentials |
|---------|------|-------------|-------------|
| **MongoDB Express** | 8081 | Database admin UI | admin/admin123 |

### Production Services

| Service | Port | Description | Credentials |
|---------|------|-------------|-------------|
| **Prometheus** | 9090 | Metrics collection | - |
| **Grafana** | 3001 | Monitoring dashboard | admin/your-password |

## ⚙️ **Configuration**

### Environment Variables

#### Development (.env.dev)
```bash
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=blog_platform

# Backend
NODE_ENV=development
JWT_SECRET=your-dev-secret
CORS_ORIGIN=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

#### Production (.env.prod)
```bash
# MongoDB
MONGO_ROOT_USERNAME=your-username
MONGO_ROOT_PASSWORD=your-strong-password
MONGO_DATABASE=blog_platform_prod

# Backend
NODE_ENV=production
JWT_SECRET=your-production-secret
CORS_ORIGIN=https://yourdomain.com

# Frontend
REACT_APP_API_URL=https://yourdomain.com/api
```

### Docker Compose Files

- **docker-compose.dev.yml**: Development environment
- **docker-compose.prod.yml**: Production environment

### Nginx Configurations

- **nginx.dev.conf**: Development proxy with hot reload
- **nginx.prod.conf**: Production proxy with SSL and caching

## 📊 **Monitoring**

### Prometheus Metrics

Access Prometheus at http://localhost:9090 to view:
- Container metrics
- Application performance
- Resource usage
- Custom business metrics

### Grafana Dashboards

Access Grafana at http://localhost:3001 to view:
- System overview dashboard
- Application performance dashboard
- Database metrics dashboard
- Custom dashboards

### Health Checks

All services include health checks:
```bash
# Check service health
docker-compose -f docker-compose.prod.yml ps

# View health check logs
docker-compose -f docker-compose.prod.yml logs | grep health
```

## 🔍 **Troubleshooting**

### Common Issues

#### 1. Port Conflicts
```bash
# Check what's using a port
sudo lsof -i :3000

# Kill process using port
sudo kill -9 <PID>
```

#### 2. Permission Issues
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
# Logout and login again
```

#### 3. Container Won't Start
```bash
# Check container logs
docker-compose -f docker-compose.dev.yml logs <service>

# Check container status
docker-compose -f docker-compose.dev.yml ps

# Restart specific service
docker-compose -f docker-compose.dev.yml restart <service>
```

#### 4. Database Connection Issues
```bash
# Check MongoDB status
docker-compose -f docker-compose.dev.yml exec mongodb mongosh --eval "db.adminCommand('ping')"

# Check MongoDB logs
docker-compose -f docker-compose.dev.yml logs mongodb
```

#### 5. Memory Issues
```bash
# Check Docker resource usage
docker stats

# Clean up Docker system
docker system prune -f
```

### Debug Mode

Enable debug mode for more verbose logging:
```bash
# Set debug environment variable
export DEBUG=true

# Restart services
./docker-scripts/dev.sh restart
```

### Performance Issues

1. **Increase Docker resources**:
   - Docker Desktop → Settings → Resources
   - Increase CPU, Memory, and Disk space

2. **Optimize volume mounts**:
   ```yaml
   volumes:
     - ./server:/app
     - /app/node_modules  # Exclude node_modules
   ```

3. **Use .dockerignore**:
   ```dockerfile
   node_modules
   npm-debug.log
   .git
   .env
   ```

## 🚀 **Advanced Usage**

### Custom Builds

```bash
# Build specific service
docker-compose -f docker-compose.dev.yml build backend

# Build with no cache
docker-compose -f docker-compose.dev.yml build --no-cache

# Build specific target
docker build --target development -t blog-backend:dev ./server
```

### Multi-Environment Deployment

```bash
# Staging environment
docker-compose -f docker-compose.staging.yml up -d

# Production with specific config
docker-compose -f docker-compose.prod.yml -f docker-compose.override.yml up -d
```

### Database Management

```bash
# Create database backup
./docker-scripts/prod.sh backup

# Restore from backup
./docker-scripts/prod.sh restore backups/mongodb_backup_20240101_120000.gz

# Access MongoDB shell
docker-compose -f docker-compose.dev.yml exec mongodb mongosh
```

### Scaling Services

```bash
# Scale backend to 3 replicas
./docker-scripts/prod.sh scale backend 3

# Scale frontend to 2 replicas
./docker-scripts/prod.sh scale frontend 2

# Check scaling status
docker-compose -f docker-compose.prod.yml ps
```

### Log Management

```bash
# View real-time logs
docker-compose -f docker-compose.dev.yml logs -f

# View logs for specific service
docker-compose -f docker-compose.dev.yml logs -f backend

# View logs with timestamps
docker-compose -f docker-compose.dev.yml logs -f -t

# Export logs to file
docker-compose -f docker-compose.dev.yml logs > logs.txt
```

## 📚 **Best Practices**

### Security
- ✅ Use strong passwords in production
- ✅ Keep Docker images updated
- ✅ Use non-root users in containers
- ✅ Implement proper SSL/TLS
- ✅ Regular security updates

### Performance
- ✅ Use multi-stage builds
- ✅ Optimize Dockerfile layers
- ✅ Use .dockerignore files
- ✅ Implement proper caching
- ✅ Monitor resource usage

### Development
- ✅ Use volume mounts for live reload
- ✅ Implement health checks
- ✅ Use environment-specific configs
- ✅ Regular backups
- ✅ Proper logging

## 🤝 **Support**

For issues and questions:
- 📧 Email: support@blogplatform.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/mern-blog-platform/issues)
- 📖 Documentation: [Project Wiki](https://github.com/yourusername/mern-blog-platform/wiki)

---

**Happy Dockerizing! 🐳** 