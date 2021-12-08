import { User } from "./user";

export class Account{
    username: string;
    email: string;
    experience: number;
    friends: User[];
    requests: User[];
    animations: string[];

    constructor(username: string, email: string, experience: number, friends: User[], requests: User[], animations: string[]){
        this.username = username;
        this.email = email;
        this.experience = experience;
        this.friends = friends;
        this.requests = requests;
        this.animations = animations;
    }

}