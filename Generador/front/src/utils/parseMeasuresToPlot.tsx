import {
  DataGenerator,
  GraphData,
  GraphDataset,
} from "../Measures/types/DataGenerator";
import { indexOfPoint } from "../Measures/utils/indexOfPoint";

const colors = [
  "rgb(90, 90,255)",
  "rgb(255, 90, 90)",
  "rgb(90, 255, 90)",
  "rgb(90, 250, 250)",
  "rgb(250, 250, 90)",
  "rgb(250, 90, 250)",
];

export const sampleToGraphData: DataGenerator = (data, field, label, rects) => {
  if (data.length === 0) {
    return {} as any;
  }
  const initialTime = data[0].timeRef;
  const labels: string[] = [];

  const times = data.map((x) => x.timeRef);
  const max = Math.max(...times);

  const rectsDatasetsEntries = rects?.map(({ value, label }, i) => {
    return [
      label,
      {
        data: [
          {
            x: 0,
            y: value,
          },
          {
            x: parseTime(max, initialTime),
            y: value,
          },
        ],
        label,
      },
    ];
  });

  const datasets: Record<string, GraphDataset> = {
    ...Object.fromEntries(rectsDatasetsEntries || []),
    data: {
      //borderColor: "#00000000",
      //backgroundColor: colors[0],
      data: [],
      label,
    },
    upperEnvelepe: {
      //borderColor: colors[1],
      //backgroundColor: colors[1],
      data: [],
      label: "Envolvente superior",
    },
    lowerEnvelepe: {
      //borderColor: colors[2],
      //backgroundColor: colors[2],
      data: [],
      label: "Envolvente inferior",
    },
  };

  data.forEach((datum) => {
    const actualTime = datum.timeRef;
    const y = datum[field] as number;
    const x = parseTime(actualTime, initialTime);
    if (labels.indexOf(x) === -1) {
      labels.push(x);
    }
    const point = {
      y,
      x,
    };

    datasets.data.data.push(point);

    const maxIndex = indexOfPoint(point, datasets.upperEnvelepe.data);
    if (maxIndex === -1) {
      datasets.upperEnvelepe.data.push(point);
    } else {
      const oldY = datasets.upperEnvelepe.data[maxIndex].y;
      datasets.upperEnvelepe.data[maxIndex].y = Math.max(oldY as number, y);
    }
    const minIndex = indexOfPoint(point, datasets.lowerEnvelepe.data);
    if (minIndex === -1) {
      datasets.lowerEnvelepe.data.push(point);
    } else {
      const oldY = datasets.lowerEnvelepe.data[minIndex].y;
      datasets.lowerEnvelepe.data[minIndex].y = Math.min(oldY as number, y);
    }
  });

  const graphData = {
    datasets: Object.values(datasets),
    labels,
  };

  return graphData;
};

const parseTime = (time: number, initialTime: number): string => {
  let delta = time - initialTime;
  if (delta > 1e9) {
    delta /= 1e9;
  }
  return delta.toFixed(2);
};
