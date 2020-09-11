// componentDidMount() {
//    const apiUrl = 'https://api.github.com/users/hacktivist123/repos';
//    fetch(apiUrl)
//      .then((response) => response.json())
//      .then((data) => console.log('This is your data', data));
//  }

// sources:
// https://www.smashingmagazine.com/2020/06/rest-api-react-fetch-axios/
// https://github.com/wednesday-solutions/jsonapi-redux-data
// https://dev.to/markusclaus/fetching-data-from-an-api-using-reactredux-55ao
// https://blog.logrocket.com/data-fetching-in-redux-apps-a-100-correct-approach-4d26e21750fc/
// https://daveceddia.com/where-fetch-data-redux/
// https://www.sohamkamani.com/blog/2016/06/05/redux-apis/
// https://www.godaddy.com/engineering/2018/11/05/reduxful-manage-restful-data-with-redux/
// https://robkendal.co.uk/blog/2020-01-21-react-redux-components-apis-and-handler-utilities
// https://github.com/redux-json-api/redux-json-api

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
