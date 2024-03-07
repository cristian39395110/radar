import { Button, Typography } from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { Neighborhood } from "../../dopplerApi/types/Neighborhoods";
import { useMeasures } from "../hooks/useMeasure";

import LoadingModal from "../../components/LoadingModal";
import { findNeighborhood } from "../../dopplerApi/neighborhoods.api";
import { useModalStore } from "../../state/modal.store";
import { findRecordImages } from "../../dopplerApi/records";
import ReportForm from "../../components/ReportForm";

interface Props {}

const NewRegister: FC<Props> = () => {
  const { neighborhoodId } = useParams();
  const navigate = useNavigate();
  const status = useModalStore((s) => s.status);
  const {
    isLoading,
    data: neighborhood,
    refetch,
  } = useQuery<Neighborhood>([neighborhoodId || "neighborhood"], () =>
    findNeighborhood(neighborhoodId || "")
  );

  const {
    measuresIds,
    total,
    measure,
    actual,
    next,
    isLoading: isLoadingMeasures,
  } = useMeasures(neighborhoodId);

  useEffect(() => {
    refetch();
  }, [measuresIds]);

  useEffect(() => {
    if (total === 0 && !isLoadingMeasures && status !== "loading")
      navigate("/neighborhoods");
  }, [total]);

  const handleSubmit = () => {
    if (actual >= total) {
      navigate("/neighborhoods");
    }
    refetch();
    next();
    window.scrollTo(0, 0);
  };

  const handleDiscard = () => {
    if (actual + 1 > total) {
      navigate("/neighborhoods");
    }
    next(true);
  };
  const handleDownload = async () => {
    if (!measure || !neighborhood) return;
    const data = await findRecordImages(measure.video);
    const zip = new Blob([data], {
      type: "application/zip",
    });
    const { radar, _id } = measure;
    const { name } = neighborhood;
    const fileName = `${_id}-${radar.model}-${name}.zip`;
    const url = URL.createObjectURL(zip);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <>
      <LoadingModal isLoading={isLoading || isLoadingMeasures} />
      <main>
        <Typography variant="h4" textAlign="center">
          {actual}/{total} - {neighborhood?.name}
        </Typography>
        <Typography variant="h5" textAlign="center">
          {measure?.radar.radarId}
        </Typography>
        {measure && neighborhood && (
          <ReportForm
            measure={measure}
            neighborhood={neighborhood}
            onSubmit={handleSubmit}
          />
        )}
        <div className="options-container">
          <Button color="error" variant="contained" onClick={handleDiscard}>
            Descartar medición
          </Button>
          <Button color="info" variant="contained" onClick={handleDownload}>
            Descargar imagenes
          </Button>
        </div>
      </main>
    </>
  );
};

export default NewRegister;
