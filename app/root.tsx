import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Helmet } from "react-helmet";
import type { Route } from "./+types/root";
import "./app.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <Helmet>
          <meta name="description" content="Jeff Szcinski - Software Engineer, English Education Innovator, World Traveler, Artist and Performer. Learn more about Jeff's work, travels, and projects." />
          <meta name="keywords" content="Jeff Szcinski, Jeffski, English Teacher, Software Engineer, World Traveler, Artist, Web Developer, Android Developer, Choir Leader, Jeff Ski" />
          <meta property="og:title" content="Jeff Szcinski | English Teacher, Software Engineer, World Traveler" />
          <meta property="og:description" content="Jeff Szcinski - Software Engineer, English Education Innovator, World Traveler, Artist and Performer." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://jeff.ski/" />
          <meta property="og:image" content="https://s3.us-east-2.amazonaws.com/jeff.ski/title/titlePage-info1-md.jpg" />
        </Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js"
          crossOrigin="true"></script>

        <script
          src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js"
          crossOrigin="true"></script>

        <script
          src="https://cdn.jsdelivr.net/npm/react-bootstrap@2.10.4/dist/react-bootstrap.min.js"
          crossOrigin="true"></script>

        <script>var Alert = ReactBootstrap.Alert;</script>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
