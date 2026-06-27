import { AES, enc, HmacSHA256, lib } from 'crypto-js'


export interface URLHashConfig {
  secretKey: string
  urlSafeChars?: boolean
}


export class URLHashUtils {
  private readonly secretKey: string

  constructor(config: URLHashConfig | string) {
    if (typeof config === 'string') {
      this.secretKey = config
    } else {
      this.secretKey = config.secretKey
    }

    if (!this.secretKey) {
      throw new Error('Secret key is required')
    }
  }

  
  public encryptId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid string ID is required')
    }

    try {
      
      const encrypted = AES.encrypt(id, this.secretKey).toString()

      
      return this.makeUrlSafe(encrypted)
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  




  public decryptId(hash: string): string {
    if (!hash || typeof hash !== 'string') {
      throw new Error('Valid hash string is required')
    }

    try {
      
      const encrypted = this.fromUrlSafe(hash)

      
      const bytes = AES.decrypt(encrypted, this.secretKey)
      const decrypted = bytes.toString(enc.Utf8)

      if (!decrypted) {
        throw new Error('Failed to decrypt - invalid hash or wrong key')
      }

      return decrypted
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  




  public hashId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid string ID is required')
    }

    
    const hash = HmacSHA256(id, this.secretKey).toString()

    
    return this.makeUrlSafe(hash.substring(0, 16))
  }

  





  public hashIdWithLength(id: string, length: number = 16): string {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid string ID is required')
    }

    if (length < 1 || length > 64) {
      throw new Error('Length must be between 1 and 64')
    }

    const hash = HmacSHA256(id, this.secretKey).toString()
    return this.makeUrlSafe(hash.substring(0, length))
  }

  





  public verifyHash(id: string, hash: string): boolean {
    try {
      const computedHash = this.hashId(id)
      return computedHash === hash
    } catch {
      return false
    }
  }

  




  private makeUrlSafe(str: string): string {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
  }

  




  private fromUrlSafe(str: string): string {
    let result = str.replace(/-/g, '+').replace(/_/g, '/')

    
    while (result.length % 4) {
      result += '='
    }

    return result
  }

  



  public static generateSecretKey(): string {
    return lib.WordArray.random(256 / 8).toString()
  }
}




export class URLHashHelpers {
  




  public static fromEnv(envVarName: string = 'URL_HASH_SECRET'): URLHashUtils {
    const secretKey = process.env[envVarName]
    if (!secretKey) {
      throw new Error(`Environment variable ${envVarName} not found`)
    }
    return new URLHashUtils(secretKey)
  }

  





  public static quickHash(id: string, secretKey: string): string {
    const utils = new URLHashUtils(secretKey)
    return utils.hashId(id)
  }

  





  public static quickEncrypt(id: string, secretKey: string): string {
    const utils = new URLHashUtils(secretKey)
    return utils.encryptId(id)
  }
}


export interface UserURLParams {
  userId: string
  hashedId: string
}

export interface HashResult {
  original: string
  hashed: string
  encrypted: string
}


if (require.main === module) {
  const SECRET_KEY = process.env.URL_HASH_SECRET || 'your-secret-key-here'
  const urlHashUtils = new URLHashUtils(SECRET_KEY)

  try {
    
    const originalId: string = 'user123'
    console.log('Original ID:', originalId)

    
    const encryptedHash: string = urlHashUtils.encryptId(originalId)
    console.log('Encrypted hash:', encryptedHash)

    
    const decryptedId: string = urlHashUtils.decryptId(encryptedHash)
    console.log('Decrypted ID:', decryptedId)

    
    const simpleHash: string = urlHashUtils.hashId(originalId)
    console.log('Simple hash:', simpleHash)

    
    const customHash: string = urlHashUtils.hashIdWithLength(originalId, 12)
    console.log('Custom hash (12 chars):', customHash)

    
    const isValid: boolean = urlHashUtils.verifyHash(originalId, simpleHash)
    console.log('Hash verification:', isValid)

    
    const newKey: string = URLHashUtils.generateSecretKey()
    console.log('Generated key:', newKey)

    
    const quickHash: string = URLHashHelpers.quickHash(originalId, SECRET_KEY)
    console.log('Quick hash:', quickHash)
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error')
  }
}

export default URLHashUtils
