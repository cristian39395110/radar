import { BlobProvider } from "@react-pdf/renderer";
import { FC, useRef, useState } from "react";
import { Report } from "../../dopplerApi/types/Report";
import templates from "../../pdf";

interface Props {
  reports: Report[];
  addBlob: (blob: Blob, report: Report) => void;
}

const GenerateBlobReports: FC<Props> = ({ reports, addBlob }) => {
  const statusRef = useRef<string[]>([]);
  const sentRef = useRef<string[]>([]);
  return (
    <>
      {reports.map((report) => {
        const Template = templates[report.neighborhood.template];
        return (
          <BlobProvider
            key={report._id}
            document={<Template report={report} key={report._id} />}
          >
            {({ blob, url, loading, error }) => {
              const id = report._id;
              if (loading && !sentRef.current.includes(id)) {
                statusRef.current.push(id);
              }
              if (!loading && blob && !sentRef.current.includes(id)) {
                addBlob(blob, report);
                sentRef.current.push(id);
              }
              if (error) {
                console.log(error);
              }
              return <></>;
            }}
          </BlobProvider>
        );
      })}
    </>
  );
};

export default GenerateBlobReports;
