import React from 'react';
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
} from 'react-native-responsive-linechart-patch';
import {View} from 'react-native';
function ChartRes(props: any) {
  return (
    <View>
      <Chart
        style={{height: 200, width: '100%'}}
        data={props.getData}
        padding={{left: 40, bottom: 20, right: 20, top: 20}}
        xDomain={{min: 0, max: props.getData.length}}
        yDomain={{min: 0, max: 250}}
        viewport={{
          size: {
            width: 5,
          },
        }}>
        <VerticalAxis
          tickValues={[0, 75, 125, 200, 250]}
          theme={{
            axis: {stroke: {color: 'black', width: 2}},
            ticks: {stroke: {color: 'grey', width: 2}},
            labels: {formatter: (v: number) => v.toFixed(0)},
          }}
        />
        <HorizontalAxis
          tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
          theme={{
            axis: {stroke: {color: '#aaa', width: 2}},
            ticks: {stroke: {color: '#aaa', width: 2}},
            labels: {formatter: v => v.toFixed(2)},
          }}
        />
        <Line
          theme={{
            stroke: {color: 'red', width: 2},
          }}
          smoothing="cubic-spline"
        />
        <Area
          theme={{
            gradient: {
              from: {color: '#f39c12', opacity: 0.4},
              to: {color: '#f39c12', opacity: 0.4},
            },
          }}
          smoothing={'cubic-spline'}
        />
      </Chart>
    </View>
  );
}

export default ChartRes;
