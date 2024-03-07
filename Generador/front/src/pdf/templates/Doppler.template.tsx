import { Document, Image, Page, StyleSheet, View } from "@react-pdf/renderer";
import { TemplateComponent } from "../types/TemplateComponent";
import { CarImage, Footer, Header } from "../components";

import logo from "../../assets/logo-dps-chico.png";
import { toReportImage } from "../../dopplerApi";
import CarData from "../components/CarData";
import SensorData from "../components/SensorData";

import SinIdentificar from "../assets/sin-identificar.png";

const DopplerReportTemplate: TemplateComponent = ({ report }) => {
  const src = Object.fromEntries(
    Object.entries(report.src).map(([key, value]) => [
      key,
      toReportImage(value),
    ])
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Header showTitle logo={logo} />
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
        <Footer email="info@doppler-solutions.com" zone="Neuquén - Argentina" />
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section: {
    width: "95%",
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    height: "30%",
  },
  domain: {
    flexBasis: "80%",
    marginBottom: "1px",
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
    alignItems: "center",
    flexDirection: "column",
    width: "40%",
  },
});

export default DopplerReportTemplate;
