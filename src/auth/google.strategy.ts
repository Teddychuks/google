import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    let email: string | null = null;
    if (profile.emails && profile.emails.length > 0) {
      email = profile.emails[0].value;
    }

    if (!email) {
      return done(new Error('No email found in Google profile'), null);
    }

    const user = {
      email,
      name: `${profile.name?.givenName} ${profile.name?.familyName}`,
      id: profile.id,
      accessToken,
    };

    done(null, user);
  }
}
