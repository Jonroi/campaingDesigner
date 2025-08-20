import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@digitallabs.fi" },
    update: {},
    create: {
      email: "admin@digitallabs.fi",
      name: "Admin User",
    },
  });

  console.log("✅ Admin user created:", adminUser.email);

  // Create sample company
  const sampleCompany = await prisma.company.upsert({
    where: {
      id: 1,
      userId: adminUser.id,
    },
    update: {},
    create: {
      id: 1,
      userId: adminUser.id,
      name: "Digital Labs",
      companyData: {
        create: [
          { fieldName: "industry", fieldValue: "Technology" },
          { fieldName: "location", fieldValue: "Helsinki, Finland" },
          { fieldName: "size", fieldValue: "50-200 employees" },
          { fieldName: "founded", fieldValue: "2020" },
          {
            fieldName: "focus",
            fieldValue: "Digital Marketing & AI Solutions",
          },
        ],
      },
    },
  });

  console.log("✅ Sample company created:", sampleCompany.name);

  // Create sample ICP profile
  const sampleICP = await prisma.iCPProfile.upsert({
    where: {
      id: "sample-icp-1",
      companyId: sampleCompany.id,
    },
    update: {},
    create: {
      id: "sample-icp-1",
      companyId: sampleCompany.id,
      name: "Tech Startup ICP",
      description: "Ideal customer profile for technology startups in Finland",
      confidenceLevel: "high",
      profileData: {
        demographics: {
          ageRange: "25-40",
          location: "Nordic countries, primarily Finland",
          incomeLevel: "Upper-middle class",
          companySize: "10-100 employees",
        },
        psychographics: {
          interests: ["Technology", "Innovation", "Growth", "Efficiency"],
          values: [
            "Quality",
            "Innovation",
            "Sustainability",
            "Customer Success",
          ],
          lifestyle: "Tech-savvy entrepreneurs and professionals",
        },
        behavior: {
          buyingHabits: "Research-driven, value-focused decisions",
          preferredChannels: [
            "LinkedIn",
            "Professional networks",
            "Industry events",
          ],
          painPoints: [
            "Limited resources",
            "Need for scalable solutions",
            "Competition",
          ],
        },
        companyData: {
          industry: "Technology",
          location: "Helsinki, Finland",
          size: "50-200 employees",
          founded: "2020",
          focus: "Digital Marketing & AI Solutions",
        },
      },
    },
  });

  console.log("✅ Sample ICP profile created:", sampleICP.name);

  // Create sample campaign
  const sampleCampaign = await prisma.campaign.upsert({
    where: {
      id: "sample-campaign-1",
      icpId: sampleICP.id,
    },
    update: {},
    create: {
      id: "sample-campaign-1",
      icpId: sampleICP.id,
      name: "AI-Powered Growth Campaign",
      copyStyle: "Professional and innovative",
      mediaType: "LinkedIn Ads",
      adCopy:
        "Transform your startup's growth with AI-powered marketing solutions. Perfect for tech-savvy entrepreneurs who value innovation and efficiency.",
      imagePrompt:
        "Modern office with young professionals using laptops, clean and innovative aesthetic",
      cta: "Start Your AI Journey",
      hooks:
        "Stop wasting time on manual marketing. Let AI do the heavy lifting.",
      landingPageCopy:
        "Welcome to the future of startup marketing. Our AI-powered solutions help Finnish tech startups scale efficiently while maintaining quality and innovation.",
    },
  });

  console.log("✅ Sample campaign created:", sampleCampaign.name);

  console.log("🎉 Database seeding completed successfully!");
  console.log("");
  console.log("📋 Login Credentials:");
  console.log("Email: admin@digitallabs.fi");
  console.log("Password: supersite1234");
  console.log("");
  console.log("🔗 Access the application at: http://localhost:3000");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
