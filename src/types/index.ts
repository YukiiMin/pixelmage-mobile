export interface ResponseBase<T> {
  statusCode: number;
  message: string;
  data: T;
}
