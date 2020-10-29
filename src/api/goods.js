import request from "@/utils/request";

export const getHomePanels = () => {
  return request.get("/rest/store/home/panels");
};
