const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb+srv://admin_subhranshu:<your password>@cluster0.one0j.mongodb.net/wikiDB"); // here wikiDB is my database to store the data on MongoDB

const articleSchema = {
    title: String,
    content: String
}; // creating the skeliton

const Article = mongoose.model("Article", articleSchema); // make the model or skeliton of the collection.
// Article ==> will change to articles.

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

// OLD METHOD



// app.get("/articles",(req,res)=>{
//     Article.find((err,articles)=>{
//         if(err){
//             res.send(err);
//         }else{
//             res.send(articles);
//         }
//     });
// });

// app.post("/articles",(req,res)=>{
    
//     console.log("Data received.")

//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save((err)=>{
//         if(err){
//             res.send(err);
//         }else{
//             res.send("Request accepted.");
//         }
//     });

// });

// app.delete("/articles",(req,res)=>{
//     Article.deleteMany((err)=>{
//         if(err){
//             res.send(err);
//         }else{
//             res.send("Article DB deleted.");
//             console.log("Articles deteletd.")
//         }
//     });
// });

// New Method *************

app.get("/",(req,res)=>{
    res.send("Welcome! Go to /articles for the API resources.");
});

app.route("/articles")
.get((req,res)=>{
    Article.find((err,foundArticles)=>{
        if(err){
            res.send(err);
            console.log("Error in fetching data. GET method error!");
        }else{
            res.send(foundArticles);
            console.log("Articles being viewed by user. GET method!");
        }
    })
}) // should not use semicolon ; as we are not being ending the code.

.post((req,res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err)=>{
        if (err) {
            res.send(err);
            console.log("Error in saving Data.");
            
        }else{
            res.send("Data received! and saved.");
            console.log("Data received and saved. POST method!");

        }
    });
})

.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(err){
            res.send(err);
            console.log("Error in deleteing data. DELETE method!");

        }else{
            res.send("Data has been deleted successfully.")
            console.log("Data has been deleted. DELETE method!");

        }
    })
});

// specific article operation

app.route("/articles/:articleTitle")
    .get((req,res)=>{
        Article.findOne({title: req.params.articleTitle},(err,foundArticle)=>{
            if(foundArticle){
                res.send(foundArticle);

            }else{
                if(err){
                    res.send(err);
                }else{
                    res.send("No article matched.")
                }
            }
        });
    })

    .put((req,res)=>{
        
        Article.updateOne({title:req.params.articleTitle},{$set:{title:req.body.title,content:req.body.content}},(err)=>{
            if(err){
                res.send(err);
                console.log("Error! PUT method");
            }else{
                res.send("Data updated successfully.");
                console.log("Data updated successfully.PUT method!")
            }
        });
    })
    .patch((req,res)=>{
        Article.updateOne({title:req.params.articleTitle},{$set:req.body},(err)=>{
            if(err){
                res.send(err);
            }else{
                res.send("Patch Completed");
            }
        })
    })
    .delete((req,res)=>{
        Article.deleteOne({title:req.params.articleTitle},(err)=>{
            if (err) {
                res.send(err);
            } else {
                res.send("Delete operation completed.");
            }
        })
    });






app.listen(3000, ()=>{
    console.log("==> server started on port 3000 !");
});