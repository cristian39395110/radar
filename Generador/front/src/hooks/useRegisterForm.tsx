import { useEffect, useMemo, useRef, useState } from "react";
import { Datum, Measure } from "../dopplerApi/types/Measures";
import { Neighborhood } from "../dopplerApi/types/Neighborhoods";
import { RegisterForm } from "../types/RegisterForm";
import { findMaxSpeed } from "../Measures/utils/findMaxSpeed";
import { useMutation } from "react-query";
import { createOrUpdateReport, createReport } from "../dopplerApi/reports.api";
import { useModalStore } from "../state/modal.store";
import { Report } from "../dopplerApi/types/Report";
import { parseDateToCorrectFormat } from "../utils/formatToArg";
import { findNeighborhood } from "../dopplerApi/neighborhoods.api";
import { FunctionalUnit } from "../dopplerApi/types/FunctionalUnit";

const messages = {
  idle: "",
  error: "No se pudo crear el reporte",
  success: "Reporte creado con exito",
  loading: "Creando reporte...",
};

export const useRegisterForm = (oldReport?: Report) => {
  const [register, setRegister] = useState<RegisterForm>(getVoidRegister());
  const [functionalUnits, setFunctionalUnits] = useState<FunctionalUnit[]>([]);

  const setStatus = useModalStore((s) => s.setStatus);
  const handleSendRef = useRef<() => void>();
  const {
    status,
    isLoading,
    error,
    mutate: upload,
  } = useMutation({
    mutationFn: async (handleSend: () => void) => {
      handleSendRef.current = handleSend;
      const result = await createOrUpdateReport(register, oldReport);
      //window.open(`/reports/${result._id}`, "_blank");
      reset();
      return result;
    },
    onError: (error: Error) => {
      setStatus("error", error.message);
    },
    onSuccess: () => {
      setStatus("idle", "");
      handleSendRef.current && handleSendRef.current();
    },
  });

  useEffect(() => {
    isLoading && setStatus("loading", messages.loading);
  }, [isLoading]);

  useEffect(() => {
    if (!register.plate) return;
    const functionalUnit = functionalUnits.find(({ plates }) =>
      plates.some((p) => p === register.plate)
    );
    setRegister((p) => ({
      ...p,
      functionalUnit: functionalUnit?.name,
      homeowner: functionalUnit?.homeowner,
    }));
  }, [register.plate, functionalUnits]);

  const isValid = useMemo(() => {
    const result = RegisterForm.safeParse(register);
    return result.success;
  }, [register]);

  const updateRegister = (
    field: keyof RegisterForm,
    value: string | number
  ) => {
    if (field === "actNumber") {
      value = Number(value);
    }
    if (field === "plate") {
      value = (value as string).toUpperCase();
    }
    setRegister((prev) => ({ ...prev, [field]: value }));
  };

  const updateImage = (field: "car" | "domain", value: string) => {
    setRegister((prev) => ({
      ...prev,
      src: {
        ...prev.src,
        [field]: value,
      },
    }));
  };

  const updateRegisterFromRawData = async (
    neighborhood: Neighborhood,
    measure: Measure,
    report?: Report
  ) => {
    if (neighborhood.functionalUnits) {
      setFunctionalUnits(neighborhood.functionalUnits);
    }
    if (report) {
      return loadOldInfo(report);
    }
    const updatedNeighborhood = await findNeighborhood(neighborhood._id);
    const actNumber = updatedNeighborhood.actNumber;

    const maxSample = findMaxSpeedSample(measure);

    setRegister((prev) => ({
      ...prev,
      plate: measure.plate?.plate || "",
      actNumber,
      speed: maxSample.speed,
      date: parseDateToCorrectFormat(maxSample.date).toISOString(),
      neighborhood: neighborhood._id,
      radar: measure.radar._id,

      measure: measure._id,
      location: measure.radar.location || "Undefined",
    }));
  };

  const loadOldInfo = (report: Report) => {
    const actNumber = Number(
      report.actNumber
        .split("")
        .filter((x) => Number(x))
        .join("")
    );
    setRegister({
      plate: report.plate,
      actNumber,
      speed: report.speed,
      date: report.date.toString(),
      neighborhood: report.neighborhood._id,
      radar: report.radar._id,
      functionalUnit: report.functionalUnit,
      homeowner: report.homeowner,
      measure:
        typeof report.measure === "string"
          ? report.measure
          : report.measure._id,
      location: report.location,
      src: report.src,
    });
  };

  const findMaxSpeedSample = (measure: Measure) => {
    const { samples, outliers } = measure;
    if (outliers?.step) {
      const recommendedIndex = samples.findIndex(
        ({ isRecommended }) => isRecommended
      );
      const data = samples
        .filter((x, i) => [i, -1].includes(recommendedIndex))
        .flatMap((s) => s?.tdat || s.pdat);
      return findMaxSpeed(data);
    }
    const tdat = samples.map((s) => s?.tdat).filter(Boolean) as Datum[];
    if (tdat.length > 0) {
      return findMaxSpeed(tdat);
    }
    const data = samples.flatMap((s) => s?.tdat || s.pdat);
    return findMaxSpeed(data);
  };

  const reset = () => setRegister(getVoidRegister());

  return {
    register,
    uploadError: error,
    isValid,
    isLoading,
    updateRegisterFromRawData,
    updateRegister,
    updateImage,
    upload,
  };
};

const getVoidRegister = (): RegisterForm => ({
  actNumber: 0,
  date: "",
  plate: "",
  location: "",
  neighborhood: "",
  radar: "",
  measure: "",
  speed: 0,
  src: {} as any,
});
