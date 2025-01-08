export interface IUpdateTokenRepository {
  updateToken(id: string, token: string): Promise<void | null>
}