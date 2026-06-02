# Install

**TODO:** Make this a script, and test in a `docker` container.

## Ubuntu linux (WORKING INSTRUCTIONS!)

```bash
$ sudo apt install ruby-full
$ gem install bundler        # add ~/.local/share/gem/ruby/3.3.0/bin to PATH so installed executable (bundler) is found
$ bundle config set --local path 'vendor/bundle'     # so it installs in local folder vendor/bundle NOT in root
$ bundle install       # gems (ruby libraries) from Gemfile
$ bundle exec jekyll serve         # start serving website on localhost
```

## Fedora linux (NOT WORKING)
- Install Jekyll and plug-ins in one fell swoop. `gem install github-pages` This mirrors the plug-ins used by GitHub Pages on your local machine including Jekyll, Sass, etc.
In Fedora:
```console
$ sudo dnf install ruby-devel
$ gem install github-pages
```
- Clone down your fork `git clone https://github.com/sohang3112/sohang3112.github.io.git`
- Serve the site and watch for markup/sass changes `jekyll serve`
- View your website at http://127.0.0.1:4000/
- Commit any changes and push everything to the master branch of your GitHub user repository. GitHub Pages will then rebuild and serve your website.

