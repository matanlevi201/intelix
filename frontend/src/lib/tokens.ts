export class Tokens {
  static parseJWT(token: string) {
    const payload = token.split(".")[1];
    if (!payload) return;
    const decodedPayload = atob(payload);
    const data = JSON.parse(decodedPayload);
    if (Tokens.isExpired(data?.exp)) return;
    return data;
  }

  static isExpired(exp: number) {
    const currentTime = Math.floor(Date.now() / 1000);
    return exp <= currentTime;
  }

  static resolveCookie(key: string) {
    const regex = new RegExp(`${key}=([^;]*)`);
    const match = document.cookie.match(regex);
    return match?.[1] ?? "";
  }
}
