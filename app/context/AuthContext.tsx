'use client';

import { SessionProvider } from 'next-auth/react';

interface AuthProps {
  children: React.ReactNode;
}
//next-auth에서 제공하는 훅을 사용하기 위한 클라이언트 컴포넌트
export default function AuthContext({ children }: AuthProps) {
  return <SessionProvider>{children}</SessionProvider>;
}