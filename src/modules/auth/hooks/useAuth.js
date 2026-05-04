"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest, logoutRequest } from "@/modules/auth/services/auth-service";

export function useAuth() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const login = useCallback(async (username, password) => {
    setBusy(true);
    try {
      await loginRequest({ username, password });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    setBusy(true);
    try {
      await logoutRequest();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }, [router]);

  return { login, logout, busy };
}
