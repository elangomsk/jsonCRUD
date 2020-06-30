const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');  
const urlencodedParser = bodyParser.urlencoded({ extended: false })  

const CheckAccess = (req,res,next) => {
  var auth = req.get("authorization");
  if (!auth) {
    res.set("WWW-Authenticate", "Basic realm=\"Authorization Required\"");
    return res.status(401).send("Authorization Required");
  } else {
    var credentials = Buffer.from(auth.split(" ").pop(), "base64").toString("ascii").split(":");
    if (credentials[0] === "admin" && credentials[1] === "admin") {
      next();
    } else {
      return res.status(401).send("Access Denied (incorrect credentials)");
    }
  }
}

app.use(CheckAccess);

app.post('/create_form', urlencodedParser, (req, res) => {  
   response = {  
       address:req.body.address?req.body.address:"",  
       username:req.body.username?req.body.username:"",
       password:req.body.password?req.body.password:"",  
       host:req.body.host?req.body.host:""
   };      
  fs.writeFile("config.json", JSON.stringify(response), 'utf8',  (err) => {
      if (err) {
        return res.status(401).send("An error occured while writing JSON Object to File.");
      }   
      return res.status(200).end("JSON file has been created.");
  }); 
})  

app.post('/update_form', urlencodedParser, (req, res) => {  
   response = {  
       address:req.body.address?req.body.address:"",  
       username:req.body.username?req.body.username:"",
       password:req.body.password?req.body.password:"",  
       host:req.body.host?req.body.host:""
   };  
  fs.access("config.json", fs.F_OK, (err) => {
    if (err) {
      return res.status(404).send("No such file or directory");        
    }else{
      fs.writeFile("config.json", JSON.stringify(response), 'utf8',  (err) => {
          if (err) {
              return res.status(401).send("An error occured while writing JSON Object to File.");
          }   
          return res.status(200).end("JSON file has been updated.");
      });
    }
  });
})  


app.get("/read", (req, res, next) => {
  fs.access("config.json", fs.F_OK, (err) => {
      if (err) {
        return res.status(404).send("No such file or directory");
      }else{
        fs.readFile('config.json', 'utf8', (err,data) => {
          if (err) {
            return res.status(401).send("Something went to wrong");
          }
          return res.status(200).send(data);
        });
      }
  });
});

app.delete("/delete", (req, res, next) => {
  fs.access("config.json", fs.F_OK, (err) => {
      if (err) {
        return res.status(404).send("No such file or directory");
      }else{
        fs.unlink('config.json', (err) =>{
          if (err){
            return res.status(401).send("Something went to wrong");
          }else{
            return res.status(200).send("File deleted!"); 
          }
        }); 
      }
  });
});

app.get("/create", (req, res, next) =>{
  // json data
  var jsonData = '{"address":"elangomsk@gmail.com","username":"elango","password":"12345","host":"localhost"}';
  // parse json
  var jsonObj = JSON.parse(jsonData);
  // stringify JSON Object
  var jsonContent = JSON.stringify(jsonObj);

  fs.access("config.json", fs.F_OK, (err) => {
      if (err) {
        fs.writeFile("config.json", jsonContent, 'utf8',  (err) => {
            if (err) {
                return res.status(401).send("An error occured while writing JSON Object to File.");
            } 
            return res.status(200).send("JSON file has been created.");
        });
      }else{
        return res.status(200).send("File already Exits");
      }
  });
});

var server = app.listen(666, function () {
   var host = server.address().address
   var port = server.address().port   
   console.log("Server Running at http://%s:%s", host, port)
})