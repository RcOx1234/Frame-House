export interface Producto {
    id: string;
    nombre: string;
    precio: number;
}

export interface PlanOption {
    value: string;
    price: number;
    name: string;
    label: string;
}

export interface CotizacionData {
    nombre: string;
    email: string;
    empresa: string;
    plan: string;
    precioPlan: string;
    productos: Producto[];
}