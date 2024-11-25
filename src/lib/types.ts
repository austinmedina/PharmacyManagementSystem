export type UserID = string;
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

export enum LogType {
    LogLog,
    Purchase,
    Inventory,
    Fill
}

export type User = {
    id: UserID;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    type: UserType;
    lockout: boolean;
    login_attempts: number;
    is_first_login: boolean;
};

export type Patient = {
    id: PatientID;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    phone: string;
    address: string;
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
    pickedUp: boolean;
};

export type InventoryEntry = {
    id: InventoryID;
    productID: ProductID;
    expiration: Date;
    quantity: number;
};

export type LogLogLogEntry = {
    type: LogType.LogLog;
    id: LogID;
    time: Date;
    userID: UserID;
    action: Log;
};

export type PurchaseLogEntry = {
    type: LogType.Purchase;
    id: PurchaseLogID;
    time: Date;
    itemID: ItemID;
    totalPrice: number;
    quantity: number;
    cartID: string;
};

export type InventoryLogEntry = {
    type: LogType.Inventory;
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
    type: LogType.Fill;
    id: FillLogID;
    time: Date;
    prescriptionID: PrescriptionID;
    userID: UserID;
};

export type Searchable = {
    name: string;
    id: number;
};

export type CartEntry = {
    id: number;
    name: string;
    type: ProductType;
    price: number;
    totalQuantity: number;
    numExpired: number;
    numExpiringSoon: number;
    quantity: number;
};

export type LogEntry =
    | (LogLogLogEntry & {name: string; username: string})
    | (PurchaseLogEntry & {name: string})
    | (InventoryLogEntry & {name: string})
    | (FillLogEntry & {
          name: string;
          username: string;
          patientID: number;
          patient: string;
      });
