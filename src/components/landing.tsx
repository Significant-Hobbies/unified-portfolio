import { Button } from "./primitives";
// Signed-out public page. Presentation only: the sign-in form posts to the
// same endpoint as before, and the "not open yet" state is shown exactly when
// googleReady() is false.
function SignIn({ ready, id }: { ready: boolean; id?: string }) {
  return ready ? (
    <form
      action="/api/auth/google/start"
      method="post"
      className="landing-cta"
      id={id}
    >
      <Button className="button landing-button">
        Continue with Google <span aria-hidden="true">→</span>
      </Button>
      <a className="landing-link" href="/settings?document=privacy">
        Read the privacy policy
      </a>
    </form>
  ) : (
    <div className="landing-cta" id={id}>
      <Button className="button landing-button" disabled>
        Continue with Google
      </Button>
      <a className="landing-link" href="/settings?document=privacy">
        Read the privacy policy
      </a>
    </div>
  );
}

function Status({ ready }: { ready: boolean }) {
  return ready ? (
    <p className="landing-status">
      <span className="landing-dot" aria-hidden="true" />
      Private beta · Your account gets its own isolated workspace
    </p>
  ) : (
    <p className="landing-status quiet" role="status">
      <span className="landing-dot" aria-hidden="true" />
      Private beta — not open yet. Sign-in opens once the private server setup
      is complete.
    </p>
  );
}

const sources = [
  {
    mark: "Z",
    name: "Zerodha",
    logo: "",
    detail: "Holdings · cash",
    age: "Synced 6 min ago",
    status: "Current",
    warn: false,
  },
  {
    mark: "A",
    name: "Angel One",
    logo: "angelone",
    detail: "Holdings",
    age: "Session expired · 2 days ago",
    status: "Stale",
    warn: true,
  },
  {
    mark: "I",
    name: "INDmoney",
    logo: "indmoney",
    detail: "USD investments · cash ≈",
    age: "Synced 1 hr ago",
    status: "Current",
    warn: false,
  },
];

function Ledger() {
  return (
    <figure className="ledger">
      <div className="ledger-stage">
        <div className="ledger-card" aria-hidden="true">
          <div className="ledger-top">
            <span>Overview</span>
            <span>Values hidden</span>
          </div>
          <div className="ledger-value">
            <small>Observed portfolio value · INR</small>
            <div className="ledger-number">₹ ••,••,•••</div>
            <div className="ledger-coverage">
              Holdings from 3 sources · cash coverage partial
            </div>
          </div>
          <ul className="ledger-rows">
            {sources.map((s) => (
              <li key={s.name}>
                <span className={`broker-logo ${s.logo}`}>{s.mark}</span>
                <div>
                  <strong>{s.name}</strong>
                  <small>{s.detail}</small>
                </div>
                <div className="ledger-age">
                  <span className={s.warn ? "status warn" : "status"}>
                    {s.status}
                  </span>
                  <small>{s.age}</small>
                </div>
              </li>
            ))}
          </ul>
          <div className="ledger-foot">Read-only · no trading endpoints</div>
        </div>
      </div>
      <figcaption>
        Illustrative interface — values masked, no real holdings or accounts.
      </figcaption>
    </figure>
  );
}

const steps = [
  {
    title: "Connect, read-only",
    body: "Sign in with each broker’s official login. Unified reads holdings and cash; it cannot place trades, move money or change SIPs.",
  },
  {
    title: "See it together",
    body: "Holdings, allocation and daily history across Zerodha, Angel One and INDmoney, in one quiet ledger.",
  },
  {
    title: "Know what’s fresh",
    body: "Every value sits beside its source and last sync. Stale, estimated or unknown data is labeled, never disguised.",
  },
];

const facts = [
  ["Broker passwords", "Stay with the broker. Unified never sees them."],
  ["Stored authorization", "Server-side, AES-256-GCM encrypted."],
  ["Trading", "None. No trades, transfers or SIP changes."],
  [
    "Google sign-in",
    "Basic profile and email only. No Gmail, Drive or contacts.",
  ],
  ["Your workspace", "Isolated per account. Other people cannot see it."],
  ["AI clients", "Read-only, only after you approve. Revoke any time."],
];

export function Landing({
  ready,
  notice,
}: {
  ready: boolean;
  notice?: string;
}) {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">A private investment ledger</p>
          <h1>
            Every account. <em>One honest</em> view.
          </h1>
          <p className="landing-lede">
            Unified brings your Zerodha, Angel One and INDmoney investments into
            one read-only portfolio, with each number shown beside where it came
            from and how fresh it is.
          </p>
          {notice && (
            <div className="notice" role="status">
              {notice}
            </div>
          )}
          <SignIn ready={ready} id="sign-in" />
          <Status ready={ready} />
        </div>
        <Ledger />
      </section>

      <ol className="landing-steps" id="how">
        {steps.map((s, i) => (
          <li key={s.title}>
            <span className="step-number">0{i + 1}</span>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>

      <section className="landing-privacy" id="privacy">
        <div>
          <p className="eyebrow">Privacy by design</p>
          <h2>
            Built to look, <em>never to touch.</em>
          </h2>
          <p>
            Unified is an observer. It keeps what it needs to show your
            portfolio and its history, encrypted, and nothing that could act on
            your money.
          </p>
          <a className="landing-link light" href="/settings?document=privacy">
            Read the plain-language privacy policy
          </a>
        </div>
        <dl>
          {facts.map(([term, detail]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="landing-close">
        <p className="eyebrow">Your private workspace</p>
        <h2>Observe clearly. Stay in control.</h2>
        <SignIn ready={ready} />
        <Status ready={ready} />
      </section>
    </div>
  );
}
