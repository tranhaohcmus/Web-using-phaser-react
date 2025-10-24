/**
 * Script to create admin user with properly hashed password
 * Run: node create-admin.js
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

const createAdminUser = async () => {
  try {
    console.log("🔐 Creating admin user...\n");

    // Get admin credentials from command line or use defaults
    const email = process.argv[2] || "admin@kiwisport.vn";
    const password = process.argv[3] || "admin123";
    const fullName = process.argv[4] || "Admin Kiwi Sport";

    // Hash password
    console.log("⏳ Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("✅ Password hashed successfully\n");

    // Connect to database
    console.log("⏳ Connecting to database...");
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });
    console.log("✅ Connected to database\n");

    // Check if admin already exists
    const [existingUsers] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      console.log(`⚠️  User with email ${email} already exists!`);
      console.log("Do you want to update the password? (y/n)");

      // For simplicity, just update
      await connection.execute(
        "UPDATE users SET password_hash = ?, full_name = ?, role = ? WHERE email = ?",
        [passwordHash, fullName, "admin", email]
      );
      console.log("✅ Admin user updated successfully!\n");
    } else {
      // Insert new admin user
      await connection.execute(
        "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
        [email, passwordHash, fullName, "admin"]
      );
      console.log("✅ Admin user created successfully!\n");
    }

    // Display admin credentials
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);
    console.log("👤 Name:", fullName);
    console.log("👑 Role: admin");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(
      "⚠️  IMPORTANT: Please change the default password after first login!\n"
    );

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

// Display usage if --help is provided
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
Usage: node create-admin.js [email] [password] [full_name]

Examples:
  node create-admin.js
  node create-admin.js admin@example.com mypassword123 "Admin User"

Default values:
  Email: admin@kiwisport.vn
  Password: admin123
  Name: Admin Kiwi Sport
  `);
  process.exit(0);
}

createAdminUser();
