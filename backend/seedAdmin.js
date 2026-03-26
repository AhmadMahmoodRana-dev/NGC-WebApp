const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seedAdmin() {
  try {
    const hash = await bcrypt.hash('Admin@123', 12);

    await pool.query(
      `INSERT INTO users (username,email,password,role,department,name,mfa_enabled)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT DO NOTHING`,
      ['admin','admin@ngc.gov.pk',hash,'admin','IT','System Administrator',true]
    );

    console.log('✅ Admin seeded');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seedAdmin();

