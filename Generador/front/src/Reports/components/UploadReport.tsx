import { FC, useEffect, useState } from "react";
import { Report } from "../../dopplerApi/types/Report";
import { TemplateComponent } from "../../pdf/types/TemplateComponent";
import { usePDF } from "@react-pdf/renderer";
import { uploadReport } from "../../apis/reportUpload";

interface Props {
  report: Report;
  template: TemplateComponent;
  onLoad?: (blob: Blob) => Promise<void>;
}

const UploadReport: FC<Props> = ({ template: Template, report, onLoad }) => {
  const [instance, update] = usePDF({
    document: <Template report={report} />,
  });

  const [error, setError] = useState<string>();

  useEffect(() => {
    if (instance.loading || !instance.blob || !onLoad) return;
    onLoad(instance.blob).catch((e) => {
      setError("hubo un error");
    });
  }, [instance]);

  if (error) {
    <li>error</li>;
  }

  return <></>;
};

export default UploadReport;
