import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VerifyCallback } from 'passport-oauth2';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
    constructor(config: ConfigService) {
        super({
            clientID: config.get<string>('LINKEDIN_CLIENT_ID'),
            clientSecret: config.get<string>('LINKEDIN_CLIENT_SECRET'),
            callbackURL: config.get<string>('LINKEDIN_CALLBACK_URL'),
            scope: ['r_emailaddress', 'r_liteprofile'],
            state: true,
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { name, emails, photos, id } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            socialId: id,
            provider: 'linkedin',
            accessToken,
        };
        done(null, user);
    }
}
