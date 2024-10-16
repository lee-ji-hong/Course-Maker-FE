import { postLogin } from "@/api/member";
import { loginRequestDto } from "@/api/member/type";
import { MODALS } from "@/constants/modals";
import { PAGE_PATH } from "@/constants/pagePath";
import { saveAccessToken, saveRefreshToken } from "@/utils/manageTokenInfo";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useSignInMutation = () => {
  const navigate = useNavigate();
  const [currentModal, setCurrentModal] = useState<string | null>(null);

  const { mutate: signIn } = useMutation({
    mutationFn: (enteredSignInInfo: loginRequestDto) => postLogin(enteredSignInInfo),
    onSuccess: (data) => {
      saveAccessToken(data.accessToken);
      saveRefreshToken(data.refreshToken);
      navigate(PAGE_PATH.home);
    },
    onError: (error: AxiosError) => {
      const statusCode = error?.response?.status;
      switch (statusCode) {
        case 400:
          setCurrentModal(MODALS.invalidPassword.id);
          break;
        case 404:
          setCurrentModal(MODALS.invalidEmail.id);
          break;
        default:
          alert("로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    },
  });

  return { signIn, currentModal, setCurrentModal };
};
