class SingletonPattern {

    static #instance: SingletonPattern  = new SingletonPattern();

    private constructor() {

    }

    getName() {
        return 'qlniu'
    }

    public static getInstance() {
        return SingletonPattern.#instance;
    }
}

const singletonInstance = SingletonPattern.getInstance();
export default singletonInstance;