export default interface IBasicCrud<T> {
  get: (id: number) => Promise<T | null>;

  all: () => Promise<T[]>;

  find(props: Partial<T>): Promise<T | null>;

  findMany(props: Partial<T>): Promise<T[]>

  delete: (id: number) => Promise<T | null>;

  save: (instance: Partial<T>) => Promise<T>;

  update: (id: number, instance: Partial<T>) => Promise<T | null>;
}
