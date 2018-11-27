var api = ( function(){

  async function publicFetchData(url){
    var promise = await fetch(url);
    var data = await promise.json();
    return data;
  }

  async function publicPostData(url, data){
    fetch(url,{
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
  }
  return{
    fetchData: publicFetchData,
    postData: publicPostData,
  }

})();