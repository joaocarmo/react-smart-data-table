#!/bin/sh
FILES=$(git diff --cached --name-only --diff-filter=ACMR "*.js" "*.jsx" | sed 's| |\\ |g')
[ -z "$FILES" ] && exit 0

# ESLint on all selected files
echo "$FILES" | xargs ./node_modules/.bin/eslint --fix

# Prettier on all selected files
echo "$FILES" | xargs ./node_modules/.bin/prettier --write

# Add back the modified/prettified files to staging
echo "$FILES" | xargs git add

exit 0
