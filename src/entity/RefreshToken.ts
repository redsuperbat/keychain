import { DateTime } from 'luxon';
export type RefreshToken = {
  id: string;
  userId: string;
  jwtId: string;
  used: boolean;
  invalidated: boolean;
  expiryDate: Date;
  creationDate: Date;
  updateDate: Date;
};

export namespace RefreshToken {
  export function usedOrInvalidated(token: RefreshToken): boolean {
    return token.invalidated || token.used;
  }
  export function expired(refreshToken: RefreshToken): boolean {
    return DateTime.fromJSDate(refreshToken.expiryDate) < DateTime.now();
  }
}
