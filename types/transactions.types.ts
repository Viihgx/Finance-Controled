export interface TransactionsTypes {
    id?: string;
    type?: string;
    category?: string;
    amount: string;
    description?: string;
}

export interface TransactionsTypesResponse {
    message: TransactionsTypes[];
}

export interface TransactionsSumTypes {
    id?: string;
    amount: string;
}

export interface TransactionsSumTypesResponse {
    message: TransactionsTypes[];
}