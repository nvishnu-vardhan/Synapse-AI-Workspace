#!/bin/bash

# Synapse AI Workspace - Automated Setup Script
# This script will create all necessary files and setup the complete project

echo "🚀 Starting Synapse AI Workspace Setup..."
echo "========================================"

# Create directory structure
echo "📁 Creating project structure..."
mkdir -p app/api/{upload,chat,agent,email}
mkdir -p components/generative
mkdir -p lib/{agent,ingestion}
mkdir -p models
mkdir -p public

echo "✅ Directory structure created!"
echo ""
echo "📝 Next steps:"
echo "1. Run: npm install"
echo "2. Configure .env.local with your API keys"
echo "3. Run: npm run dev"
echo ""
echo "⚠️  IMPORTANT: Check the repository for all code files"
echo "    I will create them in separate commits."
echo ""
echo "✨ Setup script completed!"
