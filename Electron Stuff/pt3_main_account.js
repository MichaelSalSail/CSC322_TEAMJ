const{app,BrowserWindow}=require('electron')
const url =require('url')
const path =require('path')

let win

function createWindow(){
    win =new BrowserWindow({width:800, height:600,
                                webPreferences:
                                {
                                nodeIntegration: true,
                                contextIsolation: false
                                }
                            })
   win.loadURL(url.format ({
      pathname: path.join(__dirname,'pt3_index_account.html'),
      protocol:'file:',
      slashes:true}))}

app.on('ready', createWindow)