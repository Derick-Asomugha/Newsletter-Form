import express from 'express';
import axios from 'axios';
import {fileURLToPath} from 'url'
import path, {dirname} from 'path'
import dotenv from 'dotenv'

dotenv.config();
const app = express();
const port = 3000;
// const response = await axios.get()
const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);

app.use(express.static(__dirName));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirName, "signup.html"))
})
app.post("/", async (req, res) => {
    let firstname = req.body.FName
    let lastname = req.body.LName
    let email = req.body.email
    
    let data ={
        members: [
            {
            email_address: email,
            status_if_new: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname,
            }
          }
        ], update_existing : true

    };
    let jsonData = JSON.stringify(data);
    const apiKey = process.env.API_KEY;
    const listID = process.env.LIST_ID;
    const dc = apiKey.split("-")[1];

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listID}`;

    try{
        const response = await axios.post(url, jsonData, {
            headers:{
                'Authorization': `Basic ${Buffer.from("anystring:" + apiKey).toString("base64")}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            res.sendFile(path.join(__dirName, "success.html"));
        }else{
            res.sendFile(path.join(__dirName, "failure.html"));
        }

    }  catch(error) {
        console.error(error.response ? error.response.data : error.message);
         res.sendFile(path.join(__dirName, "failure.html"))
    }

})
app.post("/failure", (req, res) => {
    res.redirect("/")
})

app.listen(process.env.PORT || port, () => {
    console.log(`server is working fine on port ${port}`);
    
})
// mailChimpKey:
// 809fcf431edb3318fbb00be3ccc3d3c0-us18
// listID
// 34b89b74f6