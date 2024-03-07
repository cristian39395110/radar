import { z } from "zod";

export type AccessinReportBody = z.infer<typeof AccessinReportBody>;
export const AccessinReportBody = z.object({
  link_pdf: z.string(),
  token: z.string().length(21),
  domain: z.string().min(6).max(7),
  real_date: z.string(),
});

export type AccessinReportBodyWithOutPDF = {
  token: string;
  domain: string;
  real_date: Date;
};
