import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
}

const envsSchema = joi
  .object({
    PORT: joi.number(),
  })
  .unknown(true);

const res = envsSchema.validate(process.env);

if (res.error) {
  throw new Error(`Config validation error: ${res.error.message}`);
}

const envVars: EnvVars = res.value as EnvVars;

export const envs = {
  port: envVars.PORT,
};
