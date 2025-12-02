export interface ResponseMessageModel {
  code: number;
  message: string | null;
  status: string;
  errors: any[] | null;
  meta: any | null;
  data: any | null;
}
