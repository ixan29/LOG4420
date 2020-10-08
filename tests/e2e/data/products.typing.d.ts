export interface products {
    id: number,
    name: string,
    price: number,
    image: string,
    category: string,
    description?: string,
    features?: string[],
    quantity?: number
}