# Running Kitchen Master Locally

This guide walks through running the Kitchen Master website locally from a fresh clone.

The project consists of:

* **Frontend:** Next.js 16 / React 19
* **CMS:** Strapi 5
* **Local database:** SQLite
* **Frontend port:** `3000`
* **CMS port:** `1337`

The frontend requires Node.js `>=22.13.0`, while the CMS supports Node.js 20–26. **Node 22.x is therefore a good choice for the whole project.**

---

## 1. Install the prerequisites

You will need:

* Git
* Node.js **22.13 or newer**
* npm

Check your installed versions:

```bash
node --version
npm --version
git --version
```

Your Node version should be at least:

```text
v22.13.0
```

If you use `nvm`, you can switch to Node 22 with:

```bash
nvm install 22
nvm use 22
```

---

# 2. Clone the repository

Open Terminal, PowerShell, or the integrated terminal in VS Code.

```bash
git clone https://github.com/moxiefoxie/kitchen-master.git
cd kitchen-master
```

The important project structure is approximately:

```text
kitchen-master/
│
├── app/                 # Next.js website
├── public/              # Website images/static files
├── cms/                 # Strapi CMS
│   ├── config/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── package.json         # Frontend dependencies
├── package-lock.json
└── .env.example
```

---

# 3. Install the frontend dependencies

From the root `kitchen-master` directory:

```bash
npm ci
```

You can also use:

```bash
npm install
```

The root package contains Next.js 16.2.6, React 19.2.6, TypeScript, Tailwind, and the project's other frontend tooling.

---

# 4. Install the CMS dependencies

The CMS has its **own `package.json` and `node_modules`**, so its packages need to be installed separately.

From the project root:

```bash
cd cms
npm ci
```

Then return to the root:

```bash
cd ..
```

At this point you should have:

```text
kitchen-master/node_modules/
kitchen-master/cms/node_modules/
```

---

# 5. Configure the local Strapi CMS

Strapi needs its own environment file.

From the project root, on macOS/Linux:

```bash
cp cms/.env.example cms/.env
```

In PowerShell:

```powershell
Copy-Item cms/.env.example cms/.env
```

The supplied example looks roughly like this:

```env
HOST=0.0.0.0
PORT=1337

APP_KEYS=replace-me-1,replace-me-2,replace-me-3,replace-me-4
API_TOKEN_SALT=replace-me
ADMIN_JWT_SECRET=replace-me
TRANSFER_TOKEN_SALT=replace-me
JWT_SECRET=replace-me
ENCRYPTION_KEY=replace-me

PREVIEW_SECRET=replace-with-a-long-random-secret

FRONTEND_URL=http://localhost:3000

DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

Replace the `replace-me` values with random secrets.

For local development, you can generate random values from the terminal with:

```bash
openssl rand -base64 32
```

Run that several times and use different values for:

```text
APP_KEYS
API_TOKEN_SALT
ADMIN_JWT_SECRET
TRANSFER_TOKEN_SALT
JWT_SECRET
ENCRYPTION_KEY
PREVIEW_SECRET
```

`APP_KEYS` needs four comma-separated values, for example:

```env
APP_KEYS=key1,key2,key3,key4
```

Keep whichever value you use for:

```env
PREVIEW_SECRET=
```

because we will reuse it in the frontend configuration.

---

# 6. You do NOT need to install a database

Local Strapi development is already configured to use SQLite:

```env
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

The database will live at:

```text
cms/.tmp/data.db
```

The repository's database configuration explicitly defaults to SQLite for local development, so PostgreSQL, MySQL, Docker, etc. are not required.

The `.tmp` database is intentionally ignored by Git.

---

# 7. Start Strapi

Open your **first terminal**.

From the project root:

```bash
cd cms
npm run develop
```

The CMS's `develop` command runs:

```text
strapi develop
```

and uses port `1337` by default.

Once Strapi has started, open:

```text
http://localhost:1337/admin
```

On the first run, Strapi should prompt you to create your local administrator account.

This account is only for your local CMS.

---

# 8. The local database seeds itself

You should **not have to manually recreate all of the restaurant content**.

When Strapi starts against an empty database, the project's bootstrap code automatically creates the initial:

