![Logo](src/extension/logo-128.png) ![Language Binge](src/extension/typography.png) 

Download the extension on the [chrome web store](https://chrome.google.com/webstore/detail/languagebinge/mophilpmoddkikifoloihkgcfofgmekj) and be happy!

Known bugs:

~~- The `MutationObserver` gets more data than it should, that retriggers unnecessary redraws at the `Overlay`~~

~~- Translation is being called more than once. We should restrict those calls~~

~~- Sometimes a standard subtitle from streaming service slips in~~

~~- Kill subtitles from `Overlay` when they are removed from streaming subtitle~~

~~- Deal with subtitle deactivation on streaming service (`observer.disconnect()` ?)~~


Todos:

~~- Create small interface and icon~~

~~- Add support for language selection (and extension persistent configs)~~

~~Add ESLint~~

- Add icon animation for loading ~~(replacing the error message of `MutationObserver`)~~
- Setup CI/CD
- Setup publishing
- Add tests
- Add support to full screen Netflix

Future:
- Add support to other streaming services
- Create statistics visualization for user
- Add functionality for the user to review learned words