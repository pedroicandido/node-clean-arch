import { MongoClient, Db, Collection } from 'mongodb';

class MongoDBSingleton {
  private static instance: MongoDBSingleton;
  private client: MongoClient | null = null;
  private db: Db | null = null;

  private constructor() { } // Construtor privado para não permitir criação direta

  // Método para obter a instância única
  public static getInstance(): MongoDBSingleton {
    if (!MongoDBSingleton.instance) {
      MongoDBSingleton.instance = new MongoDBSingleton();
    }
    return MongoDBSingleton.instance;
  }

  // Método para abrir a conexão com o MongoDB, agora com a URI sendo passada aqui
  public async connect(uri: string): Promise<void> {
    if (this.client && this.db) {
      console.log('Conexão já estabelecida.');
      return;
    }

    try {
      console.log('Conectando ao MongoDB...');
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db(); // O nome do banco de dados pode ser configurado na URI ou especificado aqui
      console.log('Conexão bem-sucedida!');
    } catch (error) {
      console.error('Erro ao conectar ao MongoDB:', error);
      throw error;
    }
  }

  // Método para fechar a conexão
  public async close(): Promise<void> {
    if (!this.client) {
      console.log('Nenhuma conexão aberta para fechar.');
      return;
    }

    try {
      console.log('Fechando conexão com o MongoDB...');
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Conexão fechada.');
    } catch (error) {
      console.error('Erro ao fechar a conexão com o MongoDB:', error);
      throw error;
    }
  }

  // Método para obter a instância do banco de dados
  public getDb(): Db | null {
    return this.db;
  }

  // Método para obter uma coleção pelo nome
  public getCollection(collectionName: string): Collection {
    if (!this.db) {
      console.error('Banco de dados não conectado.');
      return null;
    }
    return this.db.collection(collectionName);
  }
}

export default MongoDBSingleton;