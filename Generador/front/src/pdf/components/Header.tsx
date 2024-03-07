import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC } from "react";

interface Props {
  logo: string;
  showTitle?: boolean;
}

const Header: FC<Props> = ({ showTitle, logo }) => {
  return (
    <View style={styles.titleView}>
      <Image style={styles.logo} source={logo} />
      {showTitle && <Text style={styles.title}>Informe de velocidad</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    position: "absolute",
    right: 10,
    top: 5,
    height: 50,
  },
  title: {
    textAlign: "center",
  },
  titleView: {
    width: "100%",
    height: 60,
    borderBottomColor: "#3D76AA",
    borderBottomWidth: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Header;
