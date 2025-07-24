#!/bin/bash

# Production-Ready Development Startup Script
# Simple and clean startup for MERN Stack Blog Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from example..."
    cp env.example .env
    print_success "Created .env file from env.example"
    print_warning "Please review and modify .env file if needed"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Clean up any existing containers
print_status "Cleaning up existing containers..."
docker-compose down 2>/dev/null || true

# Build and start services
print_status "Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 20

# Check service status
print_status "Checking service status..."
docker-compose ps

# Show access information
print_success "🚀 Services started successfully!"
echo ""
echo "📱 Access your application:"
echo "  • Frontend: http://localhost:3001"
echo "  • Backend API: http://localhost:5000"
echo "  • Nginx Proxy: http://localhost:80"
echo ""
echo "🔧 Development Tools:"
echo "  • MongoDB Express: http://localhost:8081 (admin/admin123)"
echo "  • Redis CLI: docker exec -it blog-redis redis-cli -a redis-dev-password"
echo ""
echo "📊 Monitoring (optional):"
echo "  • Prometheus: http://localhost:9090"
echo "  • Grafana: http://localhost:3002 (admin/admin123)"
echo ""
echo "📝 Useful Commands:"
echo "  • View logs: docker-compose logs -f [service]"
echo "  • Stop services: docker-compose down"
echo "  • Restart services: docker-compose restart"
echo "  • Rebuild: docker-compose up -d --build"
echo ""
print_success "Happy coding! 🎉" 