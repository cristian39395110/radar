import { FC } from "react";
import { GraphData } from "../Measures/types/DataGenerator";
import { Chart, registerables } from "chart.js";
import { Chart as Plot } from "react-chartjs-2";

interface Props {
  data?: GraphData;
  yLabel?: string;
}

Chart.register(...registerables);

const InfoChart: FC<Props> = ({ data, yLabel }) => {
  if (!data) {
    return <></>;
  }
  return (
    <div style={{ flexBasis: "5rem", flexGrow: 1 }}>
      <Plot
        data={data}
        options={{
          scales: {
            xAxis: {
              title: {
                display: true,
                text: "Tiempo [s]",
                font: {
                  size: 15,
                },
              },
            },
            yAxis: {
              title: {
                display: true,
                text: yLabel,
                font: {
                  size: 15,
                },
              },
              suggestedMin: 0,
              suggestedMax: 0,
            },
          },
        }}
        type="line"
      />
    </div>
  );
};

export default InfoChart;
