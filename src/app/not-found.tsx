import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p className="section-kicker">Page not found</p>
      <h1>That campaign page is not available.</h1>
      <Link className="button button-primary" href="/">
        Return Home
      </Link>
    </main>
  );
}
