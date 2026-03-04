// src/components/AmplifyClientConfig.tsx
import { useEffect } from "react";
import { Amplify } from "aws-amplify";

export function AmplifyClientConfig() {
  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: import.meta.env.PUBLIC_COGNITO_USER_POOL_ID,
          userPoolClientId: import.meta.env.PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
          loginWith: {
            oauth: {
              domain: import.meta.env.PUBLIC_COGNITO_DOMAIN,
              scopes: ["openid", "email", "profile"],
              redirectSignIn: [import.meta.env.PUBLIC_COGNITO_REDIRECT_SIGNIN],
              redirectSignOut: [import.meta.env.PUBLIC_COGNITO_REDIRECT_SIGNOUT],
              responseType: "code",
            },
          },
        },
      },
    });
  }, []);

  return null;
}
