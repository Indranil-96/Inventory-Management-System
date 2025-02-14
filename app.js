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
import UserDB from './models/user-db.js';
import session from 'express-session';
import auth from './middleware/auth.js';
import cookieParser from 'cookie-parser';
import lastvisit from './middleware/lastvist.js';


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
app.use(express.static(path.join(__dirname, 'public')))// Statically exposed the public folder to our app .
app.use(session({ // here we have configured the session but we must have to use keygenerator for secret.
    secret:"secretkey",
    resave:false,
    saveUninitialized: true,
    cookie:{secure: false}
}));

app.use(cookieParser());
app.use(lastvisit);


//Routing methods....
app.get('/' , auth,(req,res)=>{
    const collections=DataBase.getdata();
    res.render('product',{collections,userEmail: req.session.userEmail});
});

app.get('/new',auth, (req,res)=>{
    res.render('addproduct', {errormessage:null});
})

app.post('/',UploadFile.single('url'),auth,validationMiddleware,(req,res)=>{
    const {name,des}= req.body; // destructure data from request...
    const url= "/images"+ req.file.filename;
// Adding data to database....
    DataBase.addData(name, des ,url);
    const collections=DataBase.getdata(); 
    console.log(collections);
    return res.render('product',{collections,userEmail: req.session.userEmail});
})

app.get('/update/:id',auth,(req,res)=>{
    const id=req.params.id;
    const foundProduct=DataBase.getById(id);


    if(foundProduct){
        res.render('updateproduct', {element:foundProduct,errormessage:null});
    }else{
        res.status(401).send('Product not found');
    }
})

app.post('/update',auth,(req,res)=>{
    DataBase.updateData(req.body);
    const collections=DataBase.getdata();
    res.render('product',{collections,userEmail: req.session.userEmail});
})

app.post('/delete/:id',auth,(req,res)=>{
    const id=req.params.id;
    DataBase.deleteData(id);
    const collections=DataBase.getdata();
    res.render('product',{collections,userEmail: req.session.userEmail})
})

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register', (req,res)=>{
    const {name, email, password}= req.body;
    UserDB.addUser(name,email,password);
    res.redirect('/login');
})

app.get('/login',(req,res)=>{
    res.render('login',{errormessage:null});
});

app.post('/login',(req,res)=>{
    const {email, password}= req.body;
    const userauth=UserDB.isValidUser(email, password);

    if(!userauth){
        return res.render('login',{errormessage:"Invalid credintial"});
    }

    req.session.userEmail=email; // Assigining email to session 

    const collections=DataBase.getdata();
    return res.render('product',{collections,userEmail: req.session.userEmail}); // Sending userEmail for conditional rendering....
});

app.get('/logout',(req,res)=>{
// on Logout destroy the session....
    req.session.destroy((err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/login');
        }
        res.clearCookie('lastvisit'); // deleting or clearing cookies..
    })
});

// Listining server to the port.....
app.listen(port,(err)=>{
    if(err){
        console.log('An error occured');
    }else{
        console.log(`Server is listning to the port http://localhost:${port}`);
    }
})