// includeFooter.js
document.addEventListener("DOMContentLoaded", function() {
  fetch("footer.html")
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML("beforeend", data);
      
      // Add the script for handling the footer behavior here if needed
      var script = document.createElement('script');
      script.src = 'path/to/footerScript.js'; // Include the correct path to your footer script
      document.head.appendChild(script);
    })
    .catch(error => console.error("Error fetching footer:", error));
});