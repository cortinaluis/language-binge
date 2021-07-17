Download the extension on the [chrome web store](https://chrome.google.com/webstore/detail/mophilpmoddkikifoloihkgcfofgmekj/preview?hl=en-GB&authuser=0) ♥

Known bugs:
- The `MutationObserver` gets more data than it should, that retriggers unnecessary redraws at the `Overlay`
- Translation is being called more than once. We should restrict those calls

Todo:
- Create small interface and icon
- Add icon animation for loading (replacing the error message of MutationObserver)
- Setup CI/CD
- Setup publishing
- Add tests
- Add ESLint
