// funktionalitet för auction.html

function createAuction() {

  let endpoint = "http://nackowskis.azurewebsites.net/api/auktion/100";

 // Selectors för vart all data ska sättas in.
  let beskrivning = document.getElementById('newAuctionDescription').value;
  let slutdatum = document.getElementById('endDate').value;
  let utropspris = document.getElementById('newAuctionPrice').value;
  let startdatum = document.getElementById('startDate').value;
  let titel = document.getElementById('auctionName').value;

  // Skapa JSON objektet för all data
  let JSON =  {
    "AuktionID": 30,
    "Titel": titel,
    "Beskrivning": beskrivning,
    "Utropspris": utropspris,
    "Startdatum": startdatum,
    "Slutdatum": slutdatum,
    "Gruppkod": 100
  };

  //Kontrollerar att alla fält är ifyllda, gör en POST om de är det. Annars meddela användare att information saknas.
  if(titel !== "" && beskrivning !== "" && utropspris !== "" && startdatum !== "" && slutdatum !== "") {
    api.postData(endpoint,JSON);
    alert("Ny auktion skapad");
    console.log("Yay!")
  } else {
    alert("Fyll i alla fält");
  console.log("Information saknas");
  }
} // end createAuction Function

// Appenda funktionen till knappen
var newAuction = document.getElementById("skapaAuktion");
newAuction.addEventListener("click", createAuction);
