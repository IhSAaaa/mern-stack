#!/bin/bash

# SSL Certificate Generation Script
# Usage: ./scripts/generate-ssl.sh [development|production]

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

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to generate development SSL certificates
generate_dev_certs() {
    print_status "Generating development SSL certificates..."
    
    # Create ssl directory
    mkdir -p ssl
    
    # Generate self-signed certificate
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
    
    # Set proper permissions
    chmod 600 ssl/key.pem
    chmod 644 ssl/cert.pem
    
    print_success "Development SSL certificates generated successfully!"
    print_status "Files created:"
    echo "  - ssl/cert.pem (Certificate)"
    echo "  - ssl/key.pem (Private Key)"
}

# Function to generate production SSL certificates
generate_prod_certs() {
    print_status "Generating production SSL certificates..."
    
    print_warning "For production, it's recommended to use Let's Encrypt or a trusted CA."
    print_status "This will generate a self-signed certificate for testing purposes only."
    
    # Create ssl directory
    mkdir -p ssl
    
    # Generate self-signed certificate with proper SAN
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=yourdomain.com" \
        -addext "subjectAltName=DNS:yourdomain.com,DNS:www.yourdomain.com"
    
    # Set proper permissions
    chmod 600 ssl/key.pem
    chmod 644 ssl/cert.pem
    
    print_success "Production SSL certificates generated successfully!"
    print_warning "Remember to replace with proper certificates from a trusted CA for production use."
}

# Function to show help
show_help() {
    echo "SSL Certificate Generation Script"
    echo ""
    echo "Usage: $0 [development|production]"
    echo ""
    echo "Commands:"
    echo "  development  Generate development SSL certificates"
    echo "  production   Generate production SSL certificates"
    echo "  help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 development   # Generate dev certificates"
    echo "  $0 production    # Generate prod certificates"
}

# Main script logic
main() {
    case "${1:-help}" in
        development|dev)
            generate_dev_certs
            ;;
        production|prod)
            generate_prod_certs
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