* Restaurant locations
* Site settings
* Website pages
* Homepage sections
* Food menu categories
* Food menu items
* Drink categories
* Drink items

It also uploads the bundled website images from the root `public/images` folder into Strapi.

That means a fresh local SQLite database should populate itself the first time the CMS starts.

---

# 9. Verify that Strapi is working

With Strapi still running, visit:

```text
http://localhost:1337/api/kitchen-master-content
```

You should receive JSON containing things such as:

```json
{
  "locations": [],
  "settings": {},
  "menuCategories": [],
  "pages": [],
  "homepageSections": []
}
```

The actual arrays should contain the seeded content.

This endpoint is intentionally configured as a public endpoint, so you do **not** need a Strapi API token for normal local development.

---

# 10. Configure the frontend to use your local CMS

Now create this file in the **root of the repository**:

```text
.env.local
```

So the files look like:

```text
kitchen-master/
├── .env.local
├── package.json
├── app/
└── cms/
```

Add:

```env
STRAPI_URL=http://localhost:1337
STRAPI_PREVIEW_SECRET=YOUR_PREVIEW_SECRET
NEXT_PUBLIC_SITE_URL=https://www.kitchenmasterbistro.com
RESEND_API_KEY=re_your_full_access_api_key
EMAIL_FROM=Kitchen Master Website <website@updates.kitchenmasterbistro.com>
INSIDERS_SEGMENT_ID=your_resend_segment_id
```

Replace:

```text
YOUR_PREVIEW_SECRET
```

with the same value you placed in:

```text
cms/.env
```

under:

```env
PREVIEW_SECRET=
```

The Resend sending domain in `EMAIL_FROM` must be verified. With Resend
configured, contact, private-dining, franchise, and career forms are delivered
directly to their Strapi-managed recipients. Career messages include the
uploaded résumé, and every form email sets the visitor as the reply-to address.
Create a Resend Segment for Kitchen Master Insiders and place its ID in
`INSIDERS_SEGMENT_ID`; new popup signups are added to that segment and receive
the one-time welcome email after `EMAIL_FROM` is configured. Contact collection
does not depend on the sending domain, so the Insiders list can grow while DNS
verification is pending. Use Resend Broadcasts to compose, preview, schedule,
and measure campaigns sent to that segment.

For location-targeted campaigns, create one Segment per restaurant and add a
single-line JSON map such as:

```env
INSIDERS_LOCATION_SEGMENTS={"suwanee":"segment-id","frisco":"segment-id"}
```

The repository includes a branded first campaign at
`emails/insiders-launch.html`. Once the Resend variables are configured, create
a reviewable draft in Resend with:

```bash
npm run email:campaign:draft
```

This command only creates a draft. Review the recipient Segment, links,
rendering, and test delivery in Resend before scheduling or sending it. The
template includes Resend's managed unsubscribe link.

`HIRING_WEBHOOK_URL`, `INQUIRY_WEBHOOK_URL`, and `INSIDERS_WEBHOOK_URL` remain
supported as fallbacks when Resend is not configured. `HIRING_WEBHOOK_URL` must
accept a multipart form submission and send the application to the supplied
`hiringEmail`. The website resolves that address from the selected location in
Strapi and adds these trusted fields to the webhook payload: `location`,
`locationName`, `hiringEmail`, and `source`.

To configure a restaurant, open **Content Manager → Location** in Strapi and
set **Hiring Email**. You can also set **Hiring Roles** to a JSON array such as
`["Server", "Bartender", "Kitchen"]`; those values become that location's role
options on `/careers/{location-slug}`. Publish the location after editing it.

Contact and private-dining forms are also location-aware. Configure each
restaurant's **Contact Email** and **Private Dining Email** under **Content
Manager → Location**. Configure the global **Franchise Email** under **Site
Settings**. `INQUIRY_WEBHOOK_URL` receives the validated form with a trusted
`recipientEmail` field and must use that value as the message destination.

The seeded testing recipient is `switham.gca@gmail.com` for contact, private
dining, careers, and franchise inquiries. Those fields remain editable in
Strapi. On startup, the bootstrap only migrates a missing value or the old
`Management@kitchenmasterga.com` value, so a deliberately configured address
will not be overwritten.

