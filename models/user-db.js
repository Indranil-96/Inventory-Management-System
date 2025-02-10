class UserModel{
    constructor(id,name,email,password){
        this.id=id;
        this.name=name;
        this.email=email;
        this.password=password;
    }

    static addUser(name,email,password){
        const newuser= new UserModel(Users.length+1,name,email,password);
        Users.push(newuser);
    }

    static isValidUser(email, password){
       const result = Users.find((u)=>u.email == email && u.password == password);

        return result;
    }
}

let Users=[];

export default UserModel;