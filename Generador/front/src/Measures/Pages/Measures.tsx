import { FC, useMemo, useState } from "react";
import MeasureSearch from "../components/MeasureSearch";
import { Measure, QueryMeasures } from "../../dopplerApi/types/Measures";
import { deleteMeasure, getMeasures } from "../../dopplerApi/measures.api";
import { useModalStore } from "../../state/modal.store";
import { DataGrid, GridApi, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import { measuresToRows } from "../utils/measuresToRows";
import { useAuthStore } from "../../state";
import ConfirmationModal from "../../components/ConfirmationModal";
import LoadingModal from "../../components/LoadingModal";
import LinearLoadingModal from "../../components/LinearLoadingModal";
import { formatToArg } from "../../utils/formatToArg";
import { Link } from "react-router-dom";

interface Props {}

const Measures: FC<Props> = () => {
  const setStatus = useModalStore((s) => s.setStatus);
  const isAdmin = useAuthStore((s) => s.user?.roles.includes("admin"));
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteManager, setDeleteManager] = useState({
    isDeleting: false,
    deleted: 0,
    total: 1,
    errors: [] as string[],
  });

  const columns: GridColDef[] = useMemo(() => {
    const width = window.innerWidth - 50;
    return [
      {
        field: "radar",
        headerName: "Radar",
        width: width * 0.1,
        sortable: true,
      },
      {
        field: "plate",
        headerName: "Patente",
        width: width * 0.1,
      },
      {
        field: "createdAt",
        headerName: "Fecha de creación",
        width: width * 0.2,
        sortable: true,
      },
      {
        field: "status",
        headerName: "Estado",
        width: width * 0.2,
      },
      {
        field: "create",
        headerName: "Acciones",
        sortable: false,
        width: width * 0.3,
        renderCell(params) {
          const { id, api } = params;
          const { status } = api.getRow(id);
          if (status !== "Descartado") return <></>;
          return (
            <Link to={`/measures/${params.id}`}>
              <Button>Crear Reporte</Button>
            </Link>
          );
        },
      },
    ];
  }, [window.innerWidth]);

  const handleSearch = async (query: QueryMeasures) => {
    setSelectedRows([]);
    setStatus("loading", "Buscando mediciones");
    try {
      const measures = await getMeasures(query);
      setMeasures(measures);
      setStatus("idle");
    } catch (err) {
      setStatus("error", "Error inesperado");
    }
  };

  const handleOpenDelete = () => setOpenModal(true);

  const handleDelete = () => {
    setOpenModal(false);
    setDeleteManager({
      isDeleting: true,
      deleted: 0,
      total: selectedRows.length,
      errors: [],
    });
    deleteMeasures(selectedRows);
  };

  const handleCancel = () => setOpenModal(false);

  const deleteMeasures = async (ids: string[], i = 0) => {
    const id = ids[i];
    try {
      await deleteMeasure(id);
      setDeleteManager((prev) => ({
        ...prev,
        deleted: prev.deleted + 1,
      }));
    } catch (e) {
      const actualMeasure = measures.find((x) => x._id === id);
      setDeleteManager((prev) => ({
        ...prev,
        errors: [
          `La medición de ${
            actualMeasure?.plate?.plate ||
            formatToArg(
              actualMeasure?.createdAt || new Date(),
              "HH:mm:ss dd/MM/YYYY"
            )
          } no pudo ser eliminada`,
          ...prev.errors,
        ],
      }));
    }
    if (i + 1 === ids.length) {
      setMeasures((measures) => measures.filter((x) => !ids.includes(x._id)));
      setTimeout(
        () =>
          setDeleteManager({
            isDeleting: false,
            errors: [],
            total: 1,
            deleted: 0,
          }),
        1000
      );
      return;
    }

    deleteMeasures(ids, i + 1);
  };

  return (
    <>
      <LinearLoadingModal
        open={deleteManager.isDeleting}
        value={(deleteManager.deleted / deleteManager.total) * 100}
      >
        <Typography variant="h4">
          {deleteManager.deleted}/{deleteManager.total} mediciones eliminadas
        </Typography>
        <List>
          {deleteManager.errors.map((error, i) => (
            <ListItem key={i}>{error}</ListItem>
          ))}
        </List>
      </LinearLoadingModal>
      <ConfirmationModal
        open={openModal}
        onAccept={handleDelete}
        onClose={handleCancel}
      >
        <Typography variant="h2">
          Desea eliminar las {selectedRows.length} mediciones elegidas?
        </Typography>
        <Typography variant="caption">
          Tenga en cuenta que al eliminar las mediciones se eliminaran TODOS los
          datos, incluidos los videos, los datos de velocidad y las fotos que no
          se hayan usado para generar un reporte. Esto hace que los creados no
          puedan ser actulizados.
        </Typography>
      </ConfirmationModal>
      <div>
        <Typography variant="h4" align="center">
          Buscador de mediciones
        </Typography>
        <MeasureSearch onSearch={handleSearch} />
        {measures.length > 0 && (
          <Box sx={{ height: 500, width: "100%" }}>
            <DataGrid
              checkboxSelection={isAdmin}
              isRowSelectable={(params: GridRowParams) =>
                ["Completado", "Descartado"].includes(params.row.status)
              }
              onRowSelectionModelChange={(ids) =>
                setSelectedRows(ids as string[])
              }
              rows={measuresToRows(measures)}
              columns={columns}
            />
          </Box>
        )}
        {isAdmin && measures.length > 0 && (
          <Button
            variant="contained"
            color="error"
            onClick={handleOpenDelete}
            fullWidth
            disabled={selectedRows.length === 0}
          >
            Eliminar
          </Button>
        )}
      </div>
    </>
  );
};

export default Measures;
