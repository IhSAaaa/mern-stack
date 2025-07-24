#!/bin/bash

# Monitoring Services Startup Script
# Optional monitoring with Prometheus and Grafana

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

# Check if main services are running
if ! docker-compose ps | grep -q "Up"; then
    print_error "Main services are not running. Please start them first with ./start.sh"
    exit 1
fi

# Start monitoring services
print_status "Starting monitoring services..."
docker-compose --profile monitoring up -d prometheus grafana

# Wait for services to be ready
print_status "Waiting for monitoring services to be ready..."
sleep 10

# Check service status
print_status "Checking monitoring service status..."
docker-compose --profile monitoring ps prometheus grafana

# Show access information
print_success "📊 Monitoring services started successfully!"
echo ""
echo "🔍 Monitoring Tools:"
echo "  • Prometheus: http://localhost:9090"
echo "  • Grafana: http://localhost:3002 (admin/admin123)"
echo ""
echo "📝 Useful Commands:"
echo "  • View Prometheus logs: docker-compose logs -f prometheus"
echo "  • View Grafana logs: docker-compose logs -f grafana"
echo "  • Stop monitoring: docker-compose --profile monitoring down"
echo ""
print_success "Monitoring is ready! 🎉" 