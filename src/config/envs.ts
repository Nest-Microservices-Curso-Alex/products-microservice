import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;

  NATS_SERVERS: string[];
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),

    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

const res = envsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (res.error) {
  throw new Error(`Config validation error: ${res.error.message}`);
}

const envVars: EnvVars = res.value as EnvVars;

export const envs = {
  port: envVars.PORT,
  dbUrl: envVars.DATABASE_URL,

  natsServers: envVars.NATS_SERVERS,
};
