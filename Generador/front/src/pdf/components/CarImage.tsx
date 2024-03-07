import { Image, View } from "@react-pdf/renderer";
import { FC } from "react";

interface Props {
  image: string;
}

const CarImage: FC<Props> = ({ image }) => {
  return (
    <View style={{ width: "90%", height: "40%" }}>
      <Image src={image} />
    </View>
  );
};

export default CarImage;
