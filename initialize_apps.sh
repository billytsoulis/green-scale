#!/bin/bash

# --- 1. Preparation ---
# Ensure we are in the root of the monorepo
cd ~/projects/greenscale

# --- 2. Initialize Client Portal (Next.js 16) ---
echo "Initializing Client Portal (Investor App) with Next.js 16..."
cd apps
# We use specific flags for Next.js 16 as discussed:
# --typescript, --tailwind, --eslint, --app, --src-dir, --import-alias "@/*"
# --react-compiler (The new standard for React 19/Next 16)
npx create-next-app@16 client-portal \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-pnpm \
  --react-compiler \
  --skip-install

# --- 3. Initialize Staff Dashboard (React 19 + Vite) ---
echo "Initializing Staff Dashboard (Internal Admin) with React 19..."
# We use standard Vite (answering 'No' to Rolldown experimental)
# We do not run install here to avoid local pnpm-lock files
pnpm create vite staff-dashboard --template react-ts

# --- 4. Initialize ML Engine (Python 3.13 + FastAPI) ---
# Note: You mentioned you'd like to create main.py via VS Code. 
# This part ensures the directory and venv are ready.
echo "Preparing ML Engine Directory..."
mkdir -p ml-engine
cd ml-engine

# Initialize Virtual Env if not exists
if [ ! -d "venv" ]; then
    python3.13 -m venv venv
fi

# We provide a basic requirements.txt for your pip install step
cat <<EOT > requirements.txt
fastapi
uvicorn
pandas
scikit-learn
pydantic
EOT

# --- 5. Final Workspace Installation ---
echo "Linking all apps and installing dependencies via pnpm workspace..."
cd ~/projects/greenscale
pnpm install

echo "--------------------------------------------------------"
echo " Scaffolding Complete: "
echo " - Client Portal: Next.js 16 + React Compiler"
echo " - Staff Dashboard: Vite + React 19"
echo " - ML Engine: Python 3.13 Ready"
echo "--------------------------------------------------------"
echo "Next Steps:"
echo "1. Open apps/ml-engine/main.py in VS Code and paste your FastAPI code."
echo "2. Run 'pnpm dev' from the root to start the ecosystem."