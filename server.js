const express = require("express");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// instantiate an express app
const app = express();

//nodemailer
app.use("/", express.static(process.cwd() + "/")); //make public static

const transporter = nodemailer.createTransport({
  service: 'smtp-relay.gmail.com4',
  port: 587,
  auth: {
    user: 'rybenskyphoto@gmail.com',
    pass: 'vfrntixyaoyrudji'
  }
})

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/send", (req, res) => {
  //1.
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });

    //2. You can configure the object however you want
    const mail = {
      from: data.email,
      to: 'Robin.Palatas@gmail.com',
      subject: data.subject,
      text: `${data.firstName} ${data.lastName}\n
             ${data.email} 
             \n${data.message}`,
    };

    //messages if email was sent or no
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong, try again please." });
      } else {
        res.status(200).json({ message: "Email was sent!" });
      }
      
    });
  });
});

//Index page (static HTML)
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/index.html");
});

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

