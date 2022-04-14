import mongoose from "mongoose"

let connection= () => {
    mongoose.connect('mongodb+srv://leandro:coderMongo123@clustercoderdesafio.x9swe.mongodb.net/ecommerce?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true
    },error => {
    if(error) throw new Error ('Can not connect to MongoDB')
    console.log("Connected to Data Base")
})}

export default connection