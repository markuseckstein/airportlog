workflow "Pages deploy" {
  on = "push"
  resolves = ["Deploy to GitHub Pages"]
}

action "NPM install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Only on master"]
  runs = "npm ci"
}

action "Build" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["NPM install"]
  args = "npm run build:prod"
}

action "Only on master" {
  uses = "actions/bin/filter@d820d56839906464fb7a57d1b4e1741cf5183efa"
  args = "branch master"
}

action "Deploy to GitHub Pages" {
  uses = "maxheld83/ghpages@v0.2.1"
  needs = ["Build"]
  env = {
    BUILD_DIR = "dist/"
  }
  secrets = ["GH_PAT"]
}
