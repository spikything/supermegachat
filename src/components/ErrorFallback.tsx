import { MouseEventHandler } from "react";

function ErrorFallback({error, resetErrorBoundary} : {error:Error, resetErrorBoundary:MouseEventHandler}) {
  return (
    <div role="alert">
      <h1>💥 Sorry, something went wrong:</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default ErrorFallback;
