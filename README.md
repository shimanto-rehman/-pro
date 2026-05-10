# RMS Frontend

Frontend interface for the Remittance Management System (RMS) of Mutual Trust Bank PLC.

The project currently contains the authentication entry screen for internal RMS users. It is designed as a static frontend and will grow into a complete RMS frontend with dashboard views, operational modules, and role-based screens.

## Current Status

- Internal RMS login screen
- CSS-only auth wrapper interaction
- RMS access/support panel for authorized MTB PLC users
- Mutual Trust Bank PLC branding assets
- Remittance-themed visual identity
- Responsive layout for desktop and mobile screens

## Planned Scope

Future versions of this project may include:

- RMS dashboard homepage
- Remittance transaction overview
- Branch and division-specific views
- User role-based navigation
- Reports and analytics screens
- Pending approval and settlement queues
- Search, filter, and export interfaces
- Admin support and access management screens

## Project Structure

```text
RMS Site/
├── assets/
│   └── images/
│       ├── login-right-1.svg
│       ├── logo.png
│       └── remitance.png
├── index.html
├── style.css
├── script.js
├── LICENSE
└── README.md
```

## Files

`index.html`

Main application entry point. Currently contains the RMS login and internal access/support screen.

`style.css`

Main stylesheet for the authentication screen, responsive layout, RMS color theme, and visual assets.

`script.js`

Legacy login interaction placeholder. The current auth wrapper switch is handled with HTML and CSS only.

`assets/images/`

Contains branding and visual assets used by the login screen.

## Running Locally

This project currently works as a static HTML/CSS frontend.

Open `index.html` directly in a browser, or serve the folder with any static server.

Example with Python:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Design Direction

The interface follows the RMS color grade used in the current screen:

- Deep red
- Magenta
- Purple
- Blue
- Teal

The product is internal banking software, so the UI should remain professional, operational, and focused. Public signup flows should be avoided. Access-related flows should be framed as internal authorization, admin contact, or support requests.

## Development Notes

- Keep authentication copy aligned with internal organizational usage.
- Avoid public user onboarding language such as "Sign Up" or "Create public account".
- Preserve responsive behavior when adding dashboard screens.
- Reuse the existing RMS gradient and MTB PLC assets for visual consistency.
- As the project grows, consider splitting styles and scripts into feature-specific files.

## License

See [LICENSE](LICENSE).
