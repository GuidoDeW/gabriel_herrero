const submitBtn = document.getElementById("contact-submit-btn"),
  inputFields = document.querySelectorAll(".input-field");

// use regexs to check for correct input. Replace required attribute
// with class (or alter behaviour of required input fields) to display
// red text inside empty required fields upon submit.
// Upon succesful submit, replace form with text (and perhaps an img)
// and a button allowing the user to send another message (reload the form)
// without having to reload the whole page.

// Finally, save input to LS so as to allow reloads without progress loss.
