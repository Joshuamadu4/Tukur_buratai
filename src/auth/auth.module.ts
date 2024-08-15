import { Module, forwardRef, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from '../admin/admin.module';

@Global()
@Module({
  imports: [
    ConfigModule,  // Ensure ConfigModule is imported and properly configured
    forwardRef(() => UserModule),  // Import UserModule to handle circular dependency
  ],
  providers: [AuthService],
  exports: [AuthService],  // Export AuthService to make it available in UserModule
})
export class AuthModule {}
