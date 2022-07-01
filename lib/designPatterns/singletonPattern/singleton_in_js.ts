class Singleton {
  constructor() {}

  method1() {
    console.log('method1')
  }

  method2() {
    console.log('method2')
  }
}

const singletonInstance = new Singleton();
Object.freeze(singletonInstance);


export default singletonInstance;