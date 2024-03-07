import { FC } from "react";
import Title from "./Title";
import ListItem from "./ListItem";
import { Report } from "../../dopplerApi/types/Report";
import { parseReport } from "../utils/parseReport";

const spetialKeys = ["src", "neighborhood", "domainNotRecognized"];

type Props = {
  report: Report;
};

const CarData: FC<Props> = ({ report }) => {
  const { neighborhood } = report;

  return (
    <>
      <Title text={neighborhood?.name.toUpperCase()} />
      {parseReport(report)
        .sort(([a], [b]) => {
          if (a < b) {
            return -1;
          }
          if (b > a) {
            return 1;
          }
          return 0;
        })
        .map(([key, value]) => (
          <ListItem name={key} value={value} key={key + value} />
        ))}
    </>
  );
};

export default CarData;
