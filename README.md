# RMS Frontend

Frontend interface for the Remittance Management System (RMS) of Mutual Trust Bank PLC.

The project currently contains the authentication entry screen and the main app shell (sidebar and header) for internal RMS users. It is designed as a static frontend.

## Current Status

- Internal RMS login screen (`login.html`)
- App shell with sidebar and header (`sidebar.html`)
- Sign-in navigates to the sidebar; Logout returns to login
- RMS access/support panel for authorized MTB PLC users
- Mutual Trust Bank PLC branding assets
- Responsive layout for desktop and mobile screens

## Project Structure

```text
RMS Site/
├── assets/
│   ├── bootstrap-5.3.8/
│   ├── bootstrap-icons/
│   ├── css/
│   │   ├── login.css      # Login / auth page only
│   │   ├── styles.css     # Shared base styles
│   │   └── dashboard.css  # Sidebar / dashboard shell
│   ├── fonts/
│   ├── images/
│   └── js/
│       ├── login.js       # Login form handlers (redirect to sidebar)
│       └── main.js        # Sidebar behavior (mobile menu, subnav)
├── login.html
├── sidebar.html
├── LICENSE
└── README.md
```

## Files

`login.html` — RMS login and internal access request forms; uses `assets/css/login.css` and `assets/js/login.js`.

`sidebar.html` — Dashboard layout shell (Bootstrap, icons, shared CSS, sidebar script).

## Running Locally

Open `login.html` in a browser, or serve the folder with any static server.

Example with Python:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/login.html`.

## License

See [LICENSE](LICENSE).
