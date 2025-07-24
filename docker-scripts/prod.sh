#!/bin/bash

# Production Docker Script for MERN Blog Platform
# Usage: ./docker-scripts/prod.sh [command]

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

# Function to check environment file
check_env() {
    if [ ! -f .env.prod ]; then
        print_error "Production environment file (.env.prod) not found!"
        print_status "Please copy env.prod.example to .env.prod and configure it properly."
        exit 1
    fi
}

# Function to check SSL certificates
check_ssl() {
    if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
        print_warning "SSL certificates not found in ssl/ directory."
        print_status "Please add your SSL certificates:"
        echo "  - ssl/cert.pem (SSL certificate)"
        echo "  - ssl/key.pem (SSL private key)"
        print_status "Or update nginx.prod.conf to use HTTP only."
    fi
}

# Function to deploy production environment
deploy() {
    print_status "Deploying production environment..."
    
    # Check prerequisites
    check_docker
    check_docker_compose
    check_env
    check_ssl
    
    # Build and start services
    docker-compose -f docker-compose.prod.yml up -d --build
    
    print_success "Production environment deployed!"
    print_status "Services available at:"
    echo "  - Application: https://localhost (or your domain)"
    echo "  - Prometheus: http://localhost:9090"
    echo "  - Grafana: http://localhost:3001 (admin/your-grafana-password)"
}

# Function to stop production environment
stop_prod() {
    print_status "Stopping production environment..."
    docker-compose -f docker-compose.prod.yml down
    print_success "Production environment stopped!"
}

# Function to restart production environment
restart_prod() {
    print_status "Restarting production environment..."
    stop_prod
    deploy
}

# Function to view logs
logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Showing logs for all services..."
        docker-compose -f docker-compose.prod.yml logs -f
    else
        print_status "Showing logs for $service..."
        docker-compose -f docker-compose.prod.yml logs -f "$service"
    fi
}

# Function to scale services
scale() {
    local service=$1
    local replicas=$2
    
    if [ -z "$service" ] || [ -z "$replicas" ]; then
        print_error "Please specify service and number of replicas"
        echo "Usage: $0 scale <service> <replicas>"
        exit 1
    fi
    
    print_status "Scaling $service to $replicas replicas..."
    docker-compose -f docker-compose.prod.yml up -d --scale "$service=$replicas"
    print_success "Service $service scaled to $replicas replicas!"
}

# Function to backup database
backup() {
    local backup_dir=${1:-"./backups"}
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="$backup_dir/mongodb_backup_$timestamp.gz"
    
    print_status "Creating database backup..."
    
    # Create backup directory if it doesn't exist
    mkdir -p "$backup_dir"
    
    # Create backup
    docker-compose -f docker-compose.prod.yml exec -T mongodb mongodump \
        --username="$MONGO_ROOT_USERNAME" \
        --password="$MONGO_ROOT_PASSWORD" \
        --authenticationDatabase=admin \
        --db="$MONGO_DATABASE" \
        --archive | gzip > "$backup_file"
    
    print_success "Database backup created: $backup_file"
}

# Function to restore database
restore() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        print_error "Please specify backup file to restore"
        echo "Usage: $0 restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_warning "This will overwrite the current database. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Restoring database from backup..."
        
        gunzip -c "$backup_file" | docker-compose -f docker-compose.prod.yml exec -T mongodb mongorestore \
            --username="$MONGO_ROOT_USERNAME" \
            --password="$MONGO_ROOT_PASSWORD" \
            --authenticationDatabase=admin \
            --archive
        
        print_success "Database restored from backup!"
    else
        print_status "Database restore cancelled."
    fi
}

# Function to monitor services
monitor() {
    print_status "Production environment monitoring:"
    echo ""
    
    # Service status
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    
    # Resource usage
    print_status "Resource usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    echo ""
    
    # Health checks
    print_status "Health checks:"
    docker-compose -f docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
}

# Function to update application
update() {
    print_status "Updating production application..."
    
    # Pull latest changes
    git pull origin main
    
    # Rebuild and restart services
    docker-compose -f docker-compose.prod.yml up -d --build
    
    print_success "Application updated successfully!"
}

# Function to rollback
rollback() {
    local commit_hash=$1
    
    if [ -z "$commit_hash" ]; then
        print_error "Please specify commit hash to rollback to"
        echo "Usage: $0 rollback <commit_hash>"
        exit 1
    fi
    
    print_warning "This will rollback to commit $commit_hash. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Rolling back to commit $commit_hash..."
        
        # Checkout specific commit
        git checkout "$commit_hash"
        
        # Rebuild and restart services
        docker-compose -f docker-compose.prod.yml up -d --build
        
        print_success "Application rolled back to commit $commit_hash!"
    else
        print_status "Rollback cancelled."
    fi
}

# Function to show help
show_help() {
    echo "Production Docker Script for MERN Blog Platform"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  deploy     Deploy production environment"
    echo "  stop       Stop production environment"
    echo "  restart    Restart production environment"
    echo "  logs       Show logs (all services or specific service)"
    echo "  scale      Scale service to specified number of replicas"
    echo "  backup     Create database backup"
    echo "  restore    Restore database from backup"
    echo "  monitor    Show monitoring information"
    echo "  update     Update application to latest version"
    echo "  rollback   Rollback to specific commit"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy                    # Deploy production environment"
    echo "  $0 logs                      # Show all logs"
    echo "  $0 logs backend              # Show backend logs"
    echo "  $0 scale backend 3           # Scale backend to 3 replicas"
    echo "  $0 backup                    # Create database backup"
    echo "  $0 restore backup_file.gz    # Restore database"
    echo "  $0 rollback abc123           # Rollback to commit abc123"
}

# Main script logic
main() {
    # Check prerequisites
    check_docker
    check_docker_compose
    
    # Parse command
    case "${1:-help}" in
        deploy)
            deploy
            ;;
        stop)
            stop_prod
            ;;
        restart)
            restart_prod
            ;;
        logs)
            logs "$2"
            ;;
        scale)
            scale "$2" "$3"
            ;;
        backup)
            backup "$2"
            ;;
        restore)
            restore "$2"
            ;;
        monitor)
            monitor
            ;;
        update)
            update
            ;;
        rollback)
            rollback "$2"
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