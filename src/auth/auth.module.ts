import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/jwt/jwt.strategy';
import { join } from 'path';
import { ACCESS_TOKEN_EXPIRATION } from './auth.constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthResolver } from './Auth.resolver';
import { google } from 'googleapis';
import { ServiceAuthService } from './service-auth.service';
import { EmailNotificationModule } from 'src/email-notification/email-notification.module';
import { PasswordService } from './password.service';
import { RegistrationService } from './registration.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    EmailNotificationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: ACCESS_TOKEN_EXPIRATION, algorithm: 'HS256' },
      }),
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<MailerOptions> => {
        // 1) Read & log your env vars
        const clientId = config.get<string>('GOOGLE_CLIENT_MAIL_ID');
        const clientSecret = config.get<string>('GOOGLE_CLIENT_MAIL_SECRET');
        const redirectUri = config.get<string>('GOOGLE_REDIRECT_MAIL_URI');
        const refreshToken = config.get<string>('GOOGLE_REFRESH_MAIL_TOKEN');
        const userEmail = config.get<string>('GOOGLE_MAIL_ADDRESS');


        // 2) Set up OAuth2 client & fetch an access token
        const oauth2Client = new google.auth.OAuth2(
          clientId,
          clientSecret,
          redirectUri,
        );
        oauth2Client.setCredentials({ refresh_token: refreshToken });

        let tokenResponse;
        try {
          tokenResponse = await oauth2Client.getAccessToken();
        } catch (err) { 
          throw err;
        } 
        const accessToken = tokenResponse.token!;
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              type: 'OAuth2',
              user: userEmail,
              clientId,
              clientSecret,
              refreshToken,
              accessToken,
            },
            tls: { rejectUnauthorized: false }, 
          },
          defaults: {
            from: `No Reply <${userEmail}>`,
          },
          template: {
            dir: join(process.cwd(), 'src', 'auth', 'templates'),
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AuthResolver, 
    PrismaService,
    ServiceAuthService,
    RegistrationService,
    PasswordService,
  ],
  exports: [AuthService, JwtModule, PrismaService, ServiceAuthService], 
})
export class AuthModule{};