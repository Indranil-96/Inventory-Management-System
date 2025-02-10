 import { body, validationResult } from "express-validator";
 const validateData= async (req,res,next)=>{
    //Setup rules for validation...
    const rules=[
        body('name').notEmpty().withMessage('Name Can not be empty'),
        body('url').custom((value, {req}) =>{
            if(!req.file){
                throw new Error ('Image is required');
            }
            return true;
        })
    ];

    // Running the rule....
    await Promise.all(
        rules.map((rule)=> rule.run(req))
    );

    // Result....
    const errs=validationResult(req);
    
    console.log(errs);
    if(!errs.isEmpty()){
        return res.render('addproduct',{errormessage:errs.array()[0].msg});
    }
}

export default validateData