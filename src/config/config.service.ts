import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };
  constructor(filePath: string) {
    console.log(filePath)
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      ENV_NAME: Joi.string()
        .valid(['development', 'production'])
        .default('development'),
      DATABASE_HOST: Joi.string().required(),
      DATABASE: Joi.string().required(),
      DATABASE_USERNAME: Joi.string().required(),
      DATABASE_PASSWORD: Joi.string().required(),
      ADMIN_PASSWORD: Joi.string().required(),
      ALLOWED_EMAIL_DOMAINS: Joi.string().required(),
      ACCESS_TOKEN_SECRET_KEY: Joi.string().required(),
      REFRESH_TOKEN_SECRET_KEY: Joi.string().required(),
      ACCESS_TOKEN_TIMEOUT: Joi.string().required(),
      REFRESH_TOKEN_TIMEOUT: Joi.string().required(),
      ACCESS_TOKEN_PUBLIC_KEY: Joi.string().required(),
      ACCESS_TOKEN_PRIVATE_KEY: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
  get(key: string): string {
    return this.envConfig[key];
  }
}
