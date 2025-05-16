"use server"
import { AUTH_ERRORS, EMAIL_REGEX, PASSWORD_REGEX } from '@/lib/constants';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt'
import { RequestBody } from '@/types/user';
import prisma from '@/lib/prisma';

export async function POST(request:Request) {
  try {
   const body : RequestBody = await request.json();

   //이메일 정규식 틀릴 경우
  if(!EMAIL_REGEX.test(body.email)){
    return NextResponse.json(
      {
        success: false,
        message:AUTH_ERRORS.EMAIL_AUTH.message
      },
      {status:400}
    )
  }

  //비밀번호 정규식 틀릴 경우
  if(!PASSWORD_REGEX.test(body.password)){
    return NextResponse.json(
      {
        success: false,
        message:AUTH_ERRORS.AUTH_PASSWORD.message
      },
      {status:400}
    )
  }

  //이메일 중복 확인
  const existingUser = await prisma.user.findUnique({
    where:{
      email:body.email
    }
  })
  if(existingUser){
    return NextResponse.json(
      {
        success: false,
        message:AUTH_ERRORS.EMAIL_EXISTS.message
      },
      {status:409}
    )
  }

  const hashePassword = await bcrypt.hash(body.password,12);

  //비밀번호 암호화해서 유저 생성
  const newUser = await prisma.user.create({
    data:{
      name:body.name,
      email:body.email,
      password:hashePassword,
      role:'user'
    }
  })

  //비밀번호 제외
  const {password:_, ...userWithoutPassword} = newUser;

  return NextResponse.json(
    {
      message:"회원가입 성공",
      user:userWithoutPassword
    },
    {status:201}
  )
  } catch (error) {
    return NextResponse.json(
      { message: "회원가입 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}