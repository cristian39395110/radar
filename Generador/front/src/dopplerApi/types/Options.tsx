export type ReportsOptions = {
  start: Date;
  end: Date;
  mode: ModeOption;
  wasSent?: boolean;
};

export type ModeOption = "measure" | "generation";
