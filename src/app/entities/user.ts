import { Authority } from "./authority";

export class User {
    id: number;
    firstName: string;
    lastName: string;
    birthdate: string;
    age: number;
    email: string;
    phone: string;
    username: string;
    image: Uint8Array;
    createAt: Date;
    verified: boolean;
    role: string;
    maxNumberStudents: number | null;
    enabled: boolean;
    authorities: Authority[];
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    accountNonLocked: boolean;
}