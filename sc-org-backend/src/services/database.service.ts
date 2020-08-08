import mysql from 'mysql';
import { environment } from '../environments/environment';

export class DatabaseService {
  private _connection: mysql.Connection | null = null;

  constructor() {
    this.connectToDatabase();
  }

  connectToDatabase() {
    this._connection = mysql.createConnection({
      host: environment.mysqlHost,
      user: environment.mysqlUser,
      password: environment.mysqlPassword,
      database: environment.mysqlDatabase
    });

    this._connection.connect(err => {
      if (err) {
        console.error('error when connecting to db: ', err);
        setTimeout(() => this.connectToDatabase(), 2000);
      }
    });

   this._connection.on('error', err => {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Connection lost, reconnecting to database...');
      this.connectToDatabase();
    } else {
      throw err;
    }
   });
  }

  get connection(): mysql.Connection {
    return this._connection!;
  }
}