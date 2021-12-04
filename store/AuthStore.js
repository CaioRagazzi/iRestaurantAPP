import { createState } from "@hookstate/core";

const AuthStore = createState({
    userId: 0,
    token: "",
    logged: false,
    email: ""
})

export default AuthStore;
