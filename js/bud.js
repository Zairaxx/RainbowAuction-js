var bud = ( function(){

  async function publicGetBids(AuktionID){
    let endpoint = "http://nackowskis.azurewebsites.net/api/bud/100/" + AuktionID;
    let promise = await api.fetchData(endpoint);
    return promise;
  } /* Hämtar mitt data från endpoint, och låter funktionen returna ett promise som används för att displaya data */
  

  async function publicNewBid(AuktionID, hogstaBud, summa){

    if(summa <= hogstaBud){
      console.log("Ditt bud måste vara högre än summan!");
      return false;
    } else {
      console.log("Du har lagt ett bud!");

      let data = {
        "BudID": 1,
        "Summa": summa,
        "AuktionID": AuktionID
      }

      let url = "http://nackowskis.azurewebsites.net/api/Bud/100/" + AuktionID;
      api.postData(url, data);

      return true;
    }

  }

  return{
    getBids: publicGetBids,
    newBid: publicNewBid,
  }

})();