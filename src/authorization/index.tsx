import React from "react";
import { NMovies, StoreMovies } from "../store/movies";
import { MOVIE_API_KEY } from "../consts";
import { Button, Modal } from "antd";

enum AuthSteps {
  isRequestToken,
  isRequestUserId,
  isCreateSessionId,
  isAuthorized,
}

export function Authorization(): React.ReactElement {
  const { dispatch } = React.useContext(StoreMovies.context);

  const isAuthorized: boolean = StoreMovies.useSelector(
    (store: NMovies.IStore) => Boolean(store.authData.userId)
  );

  const [authStep, setAuthStep] = React.useState<AuthSteps>(
      !isAuthorized ? AuthSteps.isRequestToken : AuthSteps.isAuthorized
    ),
    requestTokenRef = React.useRef<NMovies.IAuthData["requestToken"]>(null),
    sessionIdRef = React.useRef<NMovies.IAuthData["sessionId"]>(null);

  const onChangeVisibility = React.useCallback(() => {
    setModalVisible((isModalVisible) => !isModalVisible);
  }, []);

  const getAuthorization = React.useCallback(async () => {
    try {
      requestTokenRef.current = await getRequestToken();
      window.open(
        `https://www.themoviedb.org/authenticate/${requestTokenRef.current}`,
        "_blank"
      );
      setAuthStep(AuthSteps.isRequestUserId);
      onChangeVisibility();
    } catch (error) {
      console.error(error);
    }

    async function getRequestToken(): Promise<any> {
      try {
        const requestInfo: any = await fetch(
          `https://api.themoviedb.org/3/authentication/token/new?api_key=${MOVIE_API_KEY}`
        );
        const requestToken = (await requestInfo.json()).request_token;
        if (!requestToken) {
          throw new Error("Something went wrong");
        }

        return requestToken;
      } catch (error) {
        console.log("Request token error:", error);
      }
      return;
    }
  }, []);

  async function createSessionId() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/authentication/session/new?api_key=${MOVIE_API_KEY}`,
        {
          method: "POST",
          body: JSON.stringify({ request_token: requestTokenRef.current }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      sessionIdRef.current = (await response.json()).session_id;
    } catch (error) {
      console.error("Create session id error:", error);
    }
  }

  async function getAccountId() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/account?api_key=${MOVIE_API_KEY}&session_id=${sessionIdRef.current}`
      );
      setAuthStep(AuthSteps.isAuthorized);
      StoreMovies.API.authorizationFetchSuccessful(dispatch)({
        payload: {
          userId: (await response.json()).id,
          sessionId: sessionIdRef.current,
          requestToken: requestTokenRef.current,
        },
      });
    } catch (error) {
      console.log("Get account id error:", error);
    }
  }

  const [isModalVisible, setModalVisible] = React.useState(false);
  const onApproveAuthRequest = React.useCallback(async () => {
    try {
      await createSessionId();
      setAuthStep(AuthSteps.isCreateSessionId);
      await getAccountId();
      onChangeVisibility();
    } catch (error) {
      console.error(error);
    }
  }, [authStep]);

  return (
    <>
      {authStep !== AuthSteps.isAuthorized ? (
        <Button
          type="primary"
          onClick={getAuthorization}
          loading={authStep === AuthSteps.isRequestUserId}
          children={"Authorization"}
        />
      ) : (
        <Button children="Logout" />
      )}

      {authStep === AuthSteps.isRequestUserId && (
        <div>
          <Modal
            title="Approval Request"
            visible={isModalVisible}
            onOk={onApproveAuthRequest}
          >
            <p>You must approve request on https://www.themoviedb.org</p>
            <p>Then press OK</p>
          </Modal>
        </div>
      )}
    </>
  );
}
