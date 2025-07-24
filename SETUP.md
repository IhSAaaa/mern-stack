# 🚀 **Quick Setup Guide - Production-Ready Development**

## **One-Command Setup**

```bash
# Clone the repository
git clone <your-repo-url>
cd mern-stack

# Start everything with one command
./start.sh
```

That's it! Your application will be available at:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Nginx Proxy**: http://localhost:80
- **MongoDB Express**: http://localhost:8081 (admin/admin123)

## **What's Included**

### **Core Services**
- ✅ **MongoDB** - Database with authentication
- ✅ **Redis** - Caching layer
- ✅ **Backend** - Node.js API with Express
- ✅ **Frontend** - React development server
- ✅ **Nginx** - Reverse proxy with security headers

### **Development Tools**
- ✅ **MongoDB Express** - Database admin interface
- ✅ **Hot Reload** - Live code changes
- ✅ **Debug Ports** - Node.js debugging
- ✅ **Volume Mounting** - Persistent development

### **Production Features**
- ✅ **Security Headers** - XSS protection, CSRF, etc.
- ✅ **Rate Limiting** - API protection
- ✅ **Health Checks** - Service monitoring
- ✅ **Resource Limits** - Memory/CPU management
- ✅ **Logging** - Structured logging
- ✅ **Monitoring** - Optional Prometheus/Grafana

## **Optional Monitoring**

```bash
# Start monitoring services
./monitoring.sh

# Access monitoring tools
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin123)
```

## **Management Commands**

```bash
# View service status
./cleanup.sh status

# View logs
./cleanup.sh logs

# Restart services
./cleanup.sh restart

# Stop services
./cleanup.sh stop

# Clean containers
./cleanup.sh clean

# Reset everything (WARNING: Data loss)
./cleanup.sh reset
```

## **Environment Configuration**

The setup uses a single `.env` file with sensible defaults:

```bash
# Copy and customize if needed
cp env.example .env
# Edit .env with your configuration
```

## **Key Features**

### **Production-Ready Security**
- Local-only port binding (127.0.0.1)
- Security headers and CORS configuration
- Rate limiting and input validation
- JWT authentication with secure defaults

### **Development-Friendly**
- Hot reload for both frontend and backend
- Volume mounting for live code changes
- Debug ports exposed
- MongoDB Express for database management

### **Scalable Architecture**
- Microservices design
- Health checks for all services
- Resource limits and monitoring
- Easy scaling with Docker Compose

## **Troubleshooting**

### **Port Conflicts**
If ports are already in use:
```bash
# Check what's using the ports
sudo lsof -i :3000
sudo lsof -i :5000
sudo lsof -i :80

# Stop conflicting services or modify ports in .env
```

### **Memory Issues**
If you're running low on memory:
```bash
# Check Docker resource usage
docker stats

# Clean up unused resources
./cleanup.sh prune
```

### **Database Issues**
```bash
# Access MongoDB directly
docker-compose exec mongodb mongosh

# Reset database (WARNING: Data loss)
./cleanup.sh reset
```

## **Next Steps**

1. **Customize Configuration**: Edit `.env` file for your needs
2. **Add Your Code**: Start developing in `client/` and `server/` directories
3. **Add Tests**: Implement testing in your components and API
4. **Deploy**: Use the same Docker Compose for production deployment

## **Support**

- Check logs: `./cleanup.sh logs`
- View status: `./cleanup.sh status`
- Reset environment: `./cleanup.sh reset`

---

**Happy coding! 🎉** 