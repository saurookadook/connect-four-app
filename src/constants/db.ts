export const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
export const MONGO_PORT = process.env.MONGO_PORT || 27017;
export const MONGO_CONNECTION = `mongodb://${MONGO_HOST}:${MONGO_PORT}/connect-four`;
