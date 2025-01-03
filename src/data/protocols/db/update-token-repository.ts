export interface IUpdateTokenRepository {
  update(id: string, token: string): Promise<void>
}