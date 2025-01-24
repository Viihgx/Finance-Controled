export interface TransactionsTypes {
    id?: string;
    type: string;
    saldo_total: string;
    salary: string;
    category: string;
    amount: string;
    description: string;
}

export interface TransactionsTypesResponse {
    message: TransactionsTypes[];
}