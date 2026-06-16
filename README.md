# zpshka-widget

Compact static widget for showing the nearest payday. It is intended to be embedded through an iframe and hosted on GitHub Pages.

## Usage

```html
<iframe
  src="https://sergeynbx.github.io/zpshka-widget/?paydays=5,20"
  width="320"
  height="160"
  style="border:0"
  loading="lazy"
></iframe>
```

Query params:

- `paydays=5,20` - salary days in every month. Defaults to `5,20`.
- `payday=5,20` - accepted as an alias for `paydays`.
- `today=YYYY-MM-DD` - optional test override.
- `theme=light` or `theme=dark` - optional theme override. Without it, the widget follows system settings.

If a planned payday falls on a non-working day, the widget moves it to the nearest previous working day.

## Local checks

```sh
npm test
```

Serve the repository root with any static web server.

## GitHub Pages

The repository includes `.github/workflows/pages.yml`. After pushing to `main`, set GitHub Pages source to `GitHub Actions` in repository settings. The workflow tests the date logic and publishes the repository root.
