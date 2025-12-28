import { db, client, User } from "./index";

/**
 * Staff Engineer Debugging Strategy:
 * We add explicit logs before and after the async call to identify 
 * exactly where the execution "swallows" the output.
 */
async function testRead() {
  console.log("-----------------------------------------");
  console.log("🚀 [DEBUG] Script started...");
  
  try {
    console.log("📡 [DEBUG] Attempting to query 'users' table...");
    
    // We use a simple select to verify basic connectivity
    const allUsers = await db.query.users.findMany();

    console.log(`✅ [DEBUG] Query finished. Found ${allUsers.length} users.`);

    if (allUsers.length === 0) {
      console.log("⚠️  Database is reachable, but the 'users' table is empty.");
      console.log("👉 Suggestion: Run 'pnpm db:seed' to add sample data.");
    } else {
      allUsers.forEach((user) => {
        console.log(`  👤 [${user.role}] ${user.fullName} (${user.email})`);
      });
    }

  } catch (error) {
    console.error("❌ [ERROR] Database connection or query failed:");
    console.error(error);
  } finally {
    console.log("🔌 [DEBUG] Closing database connection...");
    // Crucial: postgres-js keeps the connection pool open. 
    // We must close the client or exit the process.
    await client.end();
    console.log("🏁 [DEBUG] Test complete.");
    console.log("-----------------------------------------");
    process.exit(0);
  }
}

// Ensure the function is actually called
console.log("🔍 [INIT] Calling testRead()...");
testRead().catch(err => {
    console.error("💥 Critical Failure:", err);
    process.exit(1);
});