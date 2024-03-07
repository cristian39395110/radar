import { RegisterForm } from "../types/RegisterForm";
import { dopplerApi } from "./doppler";
import { ReportsOptions } from "./types/Options";
import { Report } from "./types/Report";
import { ReportResume } from "./types/ReportResume";

export const loadReportsByNeighborhood = async (
  neighborhood: string,
  options?: ReportsOptions
) => {
  const { data } = await dopplerApi.get<Report[]>("reports", {
    params: {
      neighborhood,
      ...options,
    },
  });
  return data;
};

export const createOrUpdateReport = (
  report: RegisterForm,
  oldReport?: Report
) => {
  if (oldReport) return updateReport(oldReport, report);
  return createReport(report);
};

export const createReport = async (register: RegisterForm) => {
  try {
    const { data } = await dopplerApi.post<Report>("/reports/", register);
    return data;
  } catch (error) {
    const e = error as any;
    const message = e.response?.data?.message || "error inesperado";
    throw new Error(message);
  }
};

export const updateReport = async (oldReport: Report, report: RegisterForm) => {
  const id = oldReport._id;

  try {
    const { data } = await dopplerApi.put<Report>(`/reports/${id}`, report);
    return data;
  } catch (error) {
    const e = error as any;
    const message = e.response?.data?.message || "error inesperado";
    throw new Error(message);
  }
};

export const loadReport = async (id: string, edit = false) => {
  try {
    const { data } = await dopplerApi.get<Report>(`reports/${id}`, {
      params: {
        includeMeasure: edit,
      },
    });
    return data;
  } catch (error) {
    const e = error as any;
    throw new Error(e.response?.data?.message || "error inesperado");
  }
};

export const countReportsByNeighborhood = async (
  neighborhood: string,
  options?: ReportsOptions
) => {
  const { data } = await dopplerApi.get<number>("reports/count", {
    params: {
      neighborhood,
      ...options,
    },
  });
  return data;
};

export const findResume = async (
  neighborhood: string,
  options: ReportsOptions
) => {
  const { data } = await dopplerApi.get<ReportResume[]>(
    `reports/resumes/${neighborhood}`,
    {
      params: options,
    }
  );
  return data;
};

export const deleteReport = async (id: string) => {
  const { data } = await dopplerApi.delete(`reports/${id}`);
  return data;
};

export const updateSent = async (ids: string[]): Promise<string[]> => {
  const { data } = await dopplerApi.put<string[]>(`reports/sent`, {
    ids,
  });
  return data;
};
