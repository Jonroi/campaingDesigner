# Campaign Designer

A modern React/TypeScript application for generating Ideal Customer Profiles (ICPs) and Marketing Campaigns using AI analysis. Built with Next.js, tRPC, Prisma ORM, PostgreSQL, and Redis for optimal performance and type safety.

## 🚀 Features

### Core Functionality

- **AI-Powered ICP Generation** - Generate detailed customer profiles using advanced AI analysis
- **Company Data Management** - Comprehensive company information collection and storage
- **Campaign Generation** - Create marketing campaigns based on ICP profiles
- **Multi-Company Support** - Manage multiple companies per user
- **Real-time Data Sync** - Live updates with Redis caching

### Technical Features

- **Full TypeScript Support** - End-to-end type safety with Prisma ORM
- **tRPC Integration** - Type-safe API communication
- **Prisma ORM** - Modern database access with auto-generated types
- **Redis Caching** - High-performance data caching
- **PostgreSQL Database** - Robust relational database
- **Next.js 15** - Latest React framework with App Router
- **Tailwind CSS** - Modern, utility-first styling
- **NextAuth.js** - Secure authentication system

## 🏗️ Architecture

### Database Layer

- **Prisma ORM** - Type-safe database operations
- **PostgreSQL** - Primary database with advanced features
- **Redis** - High-speed caching layer
- **Auto-generated Types** - Full TypeScript integration

### API Layer

- **tRPC** - Type-safe API endpoints
- **Prisma Client** - Database operations
- **Redis Service** - Caching operations
- **AI Service** - OpenAI integration for ICP and campaign generation

### Frontend Layer

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **tRPC Client** - Type-safe API calls

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- OpenAI API key

### Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd campaign-designer
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Configuration**

Create `.env.local` file:

```env
DATABASE_URL="postgresql://icp_user:password@localhost:5432/icp_builder"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
OPENAI_API_KEY="your-openai-api-key"
NODE_ENV="development"
```

4. **Database Setup**

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

5. **Start Development**

```bash
# Start with Docker services
npm run dev:services

# Or start manually
npm run dev
```

## 🛠️ Available Scripts

| Script                | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Start development server            |
| `npm run build`       | Build for production                |
| `npm run start`       | Start production server             |
| `npm run lint`        | Run ESLint                          |
| `npm run type-check`  | Run TypeScript checks               |
| `npm run db:generate` | Generate Prisma client              |
| `npm run db:push`     | Push schema to database             |
| `npm run db:seed`     | Seed database with sample data      |
| `npm run db:studio`   | Open Prisma Studio                  |
| `npm run db:reset`    | Reset database and apply migrations |
| `npm run docker:up`   | Start Docker services               |
| `npm run docker:down` | Stop Docker services                |

## 🗄️ Database Schema

### Core Models

#### User

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  companies Company[]

  // NextAuth fields
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}
```

#### Company

```prisma
model Company {
  id          Int           @id @default(autoincrement())
  userId      String        @map("user_id")
  name        String
  createdAt   DateTime      @default(now()) @map("created_at")
  updatedAt   DateTime      @updatedAt @map("updated_at")
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyData CompanyData[]
  icpProfiles ICPProfile[]
}
```

#### CompanyData

```prisma
model CompanyData {
  id         String   @id @default(cuid())
  companyId  Int      @map("company_id")
  fieldName  String   @map("field_name")
  fieldValue String   @map("field_value")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")
  version    Int      @default(1)
  company    Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)

  @@unique([companyId, fieldName])
}
```

#### ICPProfile

```prisma
model ICPProfile {
  id              String     @id @default(cuid())
  companyId       Int        @map("company_id")
  name            String
  description     String?
  profileData     Json       @map("profile_data")
  confidenceLevel String     @default("medium") @map("confidence_level")
  createdAt       DateTime   @default(now()) @map("created_at")
  updatedAt       DateTime   @updatedAt @map("updated_at")
  campaigns       Campaign[]
  company         Company    @relation(fields: [companyId], references: [id], onDelete: Cascade)
}
```

#### Campaign

```prisma
model Campaign {
  id              String @id @default(cuid())
  name            String
  icpId           String @map("icp_id")
  copyStyle       String @map("copy_style")
  mediaType       String @map("media_type")
  adCopy          String @map("ad_copy")
  imagePrompt     String? @map("image_prompt")
  imageUrl        String? @map("image_url")
  cta             String
  hooks           String
  landingPageCopy String @map("landing_page_copy")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  icpProfile ICPProfile @relation(fields: [icpId], references: [id], onDelete: Cascade)
}
```

## 🔧 Usage Examples

### Prisma Database Operations

```typescript
import { prisma } from "@/server/db";

// Get all companies with their data
const companies = await prisma.company.findMany({
  include: {
    companyData: true,
    icpProfiles: {
      include: {
        campaigns: true,
      },
    },
  },
});

// Create new company with data
const company = await prisma.company.create({
  data: {
    userId: "user-uuid",
    name: "New Company",
    companyData: {
      create: [
        { fieldName: "industry", fieldValue: "Technology" },
        { fieldName: "location", fieldValue: "San Francisco" },
      ],
    },
  },
  include: {
    companyData: true,
  },
});
```

### tRPC API Usage

```typescript
import { api } from "@/trpc/react";

// Get companies
const { data: companies } = api.company.list.useQuery();

// Create company
const createCompany = api.company.create.useMutation();
createCompany.mutate({
  name: "New Company",
  companyData: [{ fieldName: "industry", fieldValue: "Technology" }],
});

// Generate ICP
const generateICP = api.icp.generate.useMutation();
generateICP.mutate({
  companyId: 1,
  name: "Primary ICP",
  description: "Main target audience",
});

// Generate Campaign
const generateCampaign = api.campaign.generate.useMutation();
generateCampaign.mutate({
  icpId: "icp-uuid",
  name: "Q1 Campaign",
  copyStyle: "Professional",
  mediaType: "Social Media",
  cta: "Get Started",
  hooks: "Transform your business",
});
```

## 🎯 Benefits

### Type Safety

- **Auto-generated types** for all database operations
- **Type-safe queries** with full IntelliSense support
- **Compile-time error checking** for database operations
- **Automatic type inference** for tRPC procedures

### Developer Experience

- **Prisma Studio** - Visual database browser
- **Automatic migrations** with version control
- **Schema validation** and introspection
- **Query optimization** and performance insights

### Performance

- **Redis caching** for frequently accessed data
- **Optimized queries** with Prisma
- **Connection pooling** and resource management
- **Efficient data loading** with includes and selects

## 🚨 Error Prevention

**NEVER**:

- Use raw SQL queries (use Prisma instead)
- Skip error handling
- Ignore TypeScript errors
- Use direct fetch calls (use tRPC)
- Skip Redis caching for frequently accessed data

## 📚 Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## 🆘 Need Help?

- Check the Prisma Migration Guide
- Review the example routers in `src/server/api/routers/`
- Open Prisma Studio: `npm run db:studio`
- Check the Setup Guide

---

**Campaign Designer** - Modern, type-safe ICP generation and campaign creation with AI-powered insights.
