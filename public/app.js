//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const  _ = require('lodash');

const mongoose=require("mongoose");

const DB=process.env.DB_CONNECTION_URL;

mongoose.connect(DB ,{
  //dbName:"myblog" ,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // Add this line
  // useFindAndModify: false // Add this line
}).then(()=>console.log("Database Connected")).catch((e)=>console.log(e));

const blogSchema=new mongoose.Schema({
  title:String,
  content:String,
});

const blog=new mongoose.model("blogs",blogSchema);

const homeStartingContent = "The website features a simple and user-friendly interface. On the navbar, there is a 'Create Blog' button that users can click to create a new blog post. When the button is clicked, users are directed to a page where they can enter the title and content of their blog. Once users submit their blog post, it is automatically uploaded to the website. The blog post appears on the homepage alongside other published blogs. Users can browse through the existing blogs and read the full content by clicking on the 'Read more' link. The website aims to encourage users to express their thoughts and share their ideas through blogging. It provides a convenient and streamlined platform for users to create and publish their blogs without any technical knowledge or complex procedures. By simplifying the process and automating the blog upload, the website ensures that users can focus on their writing and easily share their content with others.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
   var posts=[];

//  app.get("/",function(req,res){
//   blog.find({}, function(err, posts) {
//     res.render('home', { StartingContent: homeStartingContent, posts: posts });
//   })
//   //  res.render('home',{StartingContent :homeStartingContent,
//   //    posts:posts});
//  })


app.get("/", async function(req, res) {
  try {
    const posts = await blog.find({});
    res.render('home', { StartingContent: homeStartingContent, posts: posts });
  } catch (err) {
    console.log(err);
    res.render('home', { StartingContent: homeStartingContent, posts: [] });
  }
});



app.get("/about",function(req,res){
  res.render('about',{AboutContent:aboutContent });
  // for (var i=0;i<posts.length;i++){
  //   console.log(posts);
  // }
 // console.log(posts);
});

app.get("/contact",function(req,res){
res.render('contact' ,{ContactContent:contactContent});
});

app.get("/compose",function(req,res){
res.render('compose' );
});


app.get("/hola",function(req,res){
   blog.create({title:"Heap" , content:"Hejjd sda adshdh"}).then(()=>{
    res.send("NIce");
   });
  
  });

app.post("/compose",function(req,res){
  const post = {
    title: req.body.postTitle,
    content:req.body.postBody
  };
  posts.push(post);
  blog.create(post);
  res.redirect("/");
});

// app.get("/posts/:postNames",function(req,res){

//   const requestedPost=req.params.postNames;
//   for(var i=0;i<posts.length;i++){
//     if(_.lowerCase(posts[i].title)==_.lowerCase(requestedPost))
//     {
//        res.render('post',{newpostitle: posts[i].title , newpostpara: posts[i].content});

//     }

//   }
// });
app.get("/posts/:postNames", async function(req, res) {
  const requestedPost = req.params.postNames;

  try {
    const post = await blog.findOne({ title: requestedPost });

    if (post) {
      res.render('post', { newpostitle: post.title, newpostpara: post.content });
    } else {
      res.render('post', { newpostitle: "Post Not Found", newpostpara: "The requested post was not found." });
    }
  } catch (err) {
    console.log(err);
    res.render('post', { newpostitle: "Error", newpostpara: "An error occurred while fetching the post." });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Server started on port 5000");
});
