import ImageProxy from './image.proxy.interface';

class ImageReal implements ImageProxy {
    getHeight() {
        return 200;
    }
    getWidth() {
        return 200;
    }
    printImage() {
        console.log('this is a image')
    }
}

export default ImageReal;