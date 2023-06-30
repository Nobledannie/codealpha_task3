const express = require("express")
const multer = require('multer')
const Converter = require('csv-converter-to-pdf-and-html')
const path = require('path')
const fs =  require('fs')
const app = express()
app.use(express.static("public/uploads"))

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    },
})

var upload = multer({ storage: storage}).single("csv");


app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post('/convert', (req, res) => {
    output = Date.now() + "output"
    upload(req, res, (err) => {
        if(err){
            console.log(err)
        }else{
            console.log(req.file.path)

            const converter = new Converter();
            const filePath = path.resolve(req.file.path);
            const destinationPath = path.resolve("./" + output);
            converter.HTMLAndPDFConverter(filePath, destinationPath)
            .then(filePath, () =>{
                res.send(filePath)
            }).catch(err => {
                console.log(err);
                res.status(500).json({mesage: "Internal server error!"})
            });
        }
    })
})

app.listen(3000, () => {
    console.log("Application is running on port 3000!")
})