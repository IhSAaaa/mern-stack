#!/bin/bash

# Cleanup Script for MERN Stack Development Environment
# Manages containers, volumes, and cleanup operations

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

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  stop          Stop all services"
    echo "  restart       Restart all services"
    echo "  logs          Show logs for all services"
    echo "  clean         Stop and remove containers"
    echo "  reset         Stop, remove containers and volumes (WARNING: Data loss)"
    echo "  prune         Remove unused Docker resources"
    echo "  status        Show status of all services"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 stop       # Stop all services"
    echo "  $0 restart    # Restart all services"
    echo "  $0 clean      # Clean containers"
    echo "  $0 reset      # Reset everything (WARNING: Data loss)"
}

# Function to stop services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "All services stopped"
}

# Function to restart services
restart_services() {
    print_status "Restarting all services..."
    docker-compose down
    docker-compose up -d --build
    print_success "All services restarted"
}

# Function to show logs
show_logs() {
    print_status "Showing logs for all services..."
    docker-compose logs -f
}

# Function to clean containers
clean_containers() {
    print_status "Stopping and removing containers..."
    docker-compose down
    print_success "Containers cleaned"
}

# Function to reset everything
reset_everything() {
    print_warning "WARNING: This will remove ALL containers, volumes, and data!"
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Resetting everything..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Everything reset. All data has been removed."
    else
        print_status "Reset cancelled"
    fi
}

# Function to prune Docker resources
prune_resources() {
    print_status "Removing unused Docker resources..."
    docker system prune -f
    print_success "Unused resources removed"
}

# Function to show status
show_status() {
    print_status "Service status:"
    docker-compose ps
    echo ""
    print_status "Resource usage:"
    docker stats --no-stream
}

# Main script logic
case "${1:-help}" in
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    clean)
        clean_containers
        ;;
    reset)
        reset_everything
        ;;
    prune)
        prune_resources
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown option: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac 