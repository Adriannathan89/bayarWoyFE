# BayarWoyFE

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Docker + Nginx

This project uses a multi-stage Docker build:

1. Build Angular app in a Node.js stage.
2. Serve static files with Nginx in a lightweight runtime image.

Build image locally:

```bash
docker build -t bayarwoy-fe:local --build-arg VITE_API_BASE_URL=http://localhost:8080/api .
```

Run image locally:

```bash
docker run --rm -p 8080:80 bayarwoy-fe:local
```

Or run using Compose:

```bash
IMAGE_NAME=bayarwoy-fe IMAGE_TAG=local APP_PORT=8080 docker compose up -d
```

## CI/CD

The repository includes two workflows:

1. CI/CD workflow at `.github/workflows/ci-cd.yml`
2. Manual deploy workflow at `.github/workflows/deploy.yml`

`ci-cd.yml`:

1. Builds Angular app.
2. Builds Docker image on pull request and push.
3. Pushes image to GHCR on push to `main`/`master`.

Required/optional secrets for CI:

1. `VITE_API_BASE_URL` (optional, fallback is `http://localhost:8080/api`)

`deploy.yml` (manual trigger):

1. Pulls image from GHCR on your VPS via SSH.
2. Runs it with `docker compose` and exposes app port.

Required secrets for deploy:

1. `DEPLOY_HOST`
2. `DEPLOY_USER`
3. `DEPLOY_SSH_KEY`
4. `DEPLOY_PORT` (optional, default `22`)
5. `GHCR_READ_USERNAME`
6. `GHCR_READ_TOKEN`

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
