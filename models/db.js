class DataBase{
    constructor(_id,_pname,_descr,_url){
        this.id=_id;
        this.pname=_pname;
        this.descr=_descr;
        this.url=_url;
    }

    static getdata(){
        return products;
    }

    static addData(pname,descr,url){
        const newdata= new DataBase(products.length+1,pname,descr,url);
        products.push(newdata);
    }

    static getById(id){
        //If product exsist then return view.....
            return products.find((p)=> p.id == id)
        //else return error...
    }

    static updateData(productobj){
        const index=products.findIndex((p)=> p.id == productobj.id);
        products[index]=productobj;
    }

    static deleteData(id){
        const index= products.findIndex((product)=> product.id==id);
        products.splice(index,1);
    }
}
let products=[
    new DataBase(1,'Robert Jordan','Book','https://covers.openlibrary.org/b/id/980232-M.jpg'),
    new DataBase(2,'Court Mist Fury','Book','https://covers.openlibrary.org/b/id/14315081-M.jpg'),
    new DataBase(3,'Game of Thorns','Book','https://covers.openlibrary.org/b/id/9269962-M.jpg'),
    new DataBase(4,'Pockemon','Book','https://covers.openlibrary.org/w/id/12670278-M.jpg'),
]

export default DataBase;