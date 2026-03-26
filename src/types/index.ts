export interface ResponseBase<T> {
  statusCode: number;
  message: string;
  data: T;
}

export * from './inventory';
export * from './collection';
export * from './tarot';
export * from './story';
export * from './achievement';
export * from './marketplace';
export * from './order';
