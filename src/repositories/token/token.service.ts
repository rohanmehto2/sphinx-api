import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(Token)
        private readonly repository: Repository<Token>,
    ) { }

    async save(data): Promise<any> {
        const item = this.repository.create(data);
        return await this.repository.save(item);
    }

    async findOne(id): Promise<Token> {
        return await this.repository.findOne(id);
    }

    async delete(id): Promise<any> {
        return await this.repository.delete({ id });
    }

    async getRepository(): Promise<Repository<Token>> {
        return this.repository;
    }

    async getToken(refreshToken): Promise<any> {
        return await this.repository.findOne({
            where: {
                value: refreshToken,
            }
        });
    }
}
