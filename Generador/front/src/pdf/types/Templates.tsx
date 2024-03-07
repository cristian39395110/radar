import { TemplateComponent } from "./TemplateComponent";

export type TemplatesNames = "doppler" | "prosistec";

export type Templates = Record<TemplatesNames, TemplateComponent>;
