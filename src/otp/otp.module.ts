import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './schemas/otp.schema';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';


@Module({
  imports: [MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }])],
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
