let $ = require('jquery')  // jQuery now loaded and assigned to $
let count = 0
// click-counter and countbtn both defined in index_click
$('#click-counter').text(count.toString())
$('#countbtn').on('click', () => {
   count ++ 
   $('#click-counter').text(count)
}) 