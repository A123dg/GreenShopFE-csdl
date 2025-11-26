import axiosClient from "./axiosClient";
import { from, map, Observable } from "rxjs";
import type { RegisterRequest, LoginRequest, UpdateUserRequest, UserResponse } from "../models/user";
import type { ApiResponse } from "../interfaces/ApiResponse";

const BASE_URL = `/`;

const setUserToLocalStorage = (user: UserResponse) => {
  localStorage.setItem("userId", user.userId.toString());
  localStorage.setItem("username", user.username.toString());
};

export const userApi = {
  createUser: (data: RegisterRequest): Observable<ApiResponse<UserResponse>> =>
    from(
      axiosClient
        .post<ApiResponse<UserResponse>>(`${BASE_URL}auth/register`, data)
        .then((res) => {
          // res đã là ApiResponse<UserResponse> (do interceptor trả về response.data)
          if (res?.data) setUserToLocalStorage(res.data as unknown as UserResponse);
          return res as unknown as ApiResponse<UserResponse>;
        })
    ).pipe(map((res) => res)),

  createAdmin: (data: RegisterRequest): Observable<ApiResponse<UserResponse>> =>
    from(
      axiosClient
        .post<ApiResponse<UserResponse>>(`${BASE_URL}admin`, data)
        .then((res) => {
          if (res?.data) setUserToLocalStorage(res.data as unknown as UserResponse);
          return res as unknown as ApiResponse<UserResponse>;
        })
    ).pipe(map((res) => res)),

  login: (data: LoginRequest): Observable<ApiResponse<UserResponse>> =>
    from(
      axiosClient
        .post<ApiResponse<UserResponse>>(`${BASE_URL}auth/login`, data)
        .then((res) => {
          if (res?.data) setUserToLocalStorage(res.data as unknown as UserResponse);
          return res as unknown as ApiResponse<UserResponse>;
        })
    ).pipe(map((res) => res)),

  updateUser: (id: number, data: UpdateUserRequest): Observable<ApiResponse<UserResponse>> =>
    from(
      axiosClient
        .put<ApiResponse<UserResponse>>(`${BASE_URL}auth/update/${id}`, data)
        .then((res) => res as unknown as ApiResponse<UserResponse>)
    ).pipe(map((res) => res)),

  getProfile: (): Observable<ApiResponse<UserResponse>> =>
    from(
      axiosClient
        .get<ApiResponse<UserResponse>>(`${BASE_URL}auth/profile`)
        .then((res) => res as unknown as ApiResponse<UserResponse>)
    ).pipe(map((res) => res)),

  deleteUser: (id: number): Observable<ApiResponse<boolean>> =>
    from(
      axiosClient
        .delete<ApiResponse<boolean>>(`${BASE_URL}users/${id}`)
        .then((res) => res as unknown as ApiResponse<boolean>)
    ).pipe(map((res) => res)),

  getUsers: (): Observable<ApiResponse<UserResponse[]>> =>
    from(
      axiosClient
        .get<ApiResponse<UserResponse[]>>(`${BASE_URL}users`)
        .then((res) => res as unknown as ApiResponse<UserResponse[]>)
    ).pipe(map((res) => res)),
};