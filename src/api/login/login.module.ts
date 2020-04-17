import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from 'src/config/config.module';
import { MembersModule } from '../member/members.module';

@Module({
    imports: [AuthModule, ConfigModule, MembersModule],
    controllers: [LoginController],
    providers: [LoginService],
    exports: [LoginService],
})
export class LoginModule { }