## Global content and location overrides

The site uses an inheritance model so editors do not have to duplicate every
page for every restaurant:

- In **Homepage Section**, leave **Location** empty to edit the global default.
  To customize one section for one restaurant, create another entry with the
  same **Section Key** and assign its **Location**.
- In **Site Page**, leave **Location** empty for the global Contact, Private
  Dining, Franchise, or Careers page. Create a second page with the same
  **Page Type** and assign a location to override that page for that restaurant.
  The slug can be unique; the website resolves these pages by Page Type and
  Location. The page's **Form Config** JSON controls form headings, submit
  labels, and select options, and can also be overridden by location.
- In **Location**, edit restaurant details, location hero copy and image,
  reservation/order links, social links, SEO, reviews, form recipients, and
  hiring roles.
- **Menu Category** and **Campaign** entries can be assigned to one or more
  locations. An entry with no locations is shared by every restaurant.
- **Site Settings** contains true site-wide fallbacks such as the default hero,
  social links, and franchise recipient.

After any edit, publish the entry. Location-specific content is preferred;
when it is absent, the frontend automatically falls back to the published
global entry.

For example:

**`cms/.env`**

```env
PREVIEW_SECRET=abc123-really-long-random-value
```

**root `.env.local`**

```env
STRAPI_URL=http://localhost:1337
STRAPI_PREVIEW_SECRET=abc123-really-long-random-value
HIRING_WEBHOOK_URL=https://example.com/your-hiring-workflow
INQUIRY_WEBHOOK_URL=https://example.com/your-inquiry-workflow
```

The frontend reads `STRAPI_URL` and proxies CMS requests through its own `/api/cms` endpoint.

### What about `STRAPI_API_TOKEN`?

The repository's root `.env.example` includes:

```env
STRAPI_API_TOKEN=
```

for its deployed Strapi setup.

For the current local setup, you can leave this out because `/api/kitchen-master-content` is explicitly configured with:

```ts
auth: false
```

in the CMS.

So your local `.env.local` can simply be:

```env
STRAPI_URL=http://localhost:1337
STRAPI_PREVIEW_SECRET=your-secret
```

---

# 11. Start the Next.js frontend

Leave Strapi running.

Open a **second terminal** and make sure it is in the root:

```text
kitchen-master/
```

Run:

```bash
npm run dev
```

The project's root `dev` script runs:

```text
next dev
```

Open:

```text
http://localhost:3000
```

You should now see the Kitchen Master site.

---

# 12. Verify the frontend can talk to Strapi

There are three useful URLs for troubleshooting.

### Website

```text
http://localhost:3000
```

This is the actual Kitchen Master website.

### Next.js CMS proxy

```text
http://localhost:3000/api/cms
```

A successful response should include:

```json
{
  "configured": true,
  "locations": [...],
  "settings": {...},
  "menuCategories": [...],
  "pages": [...],
  "homepageSections": [...]
}
```

The Next.js route takes the data from Strapi and transforms it into the format used by the frontend.

### Strapi directly

```text
http://localhost:1337/api/kitchen-master-content
```

This bypasses Next.js and lets you confirm whether the CMS itself is working.

---

# 13. Your normal development workflow

Once everything has been installed and configured, you do **not** need to repeat the installation steps every time.

You normally need two terminals.

## Terminal 1 — CMS

```bash
cd kitchen-master/cms
npm run develop
```

## Terminal 2 — Frontend

```bash
cd kitchen-master
npm run dev
```

Then use:

```text
Frontend:
http://localhost:3000

Strapi Admin:
http://localhost:1337/admin
```

---

# 14. Editing website content through Strapi

Go to:

```text
http://localhost:1337/admin
```

Your local Strapi project contains content types for:

* Locations
* Menu Categories
* Menu Items
* Site Pages
* Site Settings
* Homepage Sections

The frontend requests all of these through the custom Kitchen Master CMS endpoint.

After making changes, make sure the Strapi entry is **published** if you expect it to appear on the normal website.

The public-content controller normally requests the `published` version of the content.

---

# 15. Previewing draft content

The project also has support for draft previews.

