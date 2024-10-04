export class UserModel {
    id: number = 0;
    email: string = '';
    password: string = '';
    name: string = '';
    phoneNumber: string = '';
    address: string = '';
    avatar: any = null;
    role: string = '';
    status: string = '';
    token: any = null;

    constructor(auth?: UserModel) {
        if (auth) {
            Object.assign(this, auth);
        }
    }
}
