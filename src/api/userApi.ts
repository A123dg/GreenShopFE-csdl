import axiosClient from "./axiosClient";
import { from, map, Observable } from "rxjs";
import type { RegisterRequest, LoginRequest, UpdateUserRequest, UserResponse } from "../models/user";
import type { ApiResponse } from "../interfaces/ApiResponse";

const BASE_URL = `/`;

export const userApi = {
  createUser: (data: RegisterRequest): Observable<ApiResponse<UserResponse>> =>
    from(
      axiosClient
        .post<ApiResponse<UserResponse>>(`${BASE_URL}auth/register`, data)
        .then((r) => r as unknown as ApiResponse<UserResponse>)
    ).pipe(map((res) => res)),
    createAdmin: (data: RegisterRequest): Observable<ApiResponse<UserResponse>> =>
    from(
      axiosClient
        .post<ApiResponse<UserResponse>>(`${BASE_URL}admin`, data)
        .then((r) => r as unknown as ApiResponse<UserResponse>)
    ).pipe(map((res) => res)),

  login: (data: LoginRequest): Observable<ApiResponse<string>> =>
    from(
      axiosClient
        .post<ApiResponse<string>>(`${BASE_URL}auth/login`, data)
        .then((r) => r as unknown as ApiResponse<string>)
    ).pipe(map((res) => res)),

  updateUser: (id :number,data: UpdateUserRequest): Observable<ApiResponse<UserResponse>> =>
    from(
      axiosClient
        .put<ApiResponse<UserResponse>>(`${BASE_URL}auth/update/${id}`, data)
        .then((r) => r as unknown as ApiResponse<UserResponse>)
    ).pipe(map((res) => res)),

  getProfile: (): Observable<ApiResponse<UserResponse>> =>
  from(
    axiosClient
      .get<ApiResponse<UserResponse>>(`${BASE_URL}auth/profile`)
      .then((r) => r as unknown as ApiResponse<UserResponse>)
  ).pipe(map((res) => res)),
deleteUser: (id: number): Observable<ApiResponse<boolean>> =>
  from(
    axiosClient
      .delete<ApiResponse<boolean>>(`${BASE_URL}users/${id}`)
      .then((r) => r as unknown as ApiResponse<boolean>)
  ).pipe(map((res) => res)),
    
  getUsers: (): Observable<ApiResponse<UserResponse[]>> =>
    from(
      axiosClient
        .get<ApiResponse<UserResponse[]>>(`${BASE_URL}users`)
        .then((r) => r as unknown as ApiResponse<UserResponse[]>)
    ).pipe(map((res) => res)),
};
