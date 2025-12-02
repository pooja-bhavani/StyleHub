#!/usr/bin/env bash
#
# Validation script for all CKA Module 1 files
# Validates YAML, shell scripts, and Markdown files
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔍 CKA Module 1 - File Validation"
echo "=================================="
echo ""

# Track validation results
YAML_ERRORS=0
SHELL_ERRORS=0
MARKDOWN_ERRORS=0

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Validate YAML files
validate_yaml() {
    echo "📄 Validating YAML files..."
    
    if ! command_exists yamllint; then
        echo -e "${YELLOW}⚠️  yamllint not installed. Install with: pip install yamllint${NC}"
        echo "   Skipping YAML validation"
        echo ""
        return 0
    fi
    
    local yaml_files
    yaml_files=$(find "$PROJECT_ROOT/configs" -name "*.yaml" -o -name "*.yml" 2>/dev/null || true)
    
    if [ -z "$yaml_files" ]; then
        echo "   No YAML files found to validate"
        echo ""
        return 0
    fi
    
    local error_count=0
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            if yamllint -c "$PROJECT_ROOT/.yamllint" "$file" >/dev/null 2>&1; then
                echo -e "   ${GREEN}✓${NC} $(basename "$file")"
            else
                echo -e "   ${RED}✗${NC} $(basename "$file")"
                yamllint -c "$PROJECT_ROOT/.yamllint" "$file" 2>&1 | sed 's/^/     /'
                ((error_count++))
            fi
        fi
    done <<< "$yaml_files"
    
    if [ $error_count -eq 0 ]; then
        echo -e "${GREEN}✓ All YAML files valid${NC}"
    else
        echo -e "${RED}✗ $error_count YAML file(s) have errors${NC}"
        YAML_ERRORS=$error_count
    fi
    echo ""
}

# Validate shell scripts
validate_shell() {
    echo "🐚 Validating shell scripts..."
    
    if ! command_exists shellcheck; then
        echo -e "${YELLOW}⚠️  shellcheck not installed. Install with: brew install shellcheck (macOS)${NC}"
        echo "   Skipping shell script validation"
        echo ""
        return 0
    fi
    
    local shell_files
    shell_files=$(find "$PROJECT_ROOT/scripts" -name "*.sh" 2>/dev/null || true)
    
    if [ -z "$shell_files" ]; then
        echo "   No shell scripts found to validate"
        echo ""
        return 0
    fi
    
    local error_count=0
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            if shellcheck "$file" >/dev/null 2>&1; then
                echo -e "   ${GREEN}✓${NC} $(basename "$file")"
            else
                echo -e "   ${RED}✗${NC} $(basename "$file")"
                shellcheck "$file" 2>&1 | sed 's/^/     /'
                ((error_count++))
            fi
        fi
    done <<< "$shell_files"
    
    if [ $error_count -eq 0 ]; then
        echo -e "${GREEN}✓ All shell scripts valid${NC}"
    else
        echo -e "${RED}✗ $error_count shell script(s) have errors${NC}"
        SHELL_ERRORS=$error_count
    fi
    echo ""
}

# Validate Markdown files
validate_markdown() {
    echo "📝 Validating Markdown files..."
    
    if ! command_exists markdownlint; then
        echo -e "${YELLOW}⚠️  markdownlint not installed. Install with: npm install -g markdownlint-cli${NC}"
        echo "   Skipping Markdown validation"
        echo ""
        return 0
    fi
    
    local md_files
    md_files=$(find "$PROJECT_ROOT" -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null || true)
    
    if [ -z "$md_files" ]; then
        echo "   No Markdown files found to validate"
        echo ""
        return 0
    fi
    
    local error_count=0
    while IFS= read -r file; do
        if [ -f "$file" ]; then
            if markdownlint -c "$PROJECT_ROOT/.markdownlint.json" "$file" >/dev/null 2>&1; then
                echo -e "   ${GREEN}✓${NC} $(basename "$file")"
            else
                echo -e "   ${RED}✗${NC} $(basename "$file")"
                markdownlint -c "$PROJECT_ROOT/.markdownlint.json" "$file" 2>&1 | sed 's/^/     /'
                ((error_count++))
            fi
        fi
    done <<< "$md_files"
    
    if [ $error_count -eq 0 ]; then
        echo -e "${GREEN}✓ All Markdown files valid${NC}"
    else
        echo -e "${RED}✗ $error_count Markdown file(s) have errors${NC}"
        MARKDOWN_ERRORS=$error_count
    fi
    echo ""
}

# Run all validations
validate_yaml
validate_shell
validate_markdown

# Summary
echo "=================================="
echo "📊 Validation Summary"
echo "=================================="
TOTAL_ERRORS=$((YAML_ERRORS + SHELL_ERRORS + MARKDOWN_ERRORS))

if [ $TOTAL_ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All validations passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Total errors: $TOTAL_ERRORS${NC}"
    echo "  - YAML errors: $YAML_ERRORS"
    echo "  - Shell errors: $SHELL_ERRORS"
    echo "  - Markdown errors: $MARKDOWN_ERRORS"
    exit 1
fi
