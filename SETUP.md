# ICP Builder Setup Guide

This guide will help you set up the ICP Builder application on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Docker** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd icp-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env.local
```

Edit `.env.local` and update the following variables:

```env
DATABASE_URL="postgresql://icp_user:password@localhost:5432/icp_builder"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Start Services with Docker

```bash
npm run docker:up
```

This will start PostgreSQL and Redis containers.

### 5. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Manual Setup (Without Docker)

If you prefer to run PostgreSQL and Redis locally:

### 1. Install PostgreSQL

**macOS (with Homebrew):**

```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [PostgreSQL website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE icp_builder;
CREATE USER icp_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE icp_builder TO icp_user;
\q
```

### 3. Install Redis

**macOS (with Homebrew):**

```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Windows:**
Download from [Redis website](https://redis.io/download) or use WSL.

## Development Workflow

### Database Management

```bash
# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database
npm run db:reset

# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push
```

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run typecheck

# Format code
npm run format:write
```

### Docker Commands

```bash
# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs

# Start development with services
npm run dev:services
```

## Troubleshooting

### Database Connection Issues

1. **Check if PostgreSQL is running:**

   ```bash
   # With Docker
   docker ps | grep postgres

   # Without Docker
   sudo systemctl status postgresql
   ```

2. **Verify connection string:**
   Make sure your `DATABASE_URL` in `.env.local` is correct.

3. **Reset database:**
   ```bash
   npm run db:reset
   ```

### Redis Connection Issues

1. **Check if Redis is running:**

   ```bash
   # With Docker
   docker ps | grep redis

   # Without Docker
   sudo systemctl status redis
   ```

2. **Test Redis connection:**
   ```bash
   redis-cli ping
   ```

### Port Conflicts

If you get port conflicts:

1. **Check what's using the ports:**

   ```bash
   # Check port 5432 (PostgreSQL)
   lsof -i :5432

   # Check port 6379 (Redis)
   lsof -i :6379

   # Check port 3000 (Next.js)
   lsof -i :3000
   ```

2. **Stop conflicting services or change ports in docker-compose.yml**

### Authentication Issues

1. **Generate a new NEXTAUTH_SECRET:**

   ```bash
   openssl rand -base64 32
   ```

2. **Update .env.local with the new secret**

3. **Clear browser cookies and local storage**

## Production Deployment

For production deployment, you'll need to:

1. Set up a production PostgreSQL database
2. Set up a production Redis instance
3. Configure environment variables for production
4. Set up proper authentication providers
5. Configure domain and SSL certificates

See the main README.md for more deployment information.

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs: `npm run docker:logs`
3. Check the Prisma documentation
4. Open an issue in the repository

## Next Steps

After successful setup:

1. **Explore the application** - Create companies, generate ICPs, and create campaigns
2. **Review the code** - Check out the tRPC routers and React components
3. **Customize** - Modify the AI generation logic, add new features
4. **Deploy** - Set up production environment
