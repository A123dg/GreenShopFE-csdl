import type { UserResponse } from "./user";

export interface NewsResponse {
    id : number,
    title: string,
    img: string,
    createdAt: string,
    viewCount: number,
    author: string,
    source: string,
    status: number,
    user: UserResponse,
    newsDetails: NewsDetailResponse[],
}
export interface NewsDetailResponse {
    content: string,
    status: number,
    type: number,
    contentIndex: number
}
export interface NewsRequest {
    title: string,
    img: string,
    author: string,
    source: string,
    status: number,
    userId: number,
    newsDetails: NewsDetailResponse[],
}