export interface VoucherResposne{
    expireAt: any;
    id : number;
    code: string;
    discount: number;
    createAt : string;
    quantity: number,
    usedQuantity: number,
    status: number

}
export interface VoucherRequest{
    code: string;
    discount: number,
    expireAt: string,
    quantity: number,
    usedQuantity: number,
    status: number;
    
}