import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 2,
});

async function main() {
  const action = process.argv[2];

  if (action === 'list') {
    const { rows } = await pool.query('SELECT id, name, email, role FROM "user"');
    console.table(rows);
  } else if (action === 'promote') {
    const email = process.argv[3];
    if (!email) {
      console.error('Usage: tsx --env-file=.env scripts/manage-roles.ts promote <email>');
      process.exit(1);
    }
    const { rowCount } = await pool.query(
      `UPDATE "user" SET role = 'ADMIN' WHERE email = $1`,
      [email],
    );
    if (rowCount === 0) {
      console.error(`No user found with email: ${email}`);
    } else {
      console.log(`✅ Promoted ${email} to ADMIN`);
    }
  } else {
    console.log('Usage:');
    console.log('  tsx --env-file=.env scripts/manage-roles.ts list');
    console.log('  tsx --env-file=.env scripts/manage-roles.ts promote <email>');
  }

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
