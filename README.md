# B.E.S.T. Exercise Tracker

A simple, iPhone-first web app for strength workouts, food, Peloton/cardio rides, measurements, and progress photos. Sleep logging is not part of this version.

## Features

- Log strength workouts by date and location (Home or Work).
- Pick a preset routine for today from the Today screen; the selected routine opens in Strength. The pick applies to today only and does not change the weekly schedule.
- Choose a workout split, preload the last logged sets, reps, and weight for each exercise, and add custom exercises.
- Track logged-weight and estimated one-rep-max PRs.
- Use 30- or 90-second rest timers with a two-strike ringing bell and vibration when supported.
- Manually record Peloton/cardio duration, distance, output, calories, and notes.
- Log food by meal with calories and optional protein, on any date; reuse recent foods with one tap; set daily calorie and protein goals. The Today screen shows the day's totals.
- Save dated weight, waist, neck, and body-fat measurements.
- Save dated progress photos on the device.
- Export or restore a JSON backup containing workout history, food, rides, measurements, and photos.

## Cost and data

All records are stored in the browser on the current device. Food calories and protein are entered by hand; there is no food database, photo calorie estimate, or sleep/HealthKit connection.

Use **Backup** regularly and keep the downloaded JSON somewhere safe. The backup includes photos, so the file may be large. Browser storage does not automatically sync to another device.

## Run and install

This is a static Progressive Web App. Host the folder at an HTTPS address to install it from Safari on iPhone using **Share → Add to Home Screen**. It can also be previewed on a computer with any static web server. No Mac, App Store listing, or Apple Developer membership is needed for the web app.

To preview locally, run a static server from this folder, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a desktop browser. For iPhone installation and offline caching, publish the files at an HTTPS origin.

## Updating

The app loads fresh files from the server whenever it's online and falls back to its offline copy otherwise, so a published update reaches the installed app the next time it's opened with a connection. If you add a new file the app needs offline, add it to `ASSETS` in `sw.js` and change the `CACHE` name.

On iPhone, **Backup → Export** opens the share sheet; choose **Save to Files**.
