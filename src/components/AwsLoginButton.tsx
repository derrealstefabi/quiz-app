import React, { useState } from "react";
import { signInWithRedirect, signOut, fetchAuthSession} from "aws-amplify/auth";

type User = {
    email: string;
    username: string;
}

export function AwsLoginButton() {
    const [user, setUser] = useState<User | undefined>(undefined);

    fetchAuthSession().then(auth => {
        console.log("auth", auth);
        setUser({
            email: auth.tokens?.idToken?.payload?.email as string,
            username: auth.tokens?.accessToken.payload.username as string
        });
    })
        .catch(err => {
            console.log(err);
            console.log("auth", false);
            setUser(undefined);
        });

    return <>
        {!user &&
            <button
                onClick={() => signInWithRedirect()}
                className="rounded-md bg-sky-500 px-5 py-2.5 text-sm leading-5 font-semibold text-white hover:bg-sky-700 active:bg-sky-950 disabled:bg-gray-400"
            >
                Login
            </button>

        }
        {user &&
            <div className={"flex flex-col items-end gap-3"}>

                <div>
                    <span className={'text-lg'}>{user.username}</span> ({user.email})
                </div>

                <button
                    onClick={() => {
                        setUser(undefined);
                        signOut();
                    }}
                    className="rounded-md bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
                >
                    Logout
                </button>
            </div>

        }
    </>
}
