import * as Sentry from "@sentry/react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import './index.css';

Sentry.init({
  dsn: "https://01e621489a09b698c4d141d58ce672e4@o4507458801958912.ingest.de.sentry.io/4507458804580432",
  integrations: [
    Sentry.browserTracingIntegration(),
    //Sentry.metricsAggregatorIntegration(),
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect:React.useEffect,
    }),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)