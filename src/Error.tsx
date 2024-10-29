import React from "react";
import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Error.css";

function Error() {
  const error = useRouteError();
  return (
    <div className="error-container">
      <div className="error-code">404</div>
      <h1 className="error-message">Page Not Found</h1>
      <i>{error.statusText || error.message}</i>
      {error?.stack && (
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          <strong>Stack Trace:</strong>
          <br />
          {error.stack}
        </pre>
      )}
      <p className="error-description">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className="error-button">
        Go Home
      </Link>
    </div>
  );
}

export default Error;
