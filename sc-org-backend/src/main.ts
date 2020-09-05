import { APIService } from './services/api.service';
import { DatabaseService } from './services/database.service';

const databaseService = new DatabaseService();
const apiService = new APIService(databaseService);