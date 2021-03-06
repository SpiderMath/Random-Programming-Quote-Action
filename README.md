# Random Programming Quote Action

Puts a totally RANDOM programming quote to your README! This can be really useful for your Profile Readme.<br>

# ⚙ Usage
Put this in your README (the `...` stand for preceding and subsequent readme content, please ignore that)

```md
...
<!--PROGRAMMING-QUOTE-BOT:start-->

<!--PROGRAMMING-QUOTE-BOT:end-->
...
```

If you are thinking about putting ANY content between these 2 comments, please do not, since they will be removed by the GitHub action<br>

Make a new file in `.github/workflows` under your root directory. The file name can be anything you wish to keep! The only requirement is that it **has** to be a `.yml` file.<br>

For the sake of this example, let's just name it `action.yml`<br>

Next, please put the following code in `action.yml`

```yml
name: Random Programming Quote

on:
  schedule:
    - cron: '*/30 * * * *'
  workflow_dispatch:

jobs:
  putRandomQuote:
    runs-on: ubuntu-latest
    name: Put a random random programming quote in README

    steps:
      - uses: actions/checkout@v2
      - name: Setup Node Environment
        uses: actions/setup-node@v2
        with:
          node-version: '14'
      - name: Update the README
        uses: SpiderMath/Random-Quote-Action@main
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          QUOTE_FONT_SIZE: 6
          COMMIT_MESSAGE: 'Updated the README with a new Programming Quote 💻 '
          ITALICS: true
          BLOCKQUOTES: true
```

> ℹ The `QUOTE_FONT_SIZE` is the size of the font, in the form of h tags. h1 is the largest tag, h6 is the smallest. So if you want LARGE text, you will warn you use `1` or `2`. If you want a normalish size font use `5` or `6`<br>
Default is `3`

> ℹ Also, you can change the `cron` parameter to change the duration till which you want to update the readme, this updates the readme every 30 minutes

> ℹ You can also change the message shown on Commit, by putting COMMIT_MESSAGE as the text you want! Default is: 'Updated the README with a new Programming Quote 💻 '

> ℹ `ITALICS` is to let the action know Whether you want the text to be italicized (text meaning the Quote) Default is: false, that is you **don't** want it to be italicized

> ℹ `BLOCKQUOTE` is to configure whether the Quote and Author shall be present in a BlockQuote or not. Default is: true, that is you **do** want your quote to be present in a blockquote, as I got it here


#### And that's pretty much it! Just run the Action, and you'll see a random quote being shipped in every 30 minutes or the timeout you've set! Hope it proved useful, since I use it myself in my very own Profile README :grin: 