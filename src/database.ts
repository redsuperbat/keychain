import { Connection, createConnection, Repository } from 'typeorm'
import { RefreshToken } from './entity/RefreshToken'
import { User } from './entity/User'

export class Database {
  public static connection: Connection
  public static userRepository: Repository<User>
  public static refreshTokenRepository: Repository<RefreshToken>

  public static async init() {
    console.log(`Connection to ${process.env.DB_HOST}...`)
    this.connection = await createConnection()
    console.log('Database is now connected...')
    this.userRepository = this.connection.getRepository(User)
    this.refreshTokenRepository = this.connection.getRepository(RefreshToken)
  }
}
