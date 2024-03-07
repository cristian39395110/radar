import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC } from "react";

interface Props {
  zone: string;
  email?: string;
}

const Footer: FC<Props> = ({ zone, email }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{email}</Text>
      <Text style={styles.text}>{zone}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#3D76AA",
    width: "100%",
    height: 40,
  },
  text: {
    fontSize: 10,
    color: "#3D76AA",
    marginHorizontal: 10,
  },
});

export default Footer;
