export default interface IBasicCrud<T> {
  get(id: number): Promise<T>;

  all(): Promise<T[]>;

  delete(id: number): Promise<T>;

  save(instance: Partial<T>): Promise<T>;

  update(id: number, instance: Partial<T>): Promise<T>;
}
