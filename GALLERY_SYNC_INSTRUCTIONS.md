# Gallery Sync & Dashboard Fix Instructions

## 1. Apply Filtering Fixes
I have repaired the logic in `FIXED_DASHBOARD_PAGE.tsx` by removing duplicate code that was causing the filters to break.
- **Action:** Copy the entire content of `FIXED_DASHBOARD_PAGE.tsx` and paste it into your active dashboard page file (likely `src/app/admin1/dashboard/page.tsx` or similar).

## 2. Gallery Data Populated
I have successfully fetched the 12 gallery items from `https://diracai.com/gallery` and seeded them into your local database.
- **Verification:** Navigate to the **Gallery** tab in the admin dashboard. You should see "Making New Innovative Ideas", "Diwali Celebrations", and other images.
- **Note:** Images are stored references to your `media_cdn` folder, which I have verified contains the downloaded files.

## 3. Live Sync Feature
I added a manual **"Sync"** button to the Gallery toolbar.
- **Usage:** Click this button to refresh the gallery view from the server without reloading the page. This is useful if you upload images from another device or tab.

## 4. Troubleshooting
- If images do not appear, ensure your Django server is running (`python manage.py runserver`) and that your `MEDIA_URL` is correctly configured to serve files from `media_cdn`.
- If filters (Project, Team, etc.) still behave oddly, ensure you have fully replaced the dashboard file with the fixed version.

**Script Reference:**
A script `seed_gallery.py` is left in your root directory if you ever need to re-populate the gallery data from the live site.
