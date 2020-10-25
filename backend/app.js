
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
const Code = require('./models/back')
const stripe = require('stripe')('sk_test_51HeRnmGPr7sSTt4UQlwggYKWtGy254EzuxFZMOwgojpx22FgOXXO7JUrm9AeJnG2PleUEnXsmKnwwivLBemXkW0o00ur2gx0Uu')


require('dotenv').config();

// import routes

// app
const app = express();

// db
const PORT = process.env.PORT
const MONGO_URL = process.env.DATABASE || 'mongodb+srv://nitesh:Siu33005@cluster0.etasl.mongodb.net/task-one?retryWrites=true&w=majority'
mongoose.connect(MONGO_URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true 
    }).then( (data,error) =>{ 
          if(error){
                console.log("Have a some error",error)
          }else{
                console.log('Database connected')
          }
    })



// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use(cors());



app.post('/back',(req,res)=>{

      const code = new Code(req.body);
    code.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: "Something Else"
            });
        }
        res.json({ data });
    });
})

app.get('/back',(req,res)=>{
    Code.find({}).exec( (err,data) =>{
        if(err){
              res.status(400).json({
                    error:"Something else"
              })
        }
        res.json(data)
  })


})

app.post('/user',(req,res)=>{
      const {name} = req.body
      console.log(name)
      Code.findOne({name}).exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Something else"
                });
            } 
            if(!data){
                  return res.status(400).json({
                        error: "Id donot match"
                    });
                  
            }else{
                  const d1 = new Date()
                  const d2 = data.date

                  if(d2.getTime() > d1.getTime()){
                        console.log("d2",d2)
                  console.log(d1)
                 return res.json(data);
                  }else{
                        return res.status(400).json({
                              error: "Your Id is Expired"
                          });   
                  }

                  
            }
        });
})

app.delete('/remove/:slug',(req,res)=>{

    const name = req.params.slug.toLowerCase()
    console.log(name)
    
    Code.remove({name}).exec( (err,category) =>{
        if(err){
              res.status(400).json({
                    error:"Something else"
              })
        }
        res.json({
              message:"Data delete successfully"
        })
  })
})

app.post("/payment",(req,res) =>{

      const totalamount = req.body.totalamount;
      const token = req.body.token;

      stripe.customers.create({
            email:token.email,
            source:token.id
          })
            .then(customer => {
                  stripe.charges.create({
                        amount:totalamount*100,
                        currency:'usd',
                        customer:customer.id,
                        receipt_email:token.email
                  })
            }).then( result => res.status(200).send(result))
            .catch(error => console.error(error));
})



//app.use('/api', orderRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
