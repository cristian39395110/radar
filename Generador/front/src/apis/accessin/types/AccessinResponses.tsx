export type AccessinResponse =
  | {
      status: "success";
    }
  | {
      status: "error";
      error: string;
    };