Because you gave the frontend and CMS the same preview secret, you can use:

```text
http://localhost:3000/?preview=1
```

The frontend sends its `STRAPI_PREVIEW_SECRET` to Strapi, and Strapi only returns draft content when that value matches its `PREVIEW_SECRET`.

---

# 16. If you only want to work on the frontend

Interestingly, **Strapi is optional if you only need to work on the basic frontend design**.

You can simply run:

```bash
git clone https://github.com/moxiefoxie/kitchen-master.git
cd kitchen-master
npm ci
npm run dev
```

and visit:

```text
http://localhost:3000
```

If `STRAPI_URL` isn't configured, the frontend API returns:

```json
{
  "configured": false
}
```

and the homepage retains its hard-coded default locations, text, menus, and other fallback content.

So:

### Frontend-only development

```text
Next.js → built-in fallback content
```

### Full local development

```text
Next.js → /api/cms → local Strapi → local SQLite
```

For most development on this project, I would use the **full local setup** so that what you're seeing matches the CMS-driven production architecture.

---

# 17. Useful commands

## Frontend

Run development server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Start a previously built production version:

```bash
npm run start
```

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

These commands are defined in the root `package.json`.

## CMS

From `cms/`:

```bash
npm run develop
```

Development mode with automatic reload.

```bash
npm run build
```

Build the Strapi admin application.

```bash
npm run start
```

Run Strapi without development auto-reloading.

These commands are defined separately in `cms/package.json`.

---

# 18. Resetting your local CMS

Because local development uses SQLite, your CMS database is:

```text
cms/.tmp/data.db
```

If you ever want to completely reset your local Strapi content:

1. Stop Strapi
2. Delete the `cms/.tmp` directory
3. Run:

```bash
cd cms
npm run develop
```

The database will be created again and the Kitchen Master bootstrap code will seed a fresh set of initial data.

**Warning:** this deletes any CMS changes you made locally.

---

# 19. Common problems

## `node` is an unsupported version

Check:

```bash
node --version
```

Use Node 22.13+.

If you have `nvm`:

```bash
nvm use 22
```

---

## `next: command not found`

You probably haven't installed the root dependencies.

From:

```text
kitchen-master/
```

run:

```bash
npm ci
```

---

## `strapi: command not found`

The CMS dependencies haven't been installed.

Run:

```bash
cd cms
npm ci
npm run develop
```

---

## Website runs but CMS content isn't appearing

First check:

```text
http://localhost:1337/api/kitchen-master-content
```

If that doesn't work, the issue is on the Strapi side.

If it does work, check:

```text
http://localhost:3000/api/cms
```

If that says:

```json
{
  "configured": false
}
```

make sure the root `.env.local` contains:

```env
STRAPI_URL=http://localhost:1337
```

Then restart the Next.js development server.

---

## `/api/cms` returns `502`

The Next.js route returns a `502` when it is configured for Strapi but cannot successfully retrieve the Strapi content.

Check that:

```text
http://localhost:1337
```

is running and that:

```text
http://localhost:1337/api/kitchen-master-content
```

returns JSON.

---

## I changed something in Strapi and don't immediately see it

The Next.js CMS fetch is configured with a **60-second revalidation period**, so CMS responses may be cached briefly.

Also verify that the entry is published rather than only saved as a draft.

---

# 20. Quick-start cheat sheet

For a brand-new machine:

```bash
# Clone
git clone https://github.com/moxiefoxie/kitchen-master.git
cd kitchen-master

# Frontend dependencies
npm ci

# CMS dependencies
cd cms
npm ci

# Create CMS environment
cp .env.example .env

# Edit cms/.env and replace the secret values

# Return to root
cd ..

# Create .env.local containing:
# STRAPI_URL=http://localhost:1337
# STRAPI_PREVIEW_SECRET=<same value as cms PREVIEW_SECRET>
```

Then run these simultaneously:

**Terminal 1**

```bash
cd kitchen-master/cms
npm run develop
```

**Terminal 2**

```bash
cd kitchen-master
npm run dev
```

Open:

```text
Website
http://localhost:3000

CMS
http://localhost:1337/admin
```

That's the complete local development environment.
