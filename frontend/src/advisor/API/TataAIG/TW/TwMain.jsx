import { useState, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import TataLoader from "../Loader/TataLoader";
// Lazy load components
const TwQuote = lazy(() => import("./TwQuote/TwQuote"));
const TwProposal = lazy(() => import("./TwProposer/TwProposer"));


function TwMain() {
  const [loading, setLoading] = useState(true);




const handleSubOptionChange = (business_type) => {
    const selectedOption = menuItems[business_type];

    sessionStorage.setItem("selectedSubOption", selectedOption.name);
    setSelectedSubOption(selectedOption.name);
    const authLink = selectedOption.authLink;

    // Make API call if needed
    if (authLink) {
      fetch(authLink)
        .then((response) => response.json())
        .then((data) => {
          const auth = data.auth;
          const uatMaster = data.uatLists.data;
          const currentTime = Date.now();
          if (auth.access_token && auth.expires_in) {
            setToken(auth.access_token);
            sessionStorage.setItem("auth_access_token", auth.access_token);
            sessionStorage.setItem("auth_expires_in", auth.expires_in);
            sessionStorage.setItem("auth_token_received_at", currentTime);
          }
          if (uatMaster.token) {
            setUatToken(uatMaster.token);
            // sessionStorage.setItem("uat_access_token", uatMaster.token);
            sessionStorage.setItem("uat_token_received_at", uatMaster.u_ts);
          }
          // handleSetAuthTokenToQuote();
          toast.success(`${data.message}`);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  return (
    <main className=" flex flex-col">
      {!loading ? (
       <TataLoader/>
      ) : (
        <Suspense fallback={<TataLoader />}>
        <TwQuote />
        </Suspense>
      )}

       {/* {!loading ? (
       <TataLoader/>
      ) : (
        <Suspense fallback={<TataLoader />}>
        <TwProposal />
      </Suspense>
      )} */}
   </main>
  );
}

export default TwMain;
