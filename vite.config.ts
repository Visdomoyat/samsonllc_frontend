import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import netlify from "@netlify/vite-plugin-react-router";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";

/** Chrome DevTools probes this path; not an app route. */
function ignoreWellKnown(): Plugin {
  return {
    name: "ignore-well-known",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/.well-known/")) {
          res.statusCode = 204;
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [ignoreWellKnown(), tailwindcss(), reactRouter(), netlifyReactRouter(), netlify()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/media": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
