import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { contents } from '../lib/db/schema';

async function main() {
  const rows = await db.select().from(contents).where(eq(contents.type, 'changelog'));
  console.log('Changelog rows:', rows.length);
  rows.forEach(r => {
    console.log(`ID: ${r.id}, Slug: ${r.slug}, Title: ${r.title}, Status: ${r.status}, UpdatedAt: ${r.updatedAt}`);
    console.log('Body snippet:', r.body.substring(0, 100));
  });
}

main().catch(console.error);
