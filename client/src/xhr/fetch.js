// componentDidMount() {
//    const apiUrl = 'https://api.github.com/users/hacktivist123/repos';
//    fetch(apiUrl)
//      .then((response) => response.json())
//      .then((data) => console.log('This is your data', data));
//  }

// source: https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
 export default {
    getEndpoint: function(url, callback) {
        fetch(url)
        .then(response => {
            if (response.status === 404) {

            } else {

            }
        }).catch(() => {
            console.error("User is offline");
        });
    }
}
