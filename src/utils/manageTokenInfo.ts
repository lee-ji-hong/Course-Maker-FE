export const saveAccessToken = (accessToken: string) => {
  localStorage.setItem("accessToken", accessToken);
};

export const saveRefreshToken = (refreshToken: string) => {
  localStorage.setItem("refreshToken", refreshToken);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const removeTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
