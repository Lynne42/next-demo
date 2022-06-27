export interface Observer {
    update(o: Observer, arg?: any): void
}