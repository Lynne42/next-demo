class SingleDefault {
  private static uniqueSingle: SingleDefault;

  public static getInstance() {
    if (!SingleDefault.uniqueSingle) {
      SingleDefault.uniqueSingle = new SingleDefault();
    }
    return SingleDefault.uniqueSingle;
  }

  public test() {
    console.log('SingleDefault test')
  }
}

export default SingleDefault;


/**
// 多线程优化

- 在类创建的同时创建一个实例
class SingleDefault {
  private static uniqueSingle: SingleDefault = new SingleDefault();

  public static getInstance() {
    return SingleDefault.uniqueSingle;
  }

  public test() {
    console.log('SingleDefault test')
  }
}

*/