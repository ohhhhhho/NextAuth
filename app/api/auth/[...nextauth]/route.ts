"use server"
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import { AUTH_ERRORS } from '@/lib/constants';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name:"credentials",
      credentials:{
        email:{label:"Email",type:"text"},
        password:{label:"Password",type:"password"}
      },
      //비밀번호 비교, 이메일 존재 여부 확인(로그인만 관여)
      //검증 후 user정보 리턴
      async authorize(credentials, req) {

        if (!credentials?.email || !credentials?.password) {
          throw new Error(JSON.stringify({
            errorCode: AUTH_ERRORS.INVALID_CREDENTIALS.code,
            errorMessage: AUTH_ERRORS.INVALID_CREDENTIALS.message
          }));
        }

        try{
          const user =  await prisma.user.findUnique({
            where:{
              email:credentials?.email
            }
          });

          //유저가 없을 경우
          if(!user){
            throw new Error(JSON.stringify({
              errorCode:AUTH_ERRORS.EMAIL_EXISTS.code,
              errorMessage:AUTH_ERRORS.EMAIL_EXISTS.message
            }))
          }

          //계정이 정지됐을 경우
          if(user.status === 'suspended'){
            throw new Error(JSON.stringify({
              errorCode:AUTH_ERRORS.ACCOUNT_SUSPENDED.code,
              errorMessage:AUTH_ERRORS.ACCOUNT_SUSPENDED.message
            }))
          }

          //비밀번호가 일치하지 않을 경우
          const isPasswordValid = await compare(credentials?.password, user.password);
          if(!isPasswordValid){
            throw new Error(JSON.stringify({
              errorCode:AUTH_ERRORS.INVALID_PASSWORD.code,
              errorMessage:AUTH_ERRORS.INVALID_PASSWORD.message
            }))
          }

          return{
            id:user.id,
            email:user.email,
            name:user.name,
            role:user.role
          }
        }catch(error){
            // 에러가 이미 포맷된 경우 그대로 던짐
            if (error instanceof Error && error.message.startsWith('{')) {
              throw error;
            }

            // 서버 에러
            throw new Error(JSON.stringify({
              errorCode: AUTH_ERRORS.SERVER_ERROR.code,
              errorMessage: AUTH_ERRORS.SERVER_ERROR.message,
            }));
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({user,account,profile}){
      if(account?.provider === 'google'){
        try{
          //google로 로그인한 사용자 db저장 또는 업데이트
          const existingUser = await prisma.user.findUnique({
            where:{
              email:user.email as string
            }
          });
          //유저 정보 없을경우 새로 추가
          if(!existingUser){
            await prisma.user.create({
              data:{
                email: user.email as string,
                name: user.name as string,
                role: 'user',
                status: 'active',
              }
            })
          }
        }catch(error){
          console.error("Google OAuth 사용자 처리 중 오류:", error);
          return false;
        }
      }
      return true;
    },
    //유저 정보 토큰에 추가
    async jwt({token,user}) {
      if(user){
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    //세션에 토큰 정보 추가
    async session({session,token}){
      if(session.user){
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages:{
    signIn:'/login',
    signOut: '/logout',
    error: '/error',
  },
  session:{
    strategy:'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일 (초 단위)
  },
  jwt: {
    maxAge: 60 * 60, // 1시간 (초 단위)
  }
};
const handler = NextAuth(authOptions);

export { authOptions, handler as GET, handler as POST };
