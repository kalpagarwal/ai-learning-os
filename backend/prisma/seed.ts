import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { id: "demo-user" },
    update: { email: "learner@example.com" },
    create: { id: "demo-user", email: "learner@example.com" }
  });

  await prisma.learningTopic.upsert({
    where: { userId_topic: { userId: user.id, topic: "Vector Databases" } },
    update: {},
    create: {
      userId: user.id,
      topic: "Vector Databases",
      strength: "WEAK",
      confidence: 0.25
    }
  });

  await prisma.learningTopic.upsert({
    where: { userId_topic: { userId: user.id, topic: "Prompt Engineering" } },
    update: {},
    create: {
      userId: user.id,
      topic: "Prompt Engineering",
      strength: "MEDIUM",
      confidence: 0.6
    }
  });

  await prisma.learningRoadmap.create({
    data: {
      userId: user.id,
      title: "AI Systems Fundamentals",
      stepsJson: [
        "Understand embeddings and cosine similarity",
        "Build a basic RAG pipeline",
        "Add memory and evaluation",
        "Introduce multi-agent orchestration"
      ]
    }
  });

  console.log(`Seed complete for user ${user.email} (${user.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
