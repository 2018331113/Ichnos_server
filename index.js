const express = require('express')
var cors =require('cors');
const app = express();
app.use(cors());

const mongoose=require('mongoose');
const router = express.Router();



app.use(express.json());


const connectDB=async ()=>{


try {
    await mongoose.connect('mongodb://127.0.0.1:27017/Ichnos');
    console.log("Db is connected")

} catch (error) {
    console.log("Db is not connected");
    console.log(error.message);
    process.exist(1);
}

}





//creating schema for vacant list

const vacantschema = new mongoose.Schema({
    p_id: String,
    title: {
        type: String,
        required: true
    },
    des: String,
    org:String,
    vac:Boolean,
    createdAt:{
        type:Date,
        default:Date.now
    },
    openingdate:String,
    closingdate: String,
    fundstatus: String






});






//creating model for vacant

 const vacantdoc=mongoose.model("Vacants",vacantschema)



//creating tender rq schema

const tenderschema = new mongoose.Schema({
    
   p_id: String,
   companyname:String,
   des: String,
   accpt:Boolean,
   







});

//creating tender rq model

const tenderdoc=mongoose.model("Tenderlist",tenderschema);



//posting to vacant
var p_id=1010;

app.post("/vacants",async (req,res)=>{

    try {
        p_id++;
        let text=p_id.toString();

        const newVacant= new vacantdoc({
            p_id: text,
            title: req.body.title,
            des: req.body.des,
            org:req.body.org,
            vac:1,
            openingdate:req.body.openingdate,
            closingdate: req.body.closingdate,
            fundstatus: req.body.fundstatus

        })
        const data = await newVacant.save();
        res.status(201).json(data);
        
    } catch (error) {
        res.status(500).send({message:error.message})
    }
});

//posting to tender list

app.post("/tenderlists",async (req,res)=>{

    try {
        const newTender= new tenderdoc({
            p_id: req.body.p_id,
            companyname:req.body.companyname,
            des: req.body.des,
            accpt:0,
            

        })
        const data2 = await newTender.save();
        res.status(201).json(data2);
        
    } catch (error) {
        res.status(500).send({message:error.message})
    }
});


//get tender list

app.get("/get_fulltenderlists",async (req,res)=>{

    try {
        const data3 =await tenderdoc.find()
        
       if(data3){
        res.status(200).json(data3);
       }
        
    } catch (error) {
        res.status(404).send({message:"Not found"})
    }
});


//get tender list againts project id

app.get("/get_tenderlists",async (req,res)=>{

    try {
        const data3 =await tenderdoc.find({p_id:req.body.p_id},)
        
       if(data3){
        res.status(200).json(data3);
       }
        
    } catch (error) {
        res.status(404).send({message:"Not found"})
    }
});




//get only vacant list true

app.get("/get_vacantlists",async (req,res)=>{

    try {
        const data4 =await vacantdoc.find({vac:true})
        console.log("Vacant api worked");
       if(data4){
        res.status(200).json({data4});

       }
        
    } catch (error) {
        res.status(404).send({message:"Not found"})
    }
});

//gettiing vacant list agains vacant id

app.get("/get_id",async (req,res)=>{

    try {
        const data4 =await vacantdoc.find({_id:req.body.id})
        
       if(data4){
        res.status(200).json(data4);
       }
        
    } catch (error) {
        res.status(404).send({message:"Not found"})
    }
});


//accepting a tender request
//deleteing granted work from vacant 
// send me a client id

app.put("/accept",async (req,res)=>{

    try {
        const data3 =await tenderdoc.updateOne({_id:req.body.client_id},
            
            {
                $set:{accpt:true}
            }
            
            
            )
           // console.log(req.body.client_id);
            const data5= await tenderdoc.find({_id:req.body.client_id});
           
            //console.log(data5);
            const data6= data5[0].p_id;
            


            const data8 =await vacantdoc.updateOne({p_id:data6},
            
                {
                    $set:{vac:false}
                }
                
                
                )

        
        
       if(data8){
        res.status(200).json({sucess:true,
        message:'updated',
        data:data3
        });
       }
        
    } catch (error) {
        res.status(404).send({message:error.message})
    }
});



//list of granted  live project

app.get("/grantdetails",async (req,res)=>{

    try {
        
        const data7= await vacantdoc.aggregate([
        
       
          
          
          {  $lookup:{
                from:'tenderlists',
                localField:'p_id',
                foreignField:'p_id',
                as:"result"
             }

            },
          {$unwind:"$result"} ,
          {   
            $project:{
                p_id : 1,
                title : 1,
                des : 1,
                org: 1,
                client_id:"$result._id",
                company_name:"$result.companyname",
                fundstatus:1,
                
            } 
        }

        ]);
        console.log(data7);
       if(data7){
        res.status(200).json(data7);
       }
        
    } catch (error) {
        res.status(404).send({message:error.message})
    }
});












app.get('/',(req,res)=>{ 
    res.send("yo");
}
)









app.listen(3000,async()=>{
    console.log("yey, server  running on 3000");
    await connectDB();

 });

