class functions {

    constructor() {
    }

    removeToken() {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('isLogin')
        window.location.replace('/admin')
    }


    numberWithCommas = (x) => {

        // console.log(x)
        if (!x)
            return 0;

        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

export default new functions();