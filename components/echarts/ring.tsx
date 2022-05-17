import React, { useEffect } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

const defaultConfig = {
  size: 300,
  color: ['#00D8E0', '#3E9AFF', '#FFD747', '#C17DFD'],
  data: [
    {
      name: '1',
      value: 1,
    },
    {
      name: '2',
      value: 30,
    },
    {
      name: '3',
      value: 13,
    },
    {
      name: '4',
      value: 7,
    },
  ],
};

const title = '类型';

interface Props {}
const RingComponent: React.FunctionComponent<Props> = () => {
  useEffect(() => {}, []);
  const { size, color, data } = defaultConfig;

  const option = {
    color,
    tooltip: {
      trigger: 'item',
      backgroundColor: 'background: rgba(0, 0, 0, 0.6)',
      padding: 0,
      borderWidth: 0,
      borderRadius: '2px',

      formatter: (params: any) => {
        console.log(1, params);
        if (params.seriesName !== 'real_data') {
          return '';
        }
        let dataStr = `<div style="background: rgba(0, 0, 0, 0.6);border-radius: 2px; padding: 5px;color: #FFFFFF;font-size: 12px;">
        <div style="display:flex;align-items:center;">
          <span style="width:6px;height:6px;background-color:${params.color};border-radius: 6px;"></span>
          <p style="font-size: 12px;transform: scale(0.833333);font-family: 'Microsoft YaHei UI';margin: 0;padding-left: 2px;">${params.name}</p>
        </div>`;
        dataStr += `<div style="margin: 0 8px;">
            
        <span style="">${params.value}</span>
        <span style="margin-left:2px;">(${Number(params.percent).toFixed(
          0,
        )}%)</span>
      </div></div>`;
        return dataStr;
      },
    },
    title: [
      {
        text: `{name|${title}}`,
        top: 'center',
        left: 'center',
        textStyle: {
          rich: {
            name: {
              fontSize: 12,
              fontFamily: 'Microsoft YaHei UI',
              color: '#ffffff',
            },
          },
        },
      },
    ],
    series: [
      {
        type: 'pie',
        name: 'show_style',
        zlevel: 0,
        radius: [0, '32.5%'],
        emphasis: {
          scale: false,
        },
        clockWise: false,
        itemStyle: {
          normal: {
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              {
                offset: 0,
                color: 'rgba(0, 216, 224, 0.6)',
              },
              {
                offset: 0.44,
                color: 'rgba(0, 216, 224, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(45, 153, 255, 0)',
              },
            ]),
          },
        },

        label: {
          show: false,
        },
        data: [100],
      },
      {
        type: 'pie',
        name: 'real_data',
        clockWise: false,
        roseType: 'radius',
        radius: ['38.8%', '96.5%'],
        center: ['50%', '50%'],
        data,
        emphasis: {
          scale: false,
        },
        itemStyle: {
          normal: {},
        },
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
      },
    ],
  };

  return (
    <section className="flex justify-around items-center">
      <ReactEcharts
        option={option}
        style={{ height: `${size}px`, width: `${size}px` }}
      />
      <div className="ml-[16px]">
        {data.map((item: any, i: number) => (
          <div className="flex flex-col w-[128px] pb-[10px]" key={item.name}>
            <div className="flex items-center justify-between pr-[10px] h-[18px] pb-[2px]">
              <div className="flex items-center h-[18px]">
                <div
                  className="inline-block w-[12px] h-[12px] rounded-[12px]"
                  style={{ backgroundColor: color[i] }}
                />
                <div
                  className="text-ft11 pl-[5px] leading-[18px]"
                  style={{ color: color[i] }}
                >
                  {item.name}
                </div>
              </div>
              <div className="text-ft14 pl-[5px] font-YouSheBiaoTiHei leading-[18px]">
                {100}
              </div>
            </div>
            <div className="w-full h-[3px] bg-[url('/img/line.png')] bg-cover bg-no-repeat" />
          </div>
        ))}
      </div>
    </section>
  );
};
export default RingComponent;
