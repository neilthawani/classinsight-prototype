// checks for `expires_in` timestamp or our custom time (before the token expires) and
// calls `reloadAuthResponse`, which is a util function provided by the library and
// it handles `refresh_token` and obtains new `tokenId`
export default function(res) {
    let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

    const refreshToken = async() => {
        const newAuthRes = await res.reloadAuthResponse();
        refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;

        console.log("newAuthRes", newAuthRes);
        // saveUserToken(newAuthRes.access_token); // save new token
        console.log("new Auth Token", newAuthRes.id_token);

        // setup the other timer after the first one
        setTimeout(refreshToken, refreshTiming);
    };

    // setup first refresh timer
    setTimeout(refreshToken, refreshTiming);
}
