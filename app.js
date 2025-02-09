import express from 'express';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import DataBase from './models/db.js';
import validationMiddleware from './middleware/validation.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { UploadFile } from './middleware/fileUpload.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Destructuring data
const port=process.env.port || 3300;


// Accuring express in our app
const app= express();

//Middlewares....
app.set('view engine', 'ejs'); // setting viewengine
app.set(path.join(__dirname, 'views')); // setting view path
app.use(express.static('views')); // seting static file path of view
app.use(express.urlencoded({extended:true})); // To parse form data
app.use(express.static('public'))// Statically exposed the public folder to our app .


//Routing methods....
app.get('/' , (req,res)=>{
    const collections=DataBase.getdata();
    res.render('product',{collections});
});

app.get('/new', (req,res)=>{
    res.render('addproduct', {errormessage:null});
})

app.post('/',UploadFile.single('url'),validationMiddleware,(req,res)=>{
    const {name,des,url}= req.body; // destructure data from request...

// Adding data to database....
    DataBase.addData(name, des ,url);
    const collections=DataBase.getdata(); 
    console.log(collections);
    return res.render('product',{collections});
})

app.get('/update/:id',(req,res)=>{
    const id=req.params.id;
    const foundProduct=DataBase.getById(id);


    if(foundProduct){
        res.render('updateproduct', {element:foundProduct,errormessage:null});
    }else{
        res.status(401).send('Product not found');
    }
})

app.post('/update',(req,res)=>{
    DataBase.updateData(req.body);
    const collections=DataBase.getdata();
    res.render('product',{collections});
})

app.post('/delete/:id',(req,res)=>{
    const id=req.params.id;
    DataBase.deleteData(id);
    const collections=DataBase.getdata();
    res.render('product',{collections})
})


// Listining server to the port.....
app.listen(port,(err)=>{
    if(err){
        console.log('An error occured');
    }else{
        console.log(`Server is listning to the port http://localhost:${port}`);
    }
})