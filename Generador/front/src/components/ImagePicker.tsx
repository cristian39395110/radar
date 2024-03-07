import {
  FormControl,
  FormLabel,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { FC, useEffect } from "react";
import { useQuery } from "react-query";

import UploadImage from "./UploadImage";
import { loadCarImagesUrls, loadPlateImagesUrls } from "../dopplerApi/records";
import { uploadPic } from "../dopplerApi/measures.api";
import { DOPPLER_URL } from "../dopplerApi/doppler";
import { toReportImage } from "../dopplerApi";

interface Props {
  value: string;
  imgType: "car" | "plate";
  onChange: (subUrl: string) => void;
  oldPic?: string;
  suggested?: string;
  video?: string;
}

const ImagePicker: FC<Props> = ({
  value,
  imgType,
  video,
  suggested,
  oldPic,
  onChange,
}) => {
  const {
    data: images,
    isLoading,
    refetch,
  } = useQuery(
    `${imgType}/${video}`,
    () => {
      const loader =
        imgType === "car" ? loadCarImagesUrls : loadPlateImagesUrls;
      return loader(video);
    },
    {
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (!suggested) return;
    let suggestedName = suggested;
    if (imgType === "car") {
      suggestedName = suggested.split("-")[0] + ".jpg";
    }
    const suggestedPic = images?.find((image) =>
      image.endsWith("/" + suggestedName)
    );
    if (!suggestedPic || oldPic) return;
    onChange(suggestedPic);
  }, [images, suggested, imgType]);

  const uploadImage = async (file: File) => {
    if (!video) return;
    await uploadPic(file, imgType, video);
    refetch();
  };

  if (isLoading) return <h3>Cargando</h3>;

  return (
    <FormControl>
      <FormLabel>
        Seleccione la imagen{" "}
        {imgType === "car" ? "del vehiculo" : "de la patente"}:
      </FormLabel>
      <ImageList cols={4} gap={8}>
        {images?.map((image) => (
          <ImageListItem
            key={image}
            className={value === image ? "selected-image" : ""}
          >
            <img
              src={`${DOPPLER_URL}${image}`}
              onClick={() => onChange(image)}
              loading="lazy"
              style={{
                objectFit: "contain",
              }}
            />
          </ImageListItem>
        ))}
        {oldPic && (
          <ImageListItem
            key={oldPic}
            className={value === oldPic ? "selected-image" : ""}
          >
            <img
              src={toReportImage(oldPic)}
              onClick={() => onChange(oldPic)}
              loading="lazy"
              style={{
                objectFit: "contain",
              }}
            />
          </ImageListItem>
        )}
        <ImageListItem>
          <UploadImage onUpload={uploadImage} />
        </ImageListItem>
      </ImageList>
    </FormControl>
  );
};

export default ImagePicker;
