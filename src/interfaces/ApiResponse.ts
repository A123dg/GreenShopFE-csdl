export interface ApiResponse<T>
{
  userId: any;
  username(arg0: string, username: any): unknown;
  id: any;
  success: boolean;
  data: T;
  error?: string;
  message: string;

}