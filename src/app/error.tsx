"use client";
import { Button } from "../components/primitives";
import { ErrorState } from "@saas-maker/ui/components/error-state";
export default function ErrorPage({
  retry,
  unstable_retry,
}: {
  retry?: () => void;
  unstable_retry?: () => void;
}) {
  return (
    <ErrorState
      className="empty"
      title="your portfolio is temporarily unavailable"
      description={
        <p>
          stored observations have not been replaced. try loading the page
          again.
        </p>
      }
      primaryAction={
        <Button
          className="button"
          onClick={retry ?? unstable_retry ?? (() => window.location.reload())}
        >
          try again
        </Button>
      }
    />
  );
}
