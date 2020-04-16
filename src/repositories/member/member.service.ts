import { Injectable, Logger } from '@nestjs/common';
import { Member } from './member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Joi from 'joi';
import { ConfigService } from './../../config/config.service';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
	private readonly repository: Repository<Member>,
	private readonly configService: ConfigService,
  ) {}

  private getMemberSchema() {
	  let allowedEmailDomains = this.configService.get('ALLOWED_EMAIL_DOMAINS').split(',');

      const schema = Joi.object().keys({
          id: Joi.string().default(),
          name: Joi.string(),
          email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: allowedEmailDomains } }),
          publicKey: Joi.string(),
          active: Joi.boolean(),
          createdAt: Joi.date(),
          modifiedAt: Joi.date(),
          createdBy: Joi.string(),
          modifiedBy: Joi.string(),
      });
      return schema.requiredKeys('name', 'email');
  }

  async save(data): Promise<any> {
	  data = Joi.validate(data, this.getMemberSchema());
	  const item = this.repository.create(data.value);
      return await this.repository.save(item);
  }

  async findOne(id): Promise<Member> {
      return await this.repository.findOne(id, {
        relations: ['sentSecrets', 'receivedSecrets'],
      });
  }

  async findAll(): Promise<Member[]> {
    return await this.repository.find();
  }

  async update(id, data): Promise<any> {
    return await this.repository.update(id, data);
  }

  async delete(id): Promise<any> {
    return await this.repository.delete({ id });
  }

  async getRepository(): Promise<Repository<Member>> {
    return this.repository;
  }
}