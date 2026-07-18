# Anchored Inside Website V3

A GitHub-ready, Netlify-ready counseling practice website with:

- Home
- About Jessica
- Anchored Inside philosophy
- Services
- Searchable Resource Hub
- Netlify contact form
- Privacy and disclaimer pages
- Decap CMS starter admin at `/admin/`

## Upload to GitHub

Upload the CONTENTS of this folder to the top level of the repository. `index.html` must be visible on the repository home screen.

## Connect Netlify

- Build command: leave blank
- Publish directory: `.`
- Production branch: `main`

## CMS setup

The `/admin/` dashboard is included, but it will not allow sign-in until Netlify authentication is configured.

In Netlify:
1. Enable Identity.
2. Enable Git Gateway.
3. Invite your own email as a user.
4. Open `https://YOUR-SITE.netlify.app/admin/`.

## Resource data

The live Resource Hub reads from `data/resources.json`.

For simple GitHub updates, edit that file and place new handouts in `assets/handouts/`.

## Before launch

Replace sample contact information, appointment links, privacy language, and any copyrighted resources you do not have permission to distribute.
