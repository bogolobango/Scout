import Stripe from "stripe";
import { site } from "../../config/site";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }) {
  const sessionId = searchParams?.session_id;
  let paid = false;
  let email = "";

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      email = session.customer_details?.email || "";
    } catch (e) {
      paid = false;
    }
  }

  return (
    <div className="success-wrap">
      <div className="glow glow--violet" aria-hidden="true" />
      <div className="success-card">
        {paid ? (
          <>
            <p className="eyebrow">Purchase confirmed</p>
            <h1>
              Your skill file is <em style={{ fontStyle: "normal" }}>ready</em>.
            </h1>
            <p>
              {email && (
                <>
                  A receipt is on its way to <strong>{email}</strong>.{" "}
                </>
              )}
              Download the package below, then open the install guide inside —
              you'll be running your first brief in about 15 minutes.
            </p>
            <a
              className="btn btn--primary"
              href={`/api/download?session_id=${sessionId}`}
            >
              Download {site.name} package
            </a>
            <p className="price-foot" style={{ marginTop: 26 }}>
              Trouble downloading?{" "}
              <a href={`mailto:${site.supportEmail}`}>Email support</a> with
              your receipt.
            </p>
          </>
        ) : (
          <>
            <p className="eyebrow">Checkout incomplete</p>
            <h1>We couldn't confirm this purchase</h1>
            <p>
              If you completed payment, give it a few seconds and refresh this
              page. Otherwise head back and try again — no charge went through
              unless Stripe says so.
            </p>
            <a className="btn btn--ghost" href="/#pricing">
              Back to checkout
            </a>
          </>
        )}
      </div>
    </div>
  );
}
