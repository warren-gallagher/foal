// std
import { URL } from 'url';

// 3p
import * as fetch from 'node-fetch';

// FoalTS
import { AbstractProvider, SocialTokens } from './abstract-provider.service';

export class ProfileError extends Error {
  constructor(readonly error) {
    super();
  }
}

export class FacebookProvider extends AbstractProvider {
  protected configPaths = {
    clientId: 'settings.social.facebook.clientId',
    clientSecret: 'settings.social.facebook.clientSecret',
    redirectUri: 'settings.social.facebook.redirectUri',
  };

  protected authEndpoint = 'https://www.facebook.com/v5.0/dialog/oauth';
  protected tokenEndpoint = 'https://graph.facebook.com/v5.0/oauth/access_token';
  protected profileEndpoint = 'https://graph.facebook.com/v5.0/me';

  protected fields: string[] = [ 'id', 'name', 'email' ];

  protected defaultScopes: string[] = [ 'email' ];

  async getUserFromTokens(tokens: SocialTokens) {
    const url = new URL(this.profileEndpoint);
    url.searchParams.set('access_token', tokens.access_token);
    url.searchParams.set('fields', this.fields.join(','));

    const response = await fetch(url.href);
    const body = await response.json();

    if (!response.ok) {
      throw new ProfileError(body);
    }

    return body;
  }

}
