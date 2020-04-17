import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { TokenService } from './token.service';

@Module({
    imports: [TypeOrmModule.forFeature([Token])],
    providers: [TokenService],
    exports: [TokenService]
})
export class TokenModule { }
