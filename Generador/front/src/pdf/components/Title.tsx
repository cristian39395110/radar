import { StyleSheet, Text } from "@react-pdf/renderer";
import { FC } from "react";

interface Props {
  text: string;
}

const Title: FC<Props> = ({ text }) => {
  return <Text style={title}>{text}</Text>;
};

const { title } = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 19,
    marginBottom: 5,
    marginTop: 5,
  },
});

export default Title;
