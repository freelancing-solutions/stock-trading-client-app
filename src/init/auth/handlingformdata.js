


// this listens for page load event
self.addEventListener('load', e => {
    //you need to attach the event handler to submit-button after the page has loaded
    document.getElementById('submit-button').addEventListener(e => {
        e.preventDefault();
        // obtain form elements here
        const value1 = document.getElementById('elementid').value
        const value2 = document.getElementById('elementid2').value



    })
})