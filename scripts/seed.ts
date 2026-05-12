import { db } from '../lib/db';
import { contents } from '../lib/db/schema';

async function main() {
  console.log('Seeding database for CI...');

  try {
    // Seed Changelog
    await db.insert(contents).values({
      slug: 'changelog',
      type: 'changelog',
      title: 'Novidades',
      body: '## 2026-05-04\n\n- Lançamento oficial da plataforma Algoria!',
      status: 'PUBLISHED',
    }).onConflictDoNothing();

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

main();
