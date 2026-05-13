import { db } from '../lib/db';
import { contents } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const SYSTEM_TYPES = [
  'changelog',
  'legal-page',
  'landing-section',
  'pricing-copy',
  'navigation',
  'taxonomy',
];

async function migrate() {
  console.log('Starting selective migration of access field...');

  const allContents = await db.select({
    id: contents.id,
    slug: contents.slug,
    type: contents.type,
    metadata: contents.metadata
  }).from(contents);

  console.log(`Found ${allContents.length} items to process.`);

  let updatedCount = 0;

  for (const item of allContents) {
    const meta = item.metadata as any;
    let accessValue: 'free' | 'pro' = 'pro';

    // Regra 1: Conteúdos de sistema são sempre GRATUITOS
    if (SYSTEM_TYPES.includes(item.type)) {
      accessValue = 'free';
    } 
    // Regra 2: Respeitar o que já estiver no metadata
    else if (meta?.access === 'free' || meta?.access === 'pro') {
      accessValue = meta.access;
    }
    // Regra 3: Se for um tipo editorial e não tiver info, padrão é PRO
    else {
      accessValue = 'pro';
    }

    await db.update(contents)
      .set({ access: accessValue })
      .where(eq(contents.id, item.id));
    
    updatedCount++;
  }

  console.log(`Migration completed! Total processed: ${updatedCount}`);
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
