import fs from "node:fs";
import path from "node:path";

// 1. Carregar .env IMEDIATAMENTE (antes de qualquer outro import que use o DB)
try {
  const envPath = path.resolve(process.cwd(), ".env");
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const [key, ...value] = line.split("=");
    if (key && value.length > 0) {
      process.env[key.trim()] = value.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  });
  console.log("✅ Variáveis de ambiente carregadas.");
} catch (e) {
  console.error("❌ Erro ao carregar .env:", e);
}

async function forcePro() {
  // 2. Import dinâmico do DB para garantir que ele lê as variáveis carregadas acima
  const { db } = await import("../lib/db");
  const { user, subscription } = await import("../lib/db/schema");
  const { desc, eq } = await import("drizzle-orm");
  const { randomUUID } = await import("node:crypto");

  console.log("🚀 A procurar o último utilizador registado...");
  
  const lastUsers = await db.select().from(user).orderBy(desc(user.createdAt)).limit(1);
  const me = lastUsers[0];

  if (!me) {
    console.error("❌ Nenhum utilizador encontrado na base de dados.");
    process.exit(1);
  }

  console.log(`✅ Utilizador encontrado: ${me.name} (${me.email})`);

  const existingSub = await db.select().from(subscription).where(eq(subscription.userId, me.id)).limit(1);

  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  if (existingSub[0]) {
    await db.update(subscription)
      .set({
        status: "active",
        currentPeriodEnd: oneYearFromNow,
        updatedAt: new Date(),
      })
      .where(eq(subscription.userId, me.id));
    console.log("✨ Assinatura existente atualizada para ATIVA!");
  } else {
    await db.insert(subscription).values({
      id: randomUUID(),
      userId: me.id,
      stripeCustomerId: "cus_mock_" + Math.random().toString(36).substring(7),
      stripeSubscriptionId: "sub_mock_" + Math.random().toString(36).substring(7),
      status: "active",
      currentPeriodEnd: oneYearFromNow,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✨ Nova assinatura PRO criada com sucesso!");
  }

  console.log("\n🎉 Sucesso! Agora recarrega a página /pricing no teu browser.");
  process.exit(0);
}

forcePro().catch(console.error);
