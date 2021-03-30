let $ = require('jquery')
let fs = require('fs')
let filename = 'contacts'
let sno = 0

$('#add-to-list').on('click', () => {
   let email = $('#Email').val()
   let password = $('#Password').val()

   fs.appendFile('contacts', email + ',' + password + '\n')

   addEntry(email, email) 
})

function addEntry(email, password) {
   if(email && password) {
      sno++
      let updateString = '<tr><td>'+ sno + '</td><td>'+ email +'</td><td>' 
         + password +'</td></tr>'
      $('#contact-table').append(updateString)
   }
}

function loadAndDisplayContacts() {  
   
   //Check if file exists
   if(fs.existsSync(filename)) {
      let data = fs.readFileSync(filename, 'utf8').split('\n')
      
      data.forEach((contact, index) => {
         let [ email, password ] = contact.split(',')
         addEntry(email, password)
      })
   
   } else {
      console.log("File Doesn\'t Exist. Creating new file.")
      fs.writeFile(filename, '', (err) => {
         if(err)
            console.log(err)
      })
   }
}

loadAndDisplayContacts()