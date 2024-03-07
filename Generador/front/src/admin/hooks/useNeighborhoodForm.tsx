import { useEffect, useMemo, useState } from "react";
import {
  NewNeighborhood,
  ReportFields,
} from "../../dopplerApi/types/Neighborhoods";
import { useMutation } from "react-query";
import {
  createOrUpdateNeighborhood,
  findNeighborhood,
} from "../../dopplerApi/neighborhoods.api";
import { useModalStore } from "../../state/modal.store";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import templates from "../../pdf";

const messages = {
  idle: "",
  error: "No se pudo crear el barrio",
  success: "Barrio creado con exito",
  loading: "Creando barrio...",
};

export const useNeighborhoodForm = (id?: string) => {
  const [neighborhood, setNeighborhood] = useState(loadNeighborhood());

  const setStatus = useModalStore((s) => s.setStatus);
  const navigate = useNavigate();

  const { mutate, status, ...rest } = useMutation({
    mutationFn: () => createOrUpdateNeighborhood(neighborhood),
  });

  useEffect(() => {
    if (!id) return;
    findNeighborhood(id, true).then((neighborhood) => {
      const { _id, ...rest } = neighborhood;
      const voidNeighborhood = loadNeighborhood();
      setNeighborhood({
        id: _id,
        ...rest,
        reportFields: {
          ...voidNeighborhood.reportFields,
          ...rest.reportFields,
        },
        tokens: {},
      });
    });
  }, [id]);

  useEffect(() => {
    setStatus(status, messages[status]);
    if (status === "success") navigate("/admin/neighborhoods");
  }, [status]);

  const update = (name: keyof NewNeighborhood, value: string | number) => {
    value = name === "actNumber" ? Number(value) : value;
    setNeighborhood({
      ...neighborhood,
      [name]: value,
    });
  };

  const updateReportFields = (name: keyof ReportFields, value: boolean) => {
    setNeighborhood({
      ...neighborhood,
      reportFields: {
        ...neighborhood?.reportFields,
        [name]: value,
      } as any,
    });
  };

  const updateTemplate = (template: string) => {
    setNeighborhood({
      ...neighborhood,
      template,
    });
  };

  const updateToken = (token: string) => {
    setNeighborhood({
      ...neighborhood,
      tokens: { ...neighborhood?.tokens, accessin: token },
    });
  };

  const { isValid, errors } = useMemo(() => {
    const result = NewNeighborhood.safeParse(neighborhood);
    if (result.success) {
      return { isValid: true, errors: {} };
    }
    const errors = Object.fromEntries(
      result.error.errors.map(({ path, message }) => [path[0], message])
    );
    return { isValid: false, errors };
  }, [neighborhood]);

  return {
    neighborhood,
    update,
    updateReportFields,
    updateToken,
    createOrUpdateNeighborhood: mutate,
    updateTemplate,
    isValid,
    errors,
  };
};

const loadNeighborhood = (): NewNeighborhood => {
  return {
    acronym: "",
    name: "",
    actNumber: 1,
    template: Object.keys(templates)[0],
    reportFields: {
      actNumber: true,
      date: true,
      funtionalUnit: false,
      homeowner: false,
      location: true,
      model: true,
      neighborhood: true,
      plate: true,
      sensorId: true,
      speed: true,
      src: true,
      id: true,
    },
    tokens: {},
  };
};
