import { Injectable } from '@nestjs/common';
import { SecretService } from '../../repositories/secret/secret.service'

@Injectable()
export class SecretsService {
    constructor(
        private readonly secretService: SecretService
    ) { }

    async createSecret(secret) {
        return await this.secretService.save(secret);
    }

    async getSecret(id) {
        return await this.secretService.findOne(id);
    }
}
