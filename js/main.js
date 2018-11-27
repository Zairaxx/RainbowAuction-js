
async function createPage(data) {

	//Funktion för random color
	function getRandomColor() {
		var hex = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
		  color += hex[Math.floor(Math.random() * 16)];
		}
		return color;
	}

		let pageContainer = document.getElementById('content');
		pageContainer.innerHTML = "";

		// loopa igenom allt och kasta in i en div
		for(let i = 0; i < data.length; i++){

		let thisDate = new Date();
		let auctionEndDate = new Date(data[i].SlutDatum);

		// Steg 2 - Hämta alla bud för denna auktion

		let bid = await bud.getBids(data[i].AuktionID)

		// Steg 3 - Find the highest bid or set var highestCurrentBid to Utropspris

		let highestCurrentBid;

		if(bid == 0){
		highestCurrentBid = data[i].Utropspris;
		} else {
			let allBids = bid.sort((a, b)=> (a.Summa < b.Summa));
			highestCurrentBid = allBids[0].Summa;
		};

		let titleLetters = document.getElementsByClassName("randomizeColor");

		for (let x = 0; x < titleLetters.length; x++){
			titleLetters[x].style.color = getRandomColor();
		}
		let allAuctions = document.getElementsByClassName("item");
		for (let x = 0; x < allAuctions.length; x++){
			allAuctions[x].style.borderColor = getRandomColor();
		}

	  // Create elements to print everthing on screen

	  // Manipulera DOMen till att skapa element och fylla dem med korrekt data.

	  let auctionsId = data[i].AuktionID;
	  let container = document.createElement("div");
	  container.setAttribute("class", "item");
	  container.setAttribute("id", "box-"+i);
	  container.style.borderColor = getRandomColor();

	  let title = document.createElement('h3');
	  title.setAttribute('class', 'title')
	  let description = document.createElement('p');
	  description.setAttribute('class', 'description');

	  let startTid = new Date(data[i].StartDatum).toString().split(' ');
	  let slutTid = new Date(data[i].SlutDatum).toString().split(' ');

	  let startDate = document.createElement('p');
	  startDate.setAttribute('class', 'startDate')
	  let endDate = document.createElement('p');
	  endDate.setAttribute('class', 'endDate')
	  let startPrice = document.createElement('h3');
	  startPrice.setAttribute('class', 'startPrice ${i}');
	  let currentHighest = document.createElement('p');
	  currentHighest.setAttribute('class', 'currentHighest');
	  let currentBid = document.createElement('h3');
	  currentBid.setAttribute('class', 'currentBid');
	  let bidButton = document.createElement('button');

	  bidButton.setAttribute('class', 'bidButton');

	  let inputBid = document.createElement('input');

	  inputBid.setAttribute('type', 'number');

	  inputBid.setAttribute('pattern', '^[0-9]+$');

	  inputBid.setAttribute('class', 'inputBid');

	  // event listener för att skapa ny auktion

	  bidButton.addEventListener("click", function(e){
		let currentInputBid = inputBid.value
		if(currentInputBid == ""){
		  alert("Vänligen ange ett bud");
		}
		else {
		  if(currentInputBid > highestCurrentBid){
			bud.newBid(auctionsId, highestCurrentBid, currentInputBid)
			alert("Du har lagt ett bud! You've better have the money.")
		  }
		  else {
		   alert("Ditt bud är för lågt")
		  }
		}
	  }); // end addEventListener

	  //create values for all containers
	  title.textContent = data[i].Titel;
	  description.textContent = data[i].Beskrivning;
	  startDate.innerHTML = "Startdatum:"+ " " + startTid[0] + " " + startTid[2] + " " + startTid[1] + " " + startTid[3];
	  endDate.innerHTML = "Auktionen avslutas " + slutTid[2] + " " + slutTid[1] + " " + slutTid[3];
	  startPrice.textContent = "Utgångspris: " + data[i].Utropspris +" kr";
	  currentHighest.textContent = "Nuvarande högsta bud: " + highestCurrentBid;
	  bidButton.textContent = "Placera bud";
	  // append everything to content div inside HTML document

	  container.appendChild(title);
	  container.appendChild(description);
	  container.appendChild(startDate);
	  container.appendChild(startPrice);
	  container.appendChild(currentBid);
	  container.appendChild(currentHighest);
	  container.appendChild(endDate);

	  // if auction item is still open -> print, else -> tell the user that the auction is closed

	  let thisDateMilli = thisDate.getTime();
	  let auctionEndDateMilli = auctionEndDate.getTime();
	  if(thisDateMilli < auctionEndDateMilli){
		container.appendChild(bidButton);
		container.appendChild(inputBid);
	  } else{
		let expiredAuction = document.createElement('h2');
		expiredAuction.textContent = "AUKTION AVSLUTAD!";
		container.appendChild(expiredAuction);
		expiredAuction.setAttribute("class", "expire");
	  }

	  // append created container to content in HTML document
	  pageContainer.appendChild(container);

	} // end for loop
  } // end build function


async function filteredSearch () {
	// fetch JSON from API
	let JSON = await api.fetchData('https://nackowskis.azurewebsites.net/api/Auktion/100');

	// get input from user 		query = input field text 		selected = Dropdown
	let selected = document.querySelector('input[name="sortering"]:checked').value;
	// filter JSON
	var sortedJSON;
	// Sort JSON
	if(selected =='utropspris'){
		var sortedJSON = JSON.sort((a,b)=> {
			a.Utropspris < b.Utropspris
		});
	}
	else if (selected == 'SlutDatum') {
		var sortedJSON = JSON.sort((compareA,compareB)=>compareA.SlutDatum > compareB.SlutDatum);
	}
	else if (selected == "pågående"){
		let todaysDate = new Date;
		let todaysDateMilli = todaysDate.getTime();
		var sortedJSON = JSON.filter( auction => 
			{ 	let endDateMilli =  new Date(auction.SlutDatum);
				return (endDateMilli > todaysDateMilli);
		});
		return sortedJSON;
	}	else if (selected == "utgången"){
		let todaysDate = new Date;
		let todaysDateMilli = todaysDate.getTime();
		var sortedJSON = JSON.filter( auction => 
			{ 	let endDateMilli =  new Date(auction.SlutDatum);
				return (endDateMilli < todaysDateMilli);
		});
	}
	else{
		var sortedJSON = JSON.sort((a,b)=>a.Titel > b.Titel);
	}

	createPage(sortedJSON);
} // avsluta filter-funktion

// Kör funktion direkt när sidan laddas

filteredSearch();
// Run function when click on Search button or when user press enter inside the input
document.getElementById('click').addEventListener('click', filteredSearch);
