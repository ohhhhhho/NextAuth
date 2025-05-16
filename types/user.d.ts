export interface LoginForm{
    email:string;
    password:string;
}
export interface RequestBody{
    name: string;
    email: string;
    password: string;
}
export interface User{
    id:string;
    email:string;
    name:string;
    role?:'admin' | 'user';
}