import React, { useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import * as echarts from "echarts";

interface Props {}

const value = 11000;
const title = "数量";

function _dashed() {
  let dataArr = [];
  for (var i = 0; i < 100; i++) {
    if (i % 2 === 0) {
      dataArr.push({
        name: (i + 1).toString(),
        value: 20,
        itemStyle: {
          normal: {
            color: "rgb(0,255,255,.3)",
          },
        },
      });
    } else {
      dataArr.push({
        name: (i + 1).toString(),
        value: 20,
        itemStyle: {
          normal: {
            color: "rgb(0,0,0,0)",
            borderWidth: 1,
            borderColor: "rgba(0,255,255,1)",
          },
        },
      });
    }
  }
  return dataArr;
}

const titleConfig = {
  fontSize: 18,
  color: "#fff",
  fontWeight: "400",
  fontFamily: "YouSheBiaoTiHei",
};
const defaultConfig: any = {
  size: 300,
  title: titleConfig,
  textStyle: {
    rich: {
      a: {
        ...titleConfig,
      },
      b: {
        ...titleConfig,
        fontSize: 12,
        padding: [5, 0],
        fontFamily: "Microsoft YaHei UI",
      },
    },
  },
  legendData: ["1", "2"],
  color: ["#00D8E0", "#3E9AFF"],
};

const PieComponent: React.FunctionComponent<Props> = () => {
  useEffect(() => {}, []);
  const { legendData, color, size } = defaultConfig;
  const option = {
    
    title: {
      zlevel: 0,
      text: `{a|${value}}\n{b|${title}}`,
      x: "center",
      y: "center",
      textStyle: {
        ...defaultConfig.textStyle,
      },
    },
    color,
    series: [
      // 数据圆环配置
      {
        type: "pie",
        startAngle: "0",
        zlevel: 10,
        name: "数量",
        radius: ["80%", "91%"],
        emphasis: {
          scale: false,
        },
        clockWise: false,
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },

        labelLine: {
          show: false,
        },

        data: [
          { value: 10000, name: "1" },
          { value: 1000, name: "2" },
        ],
      },
      // 指针线
      {
        type: "gauge",
        zlevel: 0,
        radius: "80%",
        clockwise: false,
        startAngle: "0",
        endAngle: "360",
        splitNumber: 30,
        detail: {
          offsetCenter: [0, -20],
          formatter: " ",
        },
        pointer: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [0, "rgba(255,255,255,0)"],
              [36.7 / 100, "rgba(255,255,255,0)"],
              [1, "rgba(255,255,255,0)"],
            ],
            width: 20,
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          length: size * 0.7,
          lineStyle: {
            shadowBlur: 4,
            shadowColor: "#00D8E0",
            shadowOffsetY: "0",
            color: "#344A6F",
            width: 0.8,
          },
        },
        axisLabel: {
          show: false,
        },
      },
      // 中心圆环
      {
        type: "pie",
        zlevel: 0,
        radius: [0, "47%"],
        emphasis: {
          scale: false,
        },
        clockWise: false,
        itemStyle: {
          normal: {
            shadowBlur: 20,
            shadowColor: "#000",
            borderColor: "#00D8E0",
            borderWidth: "0.5",
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              {
                offset: 0,
                color: "#00D8E0",
              },
              {
                offset: 0.44,
                color: "rgba(0, 216, 224, 0.5)",
              },
              {
                offset: 1,
                color: "#000",
              },
            ]),
          },
        },
        // background: radial-gradient(68.63% 67.61% at 50% 50%, #00D8E0 0%, rgba(0, 216, 224, 0.5) 43.64%, #000000 100%);
        label: {
          show: false,
        },
        data: [100],
      },
      // 链型圆环
      {
        type: "pie",
        radius: ["65%", "66%"],
        emphasis: {
          scale: false,
        },
        clockWise: false,

        itemStyle: {
          normal: {
            color: "red",
          },
        },
        label: {
          show: false,
        },
        data: _dashed(),
      },
      // 外围圆环线
      {
        type: "pie",
        radius: ["95%", "96.5%"],
        emphasis: {
          scale: false,
        },
        clockWise: false,
        itemStyle: {
          normal: {
            shadowBlur: 20,
            shadowColor: "rgba(0, 216, 224,.3)",
            color: "rgba(0, 216, 224, 0.24)",
          },
        },
        label: {
          show: false,
        },
        data: [100],
      },
      // 外围圆环线
      {
        type: "pie",
        radius: ["98.5%", "100%"],
        emphasis: {
          scale: false,
        },
        clockWise: false,
        itemStyle: {
          normal: {
            shadowBlur: 20,
            shadowColor: "rgba(0, 255, 255,.3)",
            color: "rgba(0, 255, 255,.3)",
          },
        },
        label: {
          show: false,
        },
        data: [100],
      },
    ],
  };

  return (
    <div className="flex flex-col justify-around items-center">
      <ReactEcharts
        option={option}
        style={{ height: `${size}px`, width: `${size}px` }}
      />
      <div className="flex pt-[8px]">
        {legendData.map((item: string, i: number) => (
          <div className="flex items-center pr-[10px]" key={item}>
            <span
              className="inline-block w-[8px] h-[8px] rounded-[8px]"
              style={{ backgroundColor: color[i] }}
            />
            <span className="text-ft11 pl-[5px]" style={{ color: color[i] }}>
              {item}
            </span>
            <span className="text-ft14 pl-[5px] font-YouSheBiaoTiHei leading-[18px]">
              {100}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PieComponent;
