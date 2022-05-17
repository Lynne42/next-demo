import React, { useEffect } from 'react';
import PieComponent from '@/components/echarts/pie';
import RingComponent from '@/components/echarts/ring';

interface Props {

}
const EchartsPage: React.FunctionComponent<Props> = () => {
    useEffect(() => {
     
     }, [])
    return (
        <section className='bg-[#000] h-full w-full'>
            <ul className='w-2/3 m-auto '>
                <li className='w-[300px] m-1'><PieComponent/></li>
                <li className='w-[300px] m-1'><RingComponent/></li>
            </ul>
        </section>
    );
};
export default EchartsPage;