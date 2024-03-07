import { FC } from "react";
import { Report } from "../../dopplerApi/types/Report";

export type TemplateProps = {
  report: Report;
};

export type TemplateComponent = FC<TemplateProps>;
