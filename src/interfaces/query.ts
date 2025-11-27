export interface VoucherQuery{
    search?: string;
    status?: number;
    discount?: number;
}
export interface NewsQuery{
    title? :string,
    author?: string,
    source?:string,
}
export interface ProductQuery{
    name?: string,
    status?:number,
    price?:number

}
