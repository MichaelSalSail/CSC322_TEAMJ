const{app,BrowserWindow}=require('electron')
const url =require('url')
const path =require('path')

let win  

function createWindow(){ 
   // Module 1 - BrowserWindow
   win =new BrowserWindow({width:800, height:600}) 
   win.loadURL(url.format ({ 
      pathname: path.join(__dirname,'index.html'), 
      protocol:'file:', 
      slashes:true}))}  

// Module 2 - app
app.on('ready', createWindow)