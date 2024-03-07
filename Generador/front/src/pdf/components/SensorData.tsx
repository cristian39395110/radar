import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { FC } from "react";
import ListItem from "./ListItem";
import { Report } from "../../dopplerApi/types/Report";

interface Props {
  report: Report;
}

const keyToNames: any = {
  model: "modelo",
  radarId: "serial",
  sensorId: "sensor",
};

const SensorData: FC<Props> = ({ report }) => {
  return (
    <View style={styles.sensor}>
      <Text style={styles.title}>Detalles del equipo</Text>
      {Object.entries(report.radar)
        .filter(([key, value]) => keyToNames[key])
        .map(([key, value]) => (
          <ListItem
            name={keyToNames[key]}
            value={value as string}
            key={key + value}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sensor: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default SensorData;
