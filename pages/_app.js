import "../styles/globals.css";
import "antd/dist/antd.css";
import "../styles/additional_antd.css"

import { AuthUserProvider } from "../utils/auth.js";

function MyApp({ Component, pageProps }) {
  return (
    <AuthUserProvider>
      <Component {...pageProps} />
    </AuthUserProvider>
  );
}

export default MyApp;
