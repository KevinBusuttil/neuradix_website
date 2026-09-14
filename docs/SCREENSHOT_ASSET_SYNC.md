# Website product screenshot sync

The public website serves product screenshots from `site/assets/screenshots/` rather than hotlinking product repositories.

This is required for Neuradix Origin because the Origin source repository is private. A public browser cannot load its `raw.githubusercontent.com` URLs, even though the website itself is public.

## Origin token

The manual `Sync product screenshots` workflow requires the repository Actions secret `ORIGIN_SCREENSHOT_TOKEN`.

Use a fine-grained GitHub personal access token with:

- repository access limited to `KevinBusuttil/neuradix-origin`;
- **Contents: Read-only** permission;
- no write or administration permissions.

Store it only as the `ORIGIN_SCREENSHOT_TOKEN` Actions secret in `KevinBusuttil/neuradix_website`. The workflow sends it only to the GitHub Contents API and never exposes it to the public website.

## Refresh procedure

Run **Actions → Sync product screenshots → Run workflow** on the branch that should receive refreshed images. The workflow:

1. downloads the public Atlas canonical marketing screenshot;
2. retrieves the three pinned Origin golden images through the authenticated GitHub Contents API;
3. verifies PNG signatures and expected dimensions;
4. verifies public pages are using same-origin screenshot paths;
5. commits changed PNGs back to the selected branch.

The public site then loads `/assets/screenshots/...` from `www.neuradix.com`, so visitors never need access to the private Origin repository.
