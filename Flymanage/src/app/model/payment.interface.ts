export interface Payment {
    id: number;
    paymentDate: string;
    amount: number;
    method: string;
    transactionCode: string;
    bookingIds: number[];
}

export interface PaymentCreateDTO {
    paymentDate?: Date;
    amount: number;
    method: PaymentMethod;
    bookingIds: number[];
}

export enum PaymentMethod {
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    BANK_TRANSFER = 'BANK_TRANSFER'
} 