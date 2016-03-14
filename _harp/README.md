# Production ready R

* How do you write robust, readable code
  * Programming
    * local, function-level
  * Software engineering
    * global, project-level

**how to write analysis that can run again and again**

# Programming
* **Principle** -- less outside context needed = clearer code
  ```
  baz <- foo(bar, qux)
  ```
  ```
  df2 <- arrange(df, qux)
  ```

## Naming of variables and functions
  * programming is both about talking to computers and talking to people
  * collaboration with future you/others

## Some potential gotchas

  ```
  df[, vars]  # type unstable -- you have to know if vars if one or multiple, could get dataframe or vector
  filter(df, x==y) # non-standard -- silent incorrect results
  data.frame(x = "a") # data frame with one column, value depends on some global value
  ```

## 3 classes of surprises

* unstable types, non-standard evalution, hidden arguments

```
df <- data.frame(
  a = 1L,
  b = 1.S,
  y = Sys.time(),
  z = ordered(1)
)

str(sapply(df[1:4], class)) # vector
str(sapply(df[1:2], class))
str(sapply(df[3:4], class)) # matrix
str(sapply(df[0], class))

```
**functions that always succeed are always the most dangerous**
use [purrr](https://github.com/hadley/purrr)

```
library(purrr)
```
type of output should not depend on input


## non-standard

because of how r handles scoping?

* functions should fail early if there's a problem
* specify/make it explicit


## offenders of hidden arguments

* `stringAsFactors` - causes weird effects
* system language
* time zone
* default text encoding
* line endings
* `na.action`

-- warnPartialMatchArgs, warnPartialMatchAttr, warnPartialMatchDollar

dplyr is stricter

"At the heart of R, theres a tension ...trying to be helpful and guess at what you want? or a programming language where it should fail early and make you aware of problems"


Question: dataframe in dplyr
dply dataframe overrides print and subsetting, ignores drop=FALSE

# Software engineering

"I've never done a data analysis in production...some things I think and some things friends have told me"

## "In Production"

* not just a static report
* when you're running it again and again
* kinda like reproducible research
  * timescale is different, more often

## Isolation

* different projects depending on different versions of packages
* libraries vs. packages
  * package is one package
  * library is a collection of packages
* isolate dependencies
* [`packrat`](https://rstudio.github.io/packrat/)
  * saves packages and versions to a text file
  * others can re-install packages easily
* Microsoft [`checkpoint`](https://mran.revolutionanalytics.com/documents/rro/reproducibility/#timemachine)
  * checkpoint dependent on daily snapshots of CRAN
* Renv for specifying versions of R

## Verification

* automate things
* Use knitr/rmarkdown
* use `git`
  * check diff before checking in
* [commit derived files](https://stat545-ubc.github.io/bit006_github-browsability-wins.html#get-over-your-hang-ups-re-committing-derived-products) so that you can verify your changes
* tests for fragile analysis paths
  * assertr, etc.

## Documentation

* rmarkdown/knitr
  * The [`spin`](http://deanattali.com/2015/03/24/knitrs-best-hidden-gem-spin/) function is useful
    * Where code is the main focus, and markdown is in comments for code
* rStudio connect [beta](https://www.rstudio.com/rstudio-connect-beta/) -- publish and share within company

## Other things to consider

* Continuous integration?
* Build automation?
  * make files

# Questions

* rmarkdown in oxygen?
  * [Pending](https://github.com/klutometis/roxygen/pull/431)

* Recommended interactive plot?
  * Shiny
  * What about standalone?
    * Doesn't plan on writing a standalone -- not dependent on a server running R -- charting lib
    * Currently -- [rCharts](http://ramnathv.github.io/rCharts/)

* What signs to look for whether or not to use a package?
  * look for tests
  * documentation
  * check out source code a little bit

* Out of your packages, which one to contribute to -- good for people trying to get into open source and need a little bit love?
  * look at issues
    * make **simplest reproducible** examples
    * [https://github.com/jennybc/reprex](reprex) helps you use rmarkdown to post on GitHub and StackOverflow
    * [http://stackoverflow.com/questions/5963269/how-to-make-a-great-r-reproducible-example/5965451#5965451](How to make a great r reproducible example)
    * examples
      * [too complex](https://github.com/hadley/dplyr/issues/1556)
      * [simpler](https://github.com/hadley/dplyr/issues/1669)
  * [readr](https://github.com/hadley/readr) is in need of attention
  * tend to focus in on one R package at a time
    * [dplyr](https://github.com/hadley/dplyr) is next after finishing book -- [draft here](http://r4ds.had.co.nz/)
  * tends to cut off the world when he's trying to dig into stuff

* Credentials, where should they go? best practice
  * set things in environment variables
  * `.Renviron`
  * don't check in the credentials to the web
  * thing to watch: https://github.com/MangoTheCat/keyring

# Rapidfire questions

* proudest package
  * ggplot2

* hardest to maintain
  * ggplot2, dependencies, rcommand?

* best hangout in Houston
  * double trouble

* Red Sox or Astros
  * neither

* beach or mountain
  * beach

* why r vs. python?
  * ggplot2, r community, shiny, RStudio

* what would you like to change?
  * nothing within my power to change

