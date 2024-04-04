const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let server;
exports.startMongodb = async () => {
    server = await MongoMemoryServer.create();
   const serverUri = server.getUri();
   await mongoose.connect(serverUri);
//    console.log('server connected')
   mongoose.connection.on("error", (e) => {
      if (e.error.code === "ETIMEDOUT") {
         console.log(e);
         mongoose.connect(serverUri, {dbName: "blog-api"});
      }
      console.log(e);
   });

   mongoose.connection.once("open", () => {
      console.log(`MongoDB successfully connected to ${serverUri}`);
   });
};

exports.stopMongodb = async()=>{
    await mongoose.disconnect()
    await server.stop()

}