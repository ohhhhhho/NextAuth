"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [formData, setFormData] = useState({
    name:'',
    email:'',
    password:'',
    passwordConfirm:''
  });
  const [error, setError] = useState({
    name:'',
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

    // if(!formData.email || !formData.name || !formData.password){
    //   setError((pre) => ({
    //     ...pre,
    //     default:'값을 채워주세요'
    //   }));
    // return;
    // };

    if(formData.password !== formData.passwordConfirm){
      setError((pre) => ({
        ...pre,
        password:'비밀번호가 일치하지 않습니다.'
      }))
      return;
    }

    try{
      setLoading(true);
      const response = await fetch('/api/user',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          name:formData.name,
          email:formData.email,
          password:formData.password
        })
      });

      const data = await response.json();
      
      if(!data.success){
        setError((pre) => ({
            ...pre,
            password:data.message
        }))
      }

      if(!response.ok){
        throw new Error(data.message || '회원 가입 처리중 오류 발생')
      }

      router.push('/')
      setLoading(false);
    }catch(error){
        console.error('회원가입 실패:', error);
    }
  }
  return (
    <div className="flex justify-center w-1/3">
      <form onSubmit={onSubmit}>
      <Input name="name" type="name" placeholder="Name" required onChange={onChange} value={formData.name}/>
      <Input name="email" type="email" placeholder="Email" required onChange={onChange} value={formData.email}/>
      <Input name="password" type="password" placeholder="Password" required  min={5}  onChange={onChange} value={formData.password}/>
      <Input name="passwordConfirm" type="password" placeholder="passwordConfirm" required  min={5}  onChange={onChange} value={formData.passwordConfirm}/>
      {error.password && <span>{error.password}</span>}
      <Button>{loading ? '처리중' : '회원가입'}</Button>
      </form>
    </div>
  );
}
