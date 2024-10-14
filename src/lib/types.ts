export type UserID = number;
export type ProductID = number;
export type PatientID = number;
export type PrescriptionID = number;
export type InventoryID = number;
export type LogID = number;
export type PurchaseLogID = number;
export type InventoryLogID = number;
export type ItemID = number;
export type FillLogID = number;

export enum UserType {
    Manager,
    Pharmacist,
    Cashier,
    Technician
}

export enum ProductType {
    Prescription,
    NonPrescription
}

export enum InventoryAction {
    In,
    Out
}

export enum Log {
    In,
    Out
}

export type User = {
    id: UserID;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    type: UserType;
};

export type Patient = {
    id: PatientID;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    phone: string;
    insurance: boolean;
};

export type MinimalPrescription = {
    id: PrescriptionID;
    productID: ProductID;
    patientID: PatientID;
    quantity: number;
    period: number;
    filled: boolean;
};

export type Prescription = {
    id: PrescriptionID;
    product: Product;
    patient: Patient;
    quantity: number;
    period: number;
    filled: boolean;
};

export type InventoryEntry = {
    id: InventoryID;
    productID: ProductID;
    expirationDate: Date;
    quantity: number;
};

export type LogLogLogEntry = {
    id: LogID;
    time: Date;
    userID: UserID;
    action: Log;
};

export type PurchaseLogEntry = {
    id: PurchaseLogID;
    time: Date;
    itemID: ItemID;
    totalPrice: number;
    quantity: number;
    cartID: string;
};

export type InventoryLogEntry = {
    id: InventoryLogID;
    time: Date;
    productID: ProductID;
    action: InventoryAction;
    quantity: number;
};

export type Product = {
    id: ProductID;
    name: string;
    type: ProductType;
    price: number;
};

export type FillLogEntry = {
    id: FillLogID;
    time: Date;
    prescriptionID: PrescriptionID;
    userID: UserID;
};

export type Searchable = {
    name: string;
    id: number;
};
