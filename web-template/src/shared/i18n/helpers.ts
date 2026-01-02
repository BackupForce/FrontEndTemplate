import i18n from '.';
import type { TOptions } from 'i18next';

export const tUser = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'user', ...options });

export const tCommon = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'common', ...options });

export const tCompany = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'company', ...options });

export const tPartner = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'partner', ...options });

export const tReceivable = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'receivable', ...options });

export const tPayable = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'payable', ...options });

export const tIncome = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'income', ...options });

export const tCashTrans = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'cashtrans', ...options });

export const tReconciliation = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'reconciliation', ...options });

export const tEntry = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'reconciliation', ...options });

export const tFinancialAccount = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'financialaccount', ...options });

export const tExpenseEntry = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'expenseEntry', ...options });

export const tSalesRecord = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'salesRecord', ...options });

export const tCreditCase = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'creditCase', ...options });

export const tInvoice = (key: string, options?: TOptions) =>
  i18n.t(key, { ns: 'invoice', ...options });