# B.E.S.T. Exercise Tracker

A simple, iPhone-first web app for strength workouts, food, Peloton/cardio rides, measurements, and progress photos. Sleep logging is not part of this version.

## Features

- Log strength workouts by date and location (Home or Work).
- Pick a preset routine for today from the Today screen; the selected routine opens in Strength. The pick applies to today only and does not change the weekly schedule.
- Choose a workout split, preload the last logged sets, reps, and weight for each exercise, and add custom exercises.
- Track logged-weight and estimated one-rep-max PRs.
- Use 30- or 90-second rest timers with a two-strike ringing bell and vibration when supported.
- Manually record Peloton/cardio duration, distance, output, calories, and notes.
- Log food by meal with calories, protein, carbs, and fat, on any date; reuse recent foods with one tap; set daily goals. The Today screen shows the day's totals.
- Search foods in the USDA FoodData Central database (whole foods) and Open Food Facts (packaged foods), then choose an amount by portion, grams, or ounces.
- Scan a product barcode with the camera (or type the number, or use a photo of it) to look it up in Open Food Facts.
- Estimate calories and macros from a meal photo using Claude. This needs your own Anthropic API key, entered in Food → Settings; each photo is billed to your Anthropic account.
- Save dated weight, waist, neck, and body-fat measurements.
- Save dated progress photos on the device.
- Export or restore a JSON backup containing workout history, food, rides, measurements, and photos.

## Cost and data

All records are stored in the browser on the current device. There is no sleep/HealthKit connection.

Food search, barcode lookups, and photo estimates contact outside services: USDA FoodData Central (`api.nal.usda.gov`), Open Food Facts (`world.openfoodfacts.org`), and Anthropic (`api.anthropic.com`). Search text and barcodes go to the first two; meal photos go to Anthropic only when you tap **Estimate**. USDA search uses the shared `DEMO_KEY` (about 30 searches an hour) unless you add a free key from api.data.gov. API keys are stored only on the device and are not included in backups. Photo estimates are approximations.

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

## Barcode scanner and photo estimates (vendor.js)

`vendor.js` bundles the Anthropic TypeScript SDK and the ZXing barcode reader. The app loads it only when you first scan or estimate a photo. It is built from `tools/vendor/entry.ts`:

```sh
cd tools/vendor && npm install && npm run build
```

Commit the rebuilt `vendor.js` with any change to `entry.ts`.

