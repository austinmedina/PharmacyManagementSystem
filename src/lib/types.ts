export type UserID = number;
export type ProductID = number;
export type PatientID = number;
export type InventoryID = number;
export type LogID = number;
export type PurchaseLogID = number;
export type InventoryLogID = number;
export type ItemID = number;
export type quantity = number;

export enum UserType {
    Manager,
    Pharmacist,
    Cashier,
    Technician
};

export enum ProductType {
    Prescription,
    NonPrescription    
};

export enum InventoryAction {
    In,
    Out
};

export enum Log {
    In,
    Out
};

export type Prescription = {
    id : UserID;
    productID : ProductID;
    patientID : PatientID;
    quantity : quantity;
    period : number;
};

export type Inventory = {
    id : InventoryID;
    productID : ProductID;
    expirationDate : Date;
    quantity : quantity;
};

export type LogLogLog = {
    id : LogID;
    time : Date;
    userID : UserID;
    action : Log;
};

export type PurchaseLogEntry = {
    id : PurchaseLogID;
    time : Date;
    itemID : ItemID;
    totalPrice : number;
    quantity : quantity;
    cartID : string;
};

export type InventoryLogEntry = {
    id: InventoryLogID;
    time: Date;
    product: ProductID;
    action: InventoryAction;
    quantity: number;
}

export type Products = {
    id: ProductID;
    name: string;
    type: ProductType;
    price: number;
};
