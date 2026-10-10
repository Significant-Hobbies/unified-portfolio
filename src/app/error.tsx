"use client";
import { Button } from "../components/primitives";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="empty">
      <h1>Your portfolio is temporarily unavailable</h1>
      <p>
        Stored observations have not been replaced. Try loading the page again.
      </p>
      <Button className="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
