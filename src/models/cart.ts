export interface CartItemResponse {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
}

export interface CartResponse {
    id: number;
    userId: number;
    items: CartItemResponse[];
    totalValue: number;
    totalQuantity: number;
}

export interface CartDecreaseRequest{
    userId:number;
    productId:number;
    quantity:number;
}
export interface CartAddRequest{
    userId:number;
    productId:number;
    quantity:number;
}