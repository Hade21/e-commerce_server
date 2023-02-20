declare global {
  namespace NodeJS {
    NODE_ENV: string;
    PORT: number;
    MONGO_URI: string;
  }
}
