export interface CreateProduct{
    name: string,
    price: number,
    quantity: number,
    image: string,
    rate: 0,
    description: string,
    status: number
}
export interface ProductResponse{
    id:number
    name: string
    price: number
    quantity: number
    image: string
    rate: number
    description: string
    status:number
}