import { Injectable } from '@nestjs/common';
import { Secret } from './secret.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Joi from 'joi';
import { ConfigService } from 'src/config/config.service';


@Injectable()
export class SecretService {
    constructor(
        @InjectRepository(Secret)
        private readonly repository: Repository<Secret>,
        private readonly configService: ConfigService,
    ) { }

    private getSecretSchema() {
        const schema = Joi.object().keys({
            id: Joi.string().default(),
            secretName: Joi.string(),
            secret: Joi.string(),
            description: Joi.string().allow(''),
            sender: Joi.string(),
            receiver: Joi.string(),
            ttl: Joi.number().default(1),
            read: Joi.date(),
            createdAt: Joi.date(),
            modifiedAt: Joi.date(),
            createdBy: Joi.string(),
            modifiedBy: Joi.string(),
        });
        return schema.requiredKeys(
            'secretName',
            'secret',
            'sender',
            'receiver',
            'createdBy',
        );
    }

    async save(data): Promise<any> {
        data = Joi.validate(data, this.getSecretSchema());
        const item = this.repository.create(data.value);
        return await this.repository.save(item);
    }

    async findOne(id): Promise<Secret> {
        return await this.repository.findOne(id);
    }

    async findAll(): Promise<Secret[]> {
        return await this.repository.find();
    }

    async update(id, data): Promise<any> {
        return await this.repository.update(id, data);
    }

    async delete(id): Promise<any> {
        return await this.repository.delete({ id });
    }

    async getRepository(): Promise<Repository<Secret>> {
        return this.repository;
    }
}
