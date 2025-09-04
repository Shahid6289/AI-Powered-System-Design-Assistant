import api from "./index";

export const createDesign = async ({ prompt, style, complexity, services }) => {
  const { data } = await api.post("/designs", { prompt, style, complexity, services });
  return data; // DesignResponseDTO
};

export const listDesigns = async () => {
  const { data } = await api.get("/designs");
  return data; // DesignResponseDTO[]
};

export const getDesign = async (id) => {
  const { data } = await api.get(`/designs/${id}`);
  return data; // DesignResponseDTO
};

export const getUserDesigns = async (userId) => {
  const { data } = await api.get(`/designs/user/${userId}`);
  return data; // array of DesignResponseDTO
};
