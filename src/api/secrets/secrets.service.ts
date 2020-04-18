import { Injectable, Logger } from '@nestjs/common';
import { SecretService } from '../../repositories/secret/secret.service';
import { Cron } from '@nestjs/schedule';
import { log } from 'util';

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

    async getAllSecrets() {
        return await this.secretService.findAll();
    }

    async deleteSecret(id) {
        return await this.secretService.delete(id);
    }

    @Cron('0 */30 * * * *')
    handleCron() {
        Logger.warn('Secret Cleanup Initiated....');
        this.secretHandler();
        Logger.warn('Secret Cleanup Completed');
    }

    async secretHandler() {
        try {
            let timeLeft: any;
            const secrets = await this.getAllSecrets();
            for (let secret of secrets) {
                timeLeft = await this.calculateTimeLeft((secret.createdAt).toString(), secret.ttl)
                if (timeLeft <= 0) {
                    await this.deleteSecret(secret.id);
                }
            }
        } catch (error) {
            Logger.error(error.message);
        }
    }

    async calculateTimeLeft(createdAt: string, ttl: number): Promise<number> {
        const currentTime = Date.now();
        const diff = currentTime - Date.parse(createdAt);
        let diffDate = new Date(diff);
        const age = diffDate.getUTCMinutes();
        return (1440 * ttl - age);
    }
}
