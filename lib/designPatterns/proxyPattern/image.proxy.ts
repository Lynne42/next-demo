import ImageProxyInterface from "./image.proxy.interface";
import ImageReal from "./image.real";

class ImageProxy implements ImageProxyInterface {
  image: ImageReal;
  url: string = "";

  constructor(url: string) {
    this.url = url;
  }

  getHeight() {
    if (this.image) {
      return this.image.getHeight();
    }
    return 200;
  }

  getWidth() {
    if (this.image) {
      return this.image.getWidth();
    }
    return 200;
  }

  printImage() {
    if (this.image) {
      console.log(this.getHeight(), this.getWidth(), this.image.printImage());
    } else {
      console.log("loading...");

        this.image = new ImageReal();
      console.log(this.getHeight(), this.getWidth(), this.image.printImage());
    }
  }
}

export default ImageProxy;
