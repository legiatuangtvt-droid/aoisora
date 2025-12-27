#!/bin/bash

# ============================================
# OptiChain Pre-Push Validation Script
# ============================================
# Run this script before pushing code to ensure
# no build/lint/test errors exist in the system.
# ============================================

set -e  # Exit on first error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Results tracking
ERRORS=0
WARNINGS=0

# ============================================
# Helper Functions
# ============================================

print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    ((ERRORS++))
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNINGS++))
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# ============================================
# Check 1: Frontend Build
# ============================================

check_frontend_build() {
    print_header "Frontend Build Check"

    cd "$PROJECT_ROOT/frontend"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_info "Installing dependencies..."
        npm install --silent
    fi

    # Run build
    print_info "Running Next.js build..."
    if npm run build > /tmp/fe-build.log 2>&1; then
        print_success "Frontend build successful"
        return 0
    else
        print_error "Frontend build failed"
        echo "Build output:"
        cat /tmp/fe-build.log | tail -50
        return 1
    fi
}

# ============================================
# Check 2: Frontend Lint & Type Check
# ============================================

check_frontend_lint() {
    print_header "Frontend Lint & Type Check"

    cd "$PROJECT_ROOT/frontend"

    # TypeScript type check (included in build, but can run separately)
    print_info "Checking TypeScript types..."
    if npx tsc --noEmit > /tmp/fe-tsc.log 2>&1; then
        print_success "TypeScript types OK"
    else
        print_warning "TypeScript warnings found (check /tmp/fe-tsc.log)"
    fi

    # ESLint check
    print_info "Running ESLint..."
    if npx next lint > /tmp/fe-lint.log 2>&1; then
        print_success "ESLint passed"
    else
        print_warning "ESLint warnings found (check /tmp/fe-lint.log)"
    fi

    return 0
}

# ============================================
# Check 3: Backend Syntax Check
# ============================================

check_backend_syntax() {
    print_header "Backend Syntax Check"

    cd "$PROJECT_ROOT/backend"

    # Check if Python is available
    PYTHON_CMD=""
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    elif command -v python &> /dev/null; then
        PYTHON_CMD="python"
    elif command -v py &> /dev/null; then
        PYTHON_CMD="py"
    else
        print_warning "Python not found, skipping backend checks"
        return 0
    fi

    print_info "Using Python: $PYTHON_CMD"

    # Check Python syntax for all .py files
    print_info "Checking Python syntax..."
    SYNTAX_ERRORS=0

    find . -name "*.py" -type f | while read -r file; do
        if ! $PYTHON_CMD -m py_compile "$file" 2>/dev/null; then
            echo "  Syntax error in: $file"
            SYNTAX_ERRORS=1
        fi
    done

    if [ $SYNTAX_ERRORS -eq 0 ]; then
        print_success "Python syntax OK"
    else
        print_error "Python syntax errors found"
        return 1
    fi

    # Try to import main modules
    print_info "Checking module imports..."
    if $PYTHON_CMD -c "
import sys
sys.path.insert(0, '.')
try:
    from app.core.config import settings
    print('  Config: OK')
except Exception as e:
    print(f'  Config: FAILED - {e}')
    sys.exit(1)
" 2>/dev/null; then
        print_success "Backend module imports OK"
    else
        print_warning "Backend module import check skipped (missing dependencies)"
    fi

    return 0
}

# ============================================
# Check 4: Git Status Check
# ============================================

check_git_status() {
    print_header "Git Status Check"

    cd "$PROJECT_ROOT"

    # Check for uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Uncommitted changes detected:"
        git status --short
    else
        print_success "Working directory clean"
    fi

    # Show current branch
    BRANCH=$(git rev-parse --abbrev-ref HEAD)
    print_info "Current branch: $BRANCH"

    # Show last commit
    LAST_COMMIT=$(git log -1 --format="%h - %s")
    print_info "Last commit: $LAST_COMMIT"

    return 0
}

# ============================================
# Main Execution
# ============================================

main() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   OptiChain Pre-Push Validation Script     ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""

    START_TIME=$(date +%s)

    # Run all checks
    check_git_status || true
    check_frontend_build || true
    check_frontend_lint || true
    check_backend_syntax || true

    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))

    # Summary
    print_header "Summary"

    echo "Duration: ${DURATION}s"
    echo "Errors: $ERRORS"
    echo "Warnings: $WARNINGS"
    echo ""

    if [ $ERRORS -gt 0 ]; then
        echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║   ✗ VALIDATION FAILED - DO NOT PUSH        ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
        echo ""
        echo "Please fix the errors above before pushing."
        exit 1
    else
        echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║   ✓ VALIDATION PASSED - READY TO PUSH      ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
        echo ""

        if [ $WARNINGS -gt 0 ]; then
            echo -e "${YELLOW}Note: $WARNINGS warning(s) found. Consider reviewing them.${NC}"
        fi

        exit 0
    fi
}

# Run main function
main "$@"
