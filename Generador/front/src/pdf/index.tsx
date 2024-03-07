import DopplerReportTemplate from "./templates/Doppler.template";
import ProsistectReportTemplate from "./templates/Prosistec.template";
import { Templates } from "./types/Templates";

const templates: Templates = {
  doppler: DopplerReportTemplate,
  prosistec: ProsistectReportTemplate,
};

export default templates;
