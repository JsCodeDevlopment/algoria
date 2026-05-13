import { db } from './lib/db';
import { contents } from './lib/db/schema';

async function check() {
  const all = await db.select({
    id: contents.id,
    slug: contents.slug,
    type: contents.type,
    metadata: contents.metadata
  }).from(contents);

  console.log(`Total contents: ${all.length}`);
  const types = {};
  all.forEach(c => {
    types[c.type] = (types[c.type] || 0) + 1;
    const meta = c.metadata as { access?: string };
    if (meta?.access) {
      console.log(`[${c.type}] ${c.slug}: access=${meta.access}`);
    } else {
      console.log(`[${c.type}] ${c.slug}: access=MISSING`);
    }
  });
  console.log('Types distribution:', types);
}

check().catch(console.error);
