export interface TokenDto {
  id: string;
  username: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: TokenDto;
}
