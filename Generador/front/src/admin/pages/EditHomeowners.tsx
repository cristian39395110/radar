import { Alert, Button, Input, Typography } from "@mui/material";
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { Neighborhood } from "../../dopplerApi/types/Neighborhoods";
import {
  findNeighborhood,
  sendFunctionalUnits,
} from "../../dopplerApi/neighborhoods.api";
import { useMutation } from "react-query";
import { csv2json } from "json-2-csv";
import { parseRawJson } from "../utils/parseRawJson";
import { RawFunctionalUnit } from "../types/RawFunctionalUnits";
import { FunctionalUnit } from "../../dopplerApi/types/FunctionalUnit";
import FunctionalUnits from "../components/FunctionalUnits";
import { useModalStore } from "../../state/modal.store";
interface Props {}

const EditHomeowners: FC<Props> = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const setStatus = useModalStore((s) => s.setStatus);
  const [neighborhood, setNeighborhood] = useState<Neighborhood>();
  const [functionalUnits, setFunctionalUnits] = useState<
    FunctionalUnit[] | null
  >(null);

  const { status, mutate, data } = useMutation([id, "homeowners"], {
    mutationFn: () => {
      if (!functionalUnits) throw new Error("Functional units is required");
      if (!id) throw new Error("id is required");
      return sendFunctionalUnits(id, functionalUnits);
    },
  });

  useEffect(() => {
    if (!id) return;
    findNeighborhood(id).then((n) => setNeighborhood(n));
  }, [id]);

  useEffect(() => {
    if (status === "loading") return setStatus("loading", "Cargando...");
    if (status === "error") return setStatus("error", `error inesperado`);
    if (status === "success") {
      setStatus("success", `Se cargaron ${data} unidades funcionales`);
      setTimeout(() => {
        navigate("/admin/neighborhoods");
      }, 2000);
    }
  }, [status]);

  const updateFunctionalUnits = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate();
  };

  const updateFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      const json = (await csv2json(text, {
        parseValue: String,
      })) as RawFunctionalUnit[];
      setFunctionalUnits(parseRawJson(json));
    };
    reader.readAsText(files[0]);
  };

  return (
    <>
      <Typography variant="h2" textAlign="center">
        {neighborhood?.name}
      </Typography>
      <Alert severity="info">
        <p>Las columnas validas son: "unidadFuncional", "patente" y "dueño" </p>
        <p>
          En caso de que un dueño tenga más de una patente debe crear nuevas
          filas con la misma unidadFuncional
        </p>
      </Alert>
      <form onSubmit={updateFunctionalUnits}>
        <Input type="file" name="homeowners" onChange={updateFile} />
        <Button
          disabled={!functionalUnits || functionalUnits.length === 0}
          variant="contained"
          type="submit"
        >
          Actualizar dueños
        </Button>
      </form>
      {functionalUnits && <FunctionalUnits functionalUnits={functionalUnits} />}
    </>
  );
};

export default EditHomeowners;
