class UserInfo {
    constructor() {
        this.token = window.localStorage.getItem("webrecipesapicredentials");
        try {
            this.info = this.parseJwt(this.token);
        } catch {
        }
    }

    parseJwt(token) {
        var base64Url = token.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
        );

        return JSON.parse(jsonPayload);
    }

    getUserInfo() {
        return this.info;
    }

}

export default UserInfo;