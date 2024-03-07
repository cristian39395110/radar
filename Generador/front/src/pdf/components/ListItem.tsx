import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC } from "react";

interface Props {
  name: string;
  value: string;
}

const ListItem: FC<Props> = ({ name, value }) => {
  const isLargeLocation = name === "ubicación" && value.length > 25;
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{name}:</Text>
      <Text style={isLargeLocation ? styles.text : styles.none}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 12,
  },
  name: {
    textTransform: "capitalize",
  },
  text: {
    fontSize: 9,
  },
  none: {},
});

export default ListItem;
