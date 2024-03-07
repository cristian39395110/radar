import { useEffect, useState } from "react";
import { NewRadar, Radar } from "../../dopplerApi/types/Radars";
import { useMutation } from "react-query";
import { createOrUpdateRadar } from "../../dopplerApi/auth.api";
import { useModalStore } from "../../state/modal.store";
import { findRadar } from "../../dopplerApi/radars.api";
import { useNavigate } from "react-router-dom";

const messages = {
  idle: "",
  error: "No se pudo crear el radar",
  success: "Radar creado con exito",
  loading: "Creando radar...",
};

export const useRadarForm = (id?: string) => {
  const [radar, setRadar] = useState<NewRadar>(loadRadar());
  const navigate = useNavigate();

  const setStatus = useModalStore((s) => s.setStatus);

  const { mutate, status, data, ...rest } = useMutation({
    mutationFn: () => {
      return createOrUpdateRadar(radar);
    },
  });

  useEffect(() => {
    if (status === "success") {
      handleSuccess();
    } else {
      setStatus(status, messages[status]);
    }
  }, [status]);

  useEffect(() => {
    if (!id) return;
    findRadar(id).then((radar) => {
      const { neighborhood, _id, isActive, ...rest } = radar;
      setRadar({
        id,
        ...rest,
        neighborhood:
          typeof neighborhood === "string" ? neighborhood : neighborhood._id,
      });
    });
  }, [id]);

  const isValid = NewRadar.safeParse(radar);

  const update = (name: keyof NewRadar, value: string) => {
    setRadar({
      ...radar,
      [name]: value,
    });
  };

  const handleSuccess = () => {
    if (radar.id) {
      setStatus(status, "Radar actualizado con exito");
      navigate("/admin/radars");
      return;
    }
    setStatus(status, `Radar creado apikey: ${data?.apikey}`);
    setRadar(loadRadar());
  };

  return {
    radar,
    isValid,
    update,
    createOrUpdate: mutate,
  };
};

export const loadRadar = (): NewRadar => {
  return {
    location: "",
    maxSpeed: 30,
    model: "DS02-",
    neighborhood: "",
    radarId: "",
    sensorId: "",
  };
};
