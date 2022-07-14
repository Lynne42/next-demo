export default interface Observer {
    update(o: Observer, arg?: any): void
}