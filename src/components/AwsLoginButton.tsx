import React, {useEffect, useState} from "react";


export function AwsLoginButton() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const hashString = window.location.hash;
        console.log("hashString", hashString);
        hashString.substring(1).split("&").forEach(param => {
            console.log(param);
            if (param.startsWith("id_token=")) {
                let paramSplit = param.split("=");
                if (paramSplit.length === 2) {
                    localStorage.setItem("aws_token", paramSplit.at(1)!)
                }
            }
        });

        setLoggedIn(localStorage.getItem("aws_token") !== null);
    }, []);


    return (<>
        {
            !loggedIn &&
            <a  href={import.meta.env.PUBLIC_AWS_LOGIN_URL}
                className={`rounded-md bg-sky-500 px-5 py-2.5 text-sm leading-5 font-semibold text-white hover:bg-sky-700 active:bg-sky-950 disabled:bg-gray-400`}>
                Login
            </a>
        }
        {
            loggedIn &&
            <button
                onClick={() => {
                    localStorage.removeItem("aws_token");
                    setLoggedIn(false);
                }}
                className={`rounded-md bg-sky-500 px-5 py-2.5 text-sm leading-5 font-semibold text-white hover:bg-sky-700 active:bg-sky-950 disabled:bg-gray-400`}>
                Logout
            </button>
        }
    </>)
}
