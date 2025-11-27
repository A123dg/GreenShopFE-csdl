export interface OrderResponse{
   id:  number,
   userId: number,
   userName: string,
   note: string,
   totalPrice: number,
   status: number,
   createAt: string,
   orderDetails: OrderDetailsResponse
}
export interface OrderDetailsResponse{
    id: number,
    productId: number,
    productName: string,
    quantity: number,
    price: number,
    status: number,
}
export interface OrderRequest {
    userId: number,
    note: string,
    orderDetails: OrderDetailRequest
}
export interface OrderDetailRequest{
    productId: number,
    quantity: number
}