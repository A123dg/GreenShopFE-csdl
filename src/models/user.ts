export interface UserResponse{
    userId : number;
    username: string;
    email: string;
    dob: string;
    role: string;
     
}
export interface RegisterRequest{
    username: string;
    email: string;
    dob: string;
    password: string;
}
export interface LoginRequest{
    username: string;
    password: string;
}
export interface UpdateUserRequest{
    email? : string;
    username?: string;
    password?: string;
    dob?:string | null;
}