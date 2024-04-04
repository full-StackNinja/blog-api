const app = require("./appTest");
const request = require("supertest");
require("dotenv").config();
const mongoConfigTesting = require("../mongoConfigTesting");

const Author = require("../models/author");
const expressAsyncHandler = require("express-async-handler");

let chai;
let assert;
let token;
let expect;
before(async () => {
   chai = await import("chai");
   assert = chai.assert;
   expect = chai.expect;
   await mongoConfigTesting.startMongodb();
});

beforeEach(async () => {
   const res = await request(app).post("/api/author/signup").send({
      firstName: "Imran",
      lastName: "Hussain",
      username: "author1",
      email: "author1@gmail.com",
      password: "author1@password",
      "conf-password": "author1@password",
   });
});

afterEach(async () => {
   await Author.deleteMany();
});

after(async () => {
   await mongoConfigTesting.stopMongodb();
   console.log("database stopped");
});

describe("Post routes suite", function () {
   it("should login successfully", async function () {
      const userCredentials = {
         email: "author1@gmail.com",
         password: "author1@password",
      };
      const author = await Author.findOne({ email: "author1@gmail.com" });

      const response = await request(app)
         .post("/api/author/login")
         .send(userCredentials);
      console.log("🚀 ~ response ~ response:", response.body);
      token = response.body.token;
      expect(response.body.success).to.be.equal(true);
      expect(response.body.message).to.be.equal("login successful");
      expect(response.body.token).to.be.a("string");
   });

   it("should create new post", async function () {
      const author = await Author.findOne({ email: "author1@gmail.com" });
      if (!author) throw new Error("Author not found");
      console.log("🚀 ~ author._id:", author._id);
      const newPost = {
         author: author._id.toString(),
         title: "First post",
         description: "First post description",
      };
      const res = await request(app)
         .post("/api/posts")
         .type("form")
         .set("Authorization", `Bearer ${token}`)
         .send(newPost);
      console.log("🚀 ~ res:", res.status);
   });

   it("should get all the posts", async () => {
      const res = await request(app).get("/api/posts");
      const allPosts = res.body.all_posts;
      expect(allPosts).to.have.lengthOf(1);
      expect(allPosts[0]).to.have.property("title").with.lengthOf(10)
   });
});
