# Darwin EvoDNA — GitHub Pages publication guide

Repository settings: https://github.com/xulytiengviet/Darwin/settings/pages

## Intended URL

For the public repository `xulytiengviet/Darwin`, the conventional GitHub Pages project URL is:

https://xulytiengviet.github.io/Darwin/

**Do not assume this URL is live without checking HTTP response and the latest completed deployment**. A "pages build and deployment" workflow is visible on the repository's GitHub Actions history, indicating Pages has been configured previously, but CI success alone does not guarantee independent reachability at every time.

## Publish from existing branch mode (recommended to avoid competing pipelines)

1. Open the Settings → Pages link above while signed in as repository owner.
2. In "Build and deployment", choose **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**; Save.
4. Keep `index.html` at the root, alongside `assets/`, `src/` and `vendor/`.
5. Push a change to `main`, check Actions → **pages build and deployment** for success.
6. Open the project URL and verify that the new heading "CVNSS4.0 như DNA tính toán: giả thuyết có thể bác bỏ" appears, then exercise **Chạy kiểm nghiệm 5 nhóm** and **Biên dịch DNA số thành tác tử**.
7. In browser Developer Tools, ensure no missing ES module fetches or CSP failures.

**Do not set Pages source to /docs for this version:** the entrypoint is `/index.html` and docs contains Markdown research protocols. The `.nojekyll` root marker instructs Pages to serve the static module tree directly.

## Connector scope

The GitHub plugin supports reading/writing repository files, commits and workflow runs. It does **not** expose an action to modify the GitHub Pages Settings screen. Updating code cannot change the selected Pages publishing source. Therefore the owner must make any source-selection changes in GitHub's web UI.

## Current scientific website restrictions

- Do not put DeepSeek or other provider API keys in GitHub Pages files.
- Microphone permission is browser-controlled and acoustic samples are converted locally.
- Benchmark results in the dashboard are synthetic toy metrics.
- The displayed bootstrap intervals are not scientific validation for LLM generation or biological systems.
- A future authenticated LLM-guided agent requires a separately secured server and external sandbox.
