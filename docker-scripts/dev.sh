#!/bin/bash

# Development Docker Script for MERN Blog Platform
# Usage: ./docker-scripts/dev.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install it and try again."
        exit 1
    fi
}

# Function to create environment file if it doesn't exist
setup_env() {
    if [ ! -f .env.dev ]; then
        print_status "Creating development environment file..."
        cp env.dev.example .env.dev
        print_success "Development environment file created. Please review and edit .env.dev if needed."
    fi
    
    # Generate SSL certificates if they don't exist
    if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
        print_status "Generating SSL certificates..."
        if [ -f scripts/generate-ssl.sh ]; then
            ./scripts/generate-ssl.sh development
        else
            print_warning "SSL generation script not found. Creating basic certificates..."
            mkdir -p ssl
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout ssl/key.pem -out ssl/cert.pem \
                -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
            chmod 600 ssl/key.pem
            chmod 644 ssl/cert.pem
        fi
    fi
}

# Function to start development environment
start_dev() {
    print_status "Starting development environment..."
    
    # Check if Docker daemon is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Pull images first to avoid credential issues
    print_status "Pulling Docker images..."
    docker-compose -f docker-compose.dev.yml pull --ignore-pull-failures
    
    # Build and start services
    print_status "Building and starting services..."
    if docker-compose -f docker-compose.dev.yml up -d --build; then
        print_success "Development environment started!"
        print_status "Services available at:"
        echo "  - Frontend: http://localhost:3000"
        echo "  - Backend API: http://localhost:5000"
        echo "  - Nginx Proxy: http://localhost:80"
        echo "  - MongoDB Express: http://localhost:8081 (admin/admin123)"
        echo "  - Redis: localhost:16379"
        
        # Wait for services to be ready
        print_status "Waiting for services to be ready..."
        sleep 10
        
        # Check service status
        print_status "Service status:"
        docker-compose -f docker-compose.dev.yml ps
    else
        print_error "Failed to start development environment. Check the logs above for details."
        exit 1
    fi
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping development environment..."
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped!"
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting development environment..."
    stop_dev
    start_dev
}

# Function to view logs
logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Showing logs for all services..."
        docker-compose -f docker-compose.dev.yml logs -f
    else
        print_status "Showing logs for $service..."
        docker-compose -f docker-compose.dev.yml logs -f "$service"
    fi
}

# Function to execute command in container
exec_container() {
    local service=$1
    local command=${2:-"/bin/bash"}
    
    if [ -z "$service" ]; then
        print_error "Please specify a service name"
        echo "Usage: $0 exec <service> [command]"
        exit 1
    fi
    
    print_status "Executing command in $service container..."
    docker-compose -f docker-compose.dev.yml exec "$service" $command
}

# Function to clean up
cleanup() {
    print_warning "This will remove all containers, volumes, and images. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning up Docker environment..."
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Function to show status
status() {
    print_status "Development environment status:"
    docker-compose -f docker-compose.dev.yml ps
}

# Function to show help
show_help() {
    echo "Development Docker Script for MERN Blog Platform"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start     Start development environment"
    echo "  stop      Stop development environment"
    echo "  restart   Restart development environment"
    echo "  logs      Show logs (all services or specific service)"
    echo "  exec      Execute command in container"
    echo "  status    Show status of services"
    echo "  cleanup   Remove all containers, volumes, and images"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start                    # Start all services"
    echo "  $0 logs                     # Show all logs"
    echo "  $0 logs backend             # Show backend logs"
    echo "  $0 exec backend npm test    # Run tests in backend"
    echo "  $0 exec frontend npm install # Install packages in frontend"
}

# Main script logic
main() {
    # Check prerequisites
    check_docker
    check_docker_compose
    
    # Setup environment
    setup_env
    
    # Parse command
    case "${1:-help}" in
        start)
            start_dev
            ;;
        stop)
            stop_dev
            ;;
        restart)
            restart_dev
            ;;
        logs)
            logs "$2"
            ;;
        exec)
            exec_container "$2" "$3"
            ;;
        status)
            status
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 