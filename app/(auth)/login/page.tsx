"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useState } from "react";
import SnsLogin from "@/components/snsLogin";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";


export default function Login() {
  const [formData, setFormData] = useState({
    email:'',
    password:'',
  });
  const [error, setError] = useState({
    email:'',
    password:'',
    default:''
  });
  const [loading, setLoading] = useState(false);
  const onChange = (e:any) =>{
    const {name , value} = e.target;
    setFormData((pre) => ({
      ...pre,
      [name]:value
    }));
  };
  const router = useRouter();

  const onSubmit = async(e:any) => {
    e.preventDefault();
    setError((pre) => ({
      ...pre
    }));

    try{
      setLoading(true);
      const result = await signIn('credentials',{
        email:formData.email,
        password:formData.password,
        redirect:true,
        callbackUrl:'/'
      });

      if(result?.error){
        
      }else{
        router.push('/')
        setLoading(false);
      }
    }catch(error){

    }
  }
  return (
    <div className="flex justify-center w-1/3">
      <form onSubmit={onSubmit}>
      <Input name="email" type="email" placeholder="Email" required onChange={onChange} value={formData.email}/>
      <Input name="password" type="password" placeholder="Password" required  min={5}/>
      <Button>{loading ? '처리 중...' : '로그인'}</Button>
      </form>
      <SnsLogin/>
      <Link href={'/createAccount'}>회원가입</Link>
    </div>
  );
}
