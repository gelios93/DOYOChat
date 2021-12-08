export class User {
    username: string;
    icon: string;
    experience: number;

    constructor(username: string, icon: string, experience: number){
        this.username = username;
        this.icon = icon;
        this.experience = experience;
    }
}