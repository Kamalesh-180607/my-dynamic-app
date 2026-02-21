const bcrypt = require("bcrypt");

const input = process.argv[2];
if (!input) {
  console.log("Usage: node scripts/hash-password.js <password>");
  process.exit(1);
}

bcrypt
  .hash(input, 10)
  .then((hash) => {
    console.log(hash);
  })
  .catch((err) => {
    console.error("Hashing failed", err);
    process.exit(1);
  });
