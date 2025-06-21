export interface FormData{
    email: string;
    password: string;
}

export interface Memo {
    id: number;
    title: string;
    content: string;
}


export interface User {
    id: number;
    username: string;
    email: string;
}

export interface RegisterFormData {
    username: string;
    email:string;
    password: string;
    password2:string;
}

export interface Booking {
   id: number;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    username?: string;
    user?: number;
    description?: string;
    created_at?: string;
}