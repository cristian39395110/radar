import { Document, Image, Page, StyleSheet, View } from "@react-pdf/renderer";
import SinIdentificar from "../assets/sin-identificar.png";

import prosistec from "../../assets/prosistec.png";
import { TemplateComponent } from "../types/TemplateComponent";
import { toReportImage } from "../../dopplerApi";
import CarData from "../components/CarData";
import SensorData from "../components/SensorData";
import { CarImage, Footer } from "../components";

const ProsistectReportTemplate: TemplateComponent = ({ report }) => {
  const src = Object.fromEntries(
    Object.entries(report.src).map(([key, value]) => [
      key,
      toReportImage(value),
    ])
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Image style={styles.logo} source={prosistec} />
        </View>
        <View style={styles.section}>
          <View style={styles.data}>
            <CarData report={report} />
          </View>
          <View style={styles.info}>
            <View style={styles.domain}>
              <Image src={src.domain || SinIdentificar} />
            </View>
            <SensorData report={report} />
          </View>
        </View>
        <CarImage image={src.car} />
        <Footer zone="BsAs - Argentina" />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "10px",
    border: "5px solid #302A7B",
  },
  logo: {
    height: 80,
  },
  section: {
    width: "95%",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    height: "30%",
  },
  domain: {
    width: "80%",
  },
  data: {
    display: "flex",
    justifyContent: "space-around",
    width: "50%",
    borderWidth: 1,
    borderColor: "black",
  },
  info: {
    display: "flex",
    justifyContent: "space-around",
    width: "40%",
  },
});

export default ProsistectReportTemplate;
