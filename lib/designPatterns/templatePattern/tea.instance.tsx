import TeaBase from './abstract.tea';

class Tea extends TeaBase{

    brew() {
        console.log('dripping coffee through filter');
    }

    addComdiments() {
        console.log('add sugar and milk');
    }
}

export default Tea;