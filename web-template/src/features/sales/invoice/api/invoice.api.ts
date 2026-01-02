// features/accounts/invoice/apis/invoice.api.ts
import axios from "@/core/http/axiosInstance";
import type { PagedResult } from "@/core/types/paged-result";
import type {
  CreateInvoiceRequest,
  CreateInvoiceResponse,
  InvoiceDto,
  InvoiceDetailDto,
  UpdateInvoiceRequest,
  GetInvoicesRequest,
  AddInvoiceLineRequest,
  AvailableSalesRecordDto,
  AddInvoiceLinesFromSalesRecordsRequest,
  AddInvoiceLinesFromSalesRecordsResult,
  CreateFromSalesRecordsRequest,
  CreateFromSalesRecordsResponse 
} from "@/features/sales/invoice/types/dto";

/**
 * Invoice API in object-method style.
 * - Strict typing, no `any`
 * - Encodes path params
 * - Leaves undefined query params out
 */
export const invoiceApi = {
  /** 建立一張 Draft 發票（不含明細） */
  async create(input: CreateInvoiceRequest): Promise<CreateInvoiceResponse> {
    const { data } = await axios.post<CreateInvoiceResponse>("/invoices", input);
    return data;
  },

  /** 更新發票（僅 Draft 可更新，依你的後端規則） */
  async update(id: string, input: UpdateInvoiceRequest): Promise<void> {
    const url = `/invoices/${encodeURIComponent(id)}`;
    await axios.put(url, input);
  },

  /** 刪除發票（依後端規則可能為軟刪／僅限 Draft） */
  async delete(id: string): Promise<void> {
    const url = `/invoices/${encodeURIComponent(id)}`;
    await axios.delete(url);
  },

  /** 取得分頁清單 */
  async getList(req: GetInvoicesRequest): Promise<PagedResult<InvoiceDto>> {
    // 過濾 undefined / null 參數，避免髒 querystring
    const params: Record<string, string | number | boolean> = {};
    (Object.keys(req) as Array<keyof GetInvoicesRequest>).forEach((key) => {
      const v = req[key];
      if (v !== undefined && v !== null) {
        // 若有日期或複合型別，請先在呼叫端處理成字串
        params[String(key)] = v as unknown as string | number | boolean;
      }
    });
    const { data } = await axios.get<PagedResult<InvoiceDto>>("/invoices", { params });
    return data;
  },

  /** 取得明細 */
  async getDetail(id: string): Promise<InvoiceDetailDto> {
    const url = `/invoices/${encodeURIComponent(id)}`;
    const { data } = await axios.get<InvoiceDetailDto>(url);
    return data;
  },

  /** 在 Draft 中新增一筆明細 */
  async addInvoiceLine(invoiceId: string, input: AddInvoiceLineRequest): Promise<void> {
    const url = `/invoices/${encodeURIComponent(invoiceId)}/lines`;
    await axios.post(url, input);
  },

  /** 移除一筆明細（僅 Draft） */
  async removeInvoiceLine(invoiceId: string, lineId: string): Promise<void> {
    const url = `/invoices/${encodeURIComponent(invoiceId)}/lines/${encodeURIComponent(lineId)}`;
    await axios.delete(url);
  },

  /**
   * 取得「依據 InvoiceId，可加入此發票的 SalesRecords」（已 Approved、未 Invoiced、同 Partner & Currency）
   * GET /invoices/{invoiceId}/available-sales-records
   */
  getAvailableSalesRecords: async (invoiceId: string): Promise<AvailableSalesRecordDto[]> => {
    const { data } = await axios.get<AvailableSalesRecordDto[]>(
      `/invoices/${encodeURIComponent(invoiceId)}/available-sales-records`
    );
    return data;
  },
  /**
   * 從 SalesRecord 新增一筆發票明細
   * POST /invoices/{invoiceId}/lines:add-from-sales-record
   */
  addLineFromSalesRecord: async (invoiceId: string, salesRecordId: string): Promise<void> => {
    await axios.post(`/invoices/${encodeURIComponent(invoiceId)}/lines:add-from-sales-record`, {
      salesRecordId,
    });
  },

  /** 批次：把多個 SalesRecords 加入發票明細 */
  addLinesFromSalesRecords: async (
    invoiceId: string,
    salesRecordIds: string[]
  ): Promise<AddInvoiceLinesFromSalesRecordsResult> => {
    const payload: AddInvoiceLinesFromSalesRecordsRequest = { salesRecordIds };
    const { data } = await axios.post<AddInvoiceLinesFromSalesRecordsResult>(
      `/invoices/${encodeURIComponent(invoiceId)}/lines:add-from-sales-records`,
      payload
    );
    return data;
  },

  async createFromSalesRecords(
    payload: CreateFromSalesRecordsRequest
  ): Promise<CreateFromSalesRecordsResponse> {
    const { data } = await axios.post<CreateFromSalesRecordsResponse>(
      "/invoices/create-from-sales-records",
      payload
    );
    return data;
  },

  async createReceivableFromInvoice(invoiceId: string): Promise<string> {
    const res = await axios.post(`/invoices/${invoiceId}/receivables`);
    // 後端可能回傳 { id: "guid" } 或直接回傳字串 guid，兩者都處理
    const data = res.data as unknown;
    if (typeof data === "string") {
      return data;
    }
    if (data && typeof (data as { id?: string }).id === "string") {
      return (data as { id: string }).id;
    }
    return "";
  },

  /** 發票過帳（只需 postingDate；格式必須是 YYYY-MM-DD 以符合 .NET DateOnly） */
  async postInvoice(id: string, postingDate: string): Promise<void> {
    const url = `/invoices/${encodeURIComponent(id)}/post`;
    await axios.post(url, { postingDate }); // 別再用 ISO8601 DateTime
  },
};

export type InvoiceApi = typeof invoiceApi;
export default invoiceApi;
