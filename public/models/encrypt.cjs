const crypto = require("crypto");
const fs = require("fs");

const encryptFile = (inputFile, outputFile, password) => {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, 210000, 32, "sha256");

  const plaintext = fs.readFileSync(inputFile);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Output format: [salt(16) | iv(12) | tag(16) | ciphertext]
  const payload = Buffer.concat([salt, iv, authTag, ciphertext]);
  fs.writeFileSync(outputFile, payload);
};

const password = process.env.CHARACTER_MODEL_KEY || process.argv[2];

if (!password) {
  console.error("Missing password. Use CHARACTER_MODEL_KEY env var or pass as first arg.");
  process.exit(1);
}

encryptFile("character.glb", "character.enc", password);
