const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

async function decryptLegacyCBC(
  encryptedData: ArrayBuffer,
  password: string
): Promise<ArrayBuffer> {
  const iv = new Uint8Array(encryptedData.slice(0, 16));
  const data = encryptedData.slice(16);
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  const legacyKey = await crypto.subtle.importKey(
    "raw",
    hashedPassword,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  return crypto.subtle.decrypt({ name: "AES-CBC", iv }, legacyKey, data);
}

async function generateAESKey(
  password: string,
  salt: ArrayBuffer
): Promise<CryptoKey> {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 210000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
}

export const decryptFile = async (
  url: string,
  password: string
): Promise<ArrayBuffer> => {
  if (!password) {
    throw new Error("Missing model decryption key");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to fetch encrypted model: ${response.status}`);
  }

  const encryptedData = await response.arrayBuffer();
  const buffer = new Uint8Array(encryptedData);

  if (buffer.length <= SALT_LENGTH + IV_LENGTH + TAG_LENGTH) {
    return decryptLegacyCBC(encryptedData, password);
  }

  try {
    const salt = encryptedData.slice(0, SALT_LENGTH);
    const iv = new Uint8Array(
      encryptedData.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH)
    );
    const tag = new Uint8Array(
      encryptedData.slice(
        SALT_LENGTH + IV_LENGTH,
        SALT_LENGTH + IV_LENGTH + TAG_LENGTH
      )
    );
    const ciphertext = buffer.slice(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);
    const key = await generateAESKey(password, salt);

    const encryptedPayload = new Uint8Array(ciphertext.length + tag.length);
    encryptedPayload.set(ciphertext, 0);
    encryptedPayload.set(tag, ciphertext.length);

    return await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      encryptedPayload
    );
  } catch {
    // Backward compatibility for previously encrypted model files.
    return decryptLegacyCBC(encryptedData, password);
  }
};
