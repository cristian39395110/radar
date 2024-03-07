import { Button } from "@mui/material";
import { ChangeEvent, FC, useRef, useState } from "react";

import noImage from "../../public/no-photo.jpg";
import styles from "../styles/upload-image.module.css";
import { useModalStore } from "../state/modal.store";

interface Props {
  onUpload: (file: File) => Promise<void>;
}

const UploadImage: FC<Props> = ({ onUpload }) => {
  const setStatus = useModalStore((s) => s.setStatus);
  const [image, setImage] = useState<File>();
  const inputRef = useRef<any>();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;
    const file = files[0];
    setImage(file);
  };

  const handleSelect = () => {
    inputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!image) return;
    setStatus("loading", "Enviando imagen al server");
    try {
      await onUpload(image);
      setStatus("success", "Imagen subida con exito");
    } catch (e) {
      setStatus("error", "No se pudo subir la imagen al server");
    }
    setImage(undefined);
  };

  return (
    <div className={styles.input}>
      <input
        type="file"
        onChange={handleChange}
        ref={inputRef}
        style={{ display: "none" }}
      />
      <img
        src={image ? URL.createObjectURL(image) : noImage}
        style={{
          objectFit: "contain",
        }}
      />
      <Button onClick={handleSelect} variant="contained">
        Elegir imagen
      </Button>
      <Button
        onClick={handleUpload}
        variant="contained"
        color="success"
        disabled={!image}
      >
        Subir
      </Button>
    </div>
  );
};

export default UploadImage;
