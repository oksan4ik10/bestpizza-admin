export interface IDavdamer {
    id: number;
    name: string;
    last_name: string;
    image: string;
}

export interface IProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;

}
export interface ICategoryAPI {
    id: number,
    name: string;
    full_name: string;
    children: {
        id: number,
        name: string
    }[]
}
export interface IAttrAPI {
    code: string,
    name: string
}
export interface IProductClassesAPI {
    slug: string,
    name: string
}


export interface ICart {
    id: string;
    count: number;
    idRes: number;
    price: number;
    name: string;
    img: string
}

export type TStatusOrder = "NEW" | "PAID" | "PROCESSING" | "SENT" | "DELIVERED" | "REFUND" | "CANCELLED" | "READY"
export interface IOrder {
    address: string,
    comment: string,
    name: string,
    phone: string
    status: string,
    pay: "cash" | "card",
    uid: string,
    order: ICart[],
    date: Date,
    id: string,
    totalPrice: number

}

export interface IOrderInfo extends IOrder {
    lines: {
        product: IProduct,
        quantity: number,
        unit_price_incl_tax: string,
        measurement: string,
    }[]
}
interface IStatusOrder {
    [key: string]: string
}
export const statusOrder: IStatusOrder = {
    NEW: "Заказ оформлен",
    PAID: "Заказ оплачен",
    PROCESSING: "Сборка заказа",
    SENT: "Курьер в пути",
    DELIVERED: "Заказ выдан",
    CANCELLED: "Заказ отменен",
}

export const statusOrderColor: IStatusOrder = {
    NEW: "#8D989E",
    PAID: "#B37B00",
    PROCESSING: "#FFC448",
    SENT: "#009150",
    DELIVERED: "#004B2A",
    REFUND: "#9B2D30",
    CANCELLED: "#D24950",
    READY: "#D4E0FA"
}


export interface IGkAPI {
    id: number;
    name: string;
}