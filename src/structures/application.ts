import { Endpoints } from 'detritus-client-rest';

import { ShardClient } from '../client';
import {
  addQuery,
  getFormatFromHash,
  Snowflake,
  UrlQuery,
} from '../utils';

import {
  BaseStructure,
  BaseStructureData,
} from './basestructure';


export interface ApplicationDeveloper {
  id: string,
  name: string,
}

export interface ApplicationExecutable {
  arguments?: string,
  name: string,
  os: string,
}

export interface ApplicationPublisher {
  id: string,
  name: string,
}

export interface ApplicationThirdPartySku {
  distributor: string,
  id: string,
  sku: string,
}

const keysApplication: ReadonlyArray<string> = [
  'aliases',
  'application_id',
  'bot_public',
  'bot_require_code_grant',
  'cover_image',
  'description',
  'developers',
  'executables',
  'icon',
  'id',
  'guild_id',
  'name',
  'overlay',
  'overlay_compatibility_hook',
  'publishers',
  'slug',
  'splash',
  'summary',
  'third_party_skus',
  'verify_key',
  'youtube_trailer_video_id',
];

/**
 * Application Structure, used for channels, guilds, presences, etc..
 * @category Structure
 */
export class Application extends BaseStructure {
  readonly _keys = keysApplication;
  aliases: Array<string> | null = null;
  applicationId: null | string = null;
  botPublic: boolean = false;
  botRequireCodeGrant: boolean = false;
  coverImage: null | string = null;
  description: null | string = null;
  developers: Array<ApplicationDeveloper> | null = null;
  executables: Array<ApplicationExecutable> | null = null;
  icon: null | string = null;
  id: string = '';
  guildId: null | string = null;
  name: string = '';
  overlay: boolean | null = null;
  overlayCompatibilityHook: boolean | null = null;
  publishers: Array<ApplicationPublisher> | null = null;
  slug: null | string = null;
  splash: null | string = null;
  summary: null | string = null;
  thirdPartySkus: Array<ApplicationThirdPartySku> | null = null;
  verifyKey: string = '';
  youtubeTrailerVideoId: null | string = null;

  constructor(client: ShardClient, data: BaseStructureData) {
    super(client);
    this.merge(data);
  }

  get createdAt(): Date {
    return new Date(this.createdAtUnix);
  }

  get createdAtUnix(): number {
    return Snowflake.timestamp(this.id);
  }

  get iconUrl(): null | string {
    return this.iconUrlFormat();
  }

  get splashUrl(): null | string {
    return this.splashUrlFormat();
  }

  iconUrlFormat(format?: null | string, query?: UrlQuery): null | string {
    if (!this.icon) {
      return null;
    }
    const hash = this.icon;
    format = getFormatFromHash(
      hash,
      format,
      this.client.imageFormat,
    );
    return addQuery(
      Endpoints.CDN.URL + Endpoints.CDN.APP_ICON(this.id, hash, format),
      query,
    );
  }

  splashUrlFormat(format?: null | string, query?: UrlQuery): null | string {
    if (!this.splash) {
      return null;
    }
    const hash = this.splash;
    format = getFormatFromHash(
      hash,
      format,
      this.client.imageFormat,
    );
    return addQuery(
      Endpoints.CDN.URL + Endpoints.CDN.APP_ASSET(this.id, hash, format),
      query,
    );
  }
}
