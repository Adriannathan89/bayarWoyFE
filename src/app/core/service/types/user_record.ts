import { Record } from "./record";

export type UserRecord = {
    expenses: Record[],
    incomes: Record[],
    debts: Record[],
    cash: number,
    debt: number,
    receivable: number,
}