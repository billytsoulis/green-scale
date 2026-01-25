## Step A: Start Infrastructure (Docker)

Ensure you are in the root greenscale folder:

docker-compose up -d
# Verify with:
docker ps


## Step B: Sync the Database Schema

cd packages/database
npx drizzle-kit push
cd ../..


## Step C: Launch the Full Ecosystem

From the root greenscale folder, run the Turborepo dev command:

pnpm dev


What to look for in the terminal:

You should see multiple "tasks" starting simultaneously.

Next.js will compile the client-portal.

Vite will start the staff-dashboard.

If any task shows RED, it usually means a missing dependency. Run pnpm install again at the root.

http://localhost:3000 -> Should show the Next.js welcome page.

http://localhost:8000/docs -> Should show the Swagger UI for your Python API.

http://localhost:5173 -> Should show the Vite + React logo.

http://localhost:5050 -> pgAdmin
Email: admin@greenscale.com
Password: admin
Click "Add New Server" and fill in these details:

General Tab:

Name: GreenScale DB

Connection Tab:

Host name/address: postgres (This works because they are in the same Docker network).

Port: 5432

Maintenance database: greenscale

Username: admin

Password: password123

Click Save.

http://localhost:8001 -> redis
When prompted to add a database, use the Host: redis (the name of the service in our Docker network).

The Port is 6379
redis:6379
Database alias: 127.0.0.1:6379
no username and password
check the standalone checkbox

## Nuclear clean
- Navigate to the root cd ~/projects/greenscale
- rm -rf node_modules pnpm-lock.yaml pnpm-workspace.yaml.lock
- pnpm store prune
- pnpm install
--

## Generate data
- cd packages/database
- pnpm db:generate
- pnpm db:push
- pnpm db:seed || pnpm --filter @greenscale/database db:seed
- pnpm db:seed-cms || pnpm --filter @greenscale/database db:seed-cms

### Migrations:
- Path: greenscale/packages/database

### Command: 
- pnpm drizzle-kit generate 
### followed by 
- pnpm drizzle-kit push.

## Installation (example)
- pnpm add react@19.2.3 react-dom@19.2.3 --filter api-gateway

## Test the data
- npx tsx test-read.ts
- pnpm --filter @repo/ui test
- pnpm --filter client-portal test:e2e
- pnpm --filter staff-dashboard test:e2e
- pnpm --filter api-gateway test
- npx playwright test e2e/auth-diagnostics.spec.ts --debug

## Isolalate the tests example
- pnpm --filter @repo/ui test -- Badge

Now we have implement the landing page, the about us and the contact page

## Check for Port Conflicts (dev only)
- lsof -i :3000 then kill -9 <PID>
- lsof -i :5173 then kill -9 <PID>
- lsof -i :3005 then kill -9 <PID>

## Enable Python env
- source venv/bin/activate
- uvicorn main:app --reload