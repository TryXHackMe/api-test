export interface createCartDTO {
    quantity: number;
    product_id: number;
}

export interface updateCartDTO {
    id?: number;
    quantity: number;
    product_id: number;
    is_active: string;
}