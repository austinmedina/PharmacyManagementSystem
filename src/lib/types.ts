export type UserID = number;
export type productID = number;
export type patientID = number;
export type inventoryID = number;
export type logID = number;
export type purchaseLogID = number;
export type itemID = number;
export type quantity = number;

export type Prescription = {
    ID : UserID;
    productID : productID;
    patientID : patientID;
    quantity : quantity;
    period : number;
};

export type Inventory = {
    ID : inventoryID;
    productID : productID;
    expirationDate : Date;
    quantity : quantity;
};

export type LogLogLog = {
    ID : logID;
    time : Date;
    userID : UserID;
    action : Log;
}

export type purchaseLogEntry = {
    ID : purchaseLogID;
    time : Date;
    itemID : itemID;
    totalPrice : number;
    quantity : quantity;
    cartID : string;
}

