export interface createProductDTO {
    name: string;
    description: string;
    price: number;
    stock: number;
} 

export interface updateProductDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
}