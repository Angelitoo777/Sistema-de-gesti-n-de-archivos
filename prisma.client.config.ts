import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL;

const clientConfig = {
  adapter: {
    url: DATABASE_URL,
  },
};

export default clientConfig;
