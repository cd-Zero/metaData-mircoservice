// require npm packages
const express = require('express');
const multer   = require('multer');
const port     = 7777;

//template engine
const ejs = require('ejs');

// file system - needed to loop through files
const fs = require('fs');
const path = require('path');
const process = require('process');
//initialize express
const app      = module.exports = express();
const upPath   = "./public/uploads/"

// EJS setup
//view engine = ejs
app.set('view engine', 'ejs')
//Setup public folder
app.use(express.static('./public'))

// set multer storage engine!
const storage = multer.diskStorage({
  // where in filne structure will multer save data?
  destination: './public/uploads/',
  // multer name handling- file will have a neame of filedname + -date+ original file extention (ex:jpeg,txt, etc..)
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
// set up storage option - for STORAGE use our STORAGE engine!
// set to SINGLE FILE upload set to input name of
const upload = multer({
  storage: storage
}).single("myFile")

app.get("/", (req,res) => {
  // render form for user input
  res.render('index');
})

app.post('/upload',(req,res)=>{
  // handle form response and post to multer local storage

  console.log('post works');

  upload(req,res,(err)=>{
    if(err){
      console.log('rendered index - err');
      res.render('index',{
        msg: err
      })
    }
    //file data exposed
    // what would you like to do to data.
    else if (req.file == undefined){
      console.log('rendered index - req.file is undefined');

        res.render('index',{
          msg: 'no file selected'
        })
    }
    else {
      console.log('rendered output');

      let resObject = {
        msg: 'File uploaded!',
        file: `${req.file.filename}`,
        filesize:`${req.file.size} bytes`
      };

      res.render('output', resObject);
    }


  })
})

app.get("/allfiles", function(req,res,next){
// render page+ allow content to be diplayed
res.render('outputAll', {data: fileData})
  // console.log(fileData);
});

// create file data array
// look at uploads and initialize array of data
let fileData = new Array()
function run(){

  fs.readdir(upPath, function(err,files){
    if(err){
      console.log(err);
    }
    else {
    loadAllFiles(files)
  };
});
};
run();



function loadAllFiles(files) {
  files.forEach(function(file, index){
      let truePath = upPath+file
    fs.stat(truePath, function(err,stats){
      // console.log(stats.size);
      let size = stats.size;
      let name = file;
      let time = stats.birthtime;
      let obj  = {'name':name,
                  'size':size,
                  'time': time}

    fileData.push(obj);
  })
});
}


app.listen(port, function(){
  console.log('listening on port '+port);
})
