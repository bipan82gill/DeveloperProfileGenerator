const inquirer = require("inquirer");
const fs = require("fs");
const axios = require("axios");
const util = require("util");
var pdf = require('html-pdf');

const writeFileAsync = util.promisify(fs.writeFile);
function promptUser() {
  return inquirer
  .prompt([
    {
      type : "input",
      message: "Enter your GitHub username:",
      name: "username"
  },
    {
    
      type: "input",
      name: "color",
      message: "What is your favorite color?"
    }
  ])
   .then(function({ username, color }) {

    const queryUrl = `https://api.github.com/users/${username}`;
   
    axios.get(queryUrl).then(function(res){
    //  console.log(res);
      // console.log(res.data.blog);
      // console.log(res.data.location);
      // console.log(res.data.bio);
      // console.log(res.data.public_repos);
      // console.log(res.data.followers);
      // console.log(res.data.following);
      const html = generateHTML(res.data, color);
      
      fs.writeFile("index.html", html, function(err, data){
        if(err) throw err;
        console.log("Successfully wrote to index.html");
      });
      
var options = { format: 'Letter' };
 
pdf.create(html, options).toFile('./developer.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res);
});

    });

  });
  
}
function generateHTML(answers, color) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body style= "background-color:${color};">
  <div class="container">
    <h1 class="display-4">Developer Profile Generator</h1>
    <div class = "container-body">
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is<b> ${answers.login}</b></li>
      <li class="list-group-item"><b>${answers.login}</b> is located at <b>${answers.location}</b></li>
      <li class = "list-group-item">Github Followings are <b>${answers.following}</b></li>
      <li class = "list-group-item">Github repositories are <b>${answers.public_repos}</b></li>
      <li class = "list-group-item">Github Followers are <b>${answers.followers}</b></li>
    </ul>
  </div>
</div>
</body>
</html>`
}
promptUser();


