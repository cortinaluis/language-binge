const WHITESPACE = ' ';
const EMPTY_STRING = '';
const MILISECONDS_TO_WAIT = 1000;

const MESSAGES = {
    SET_TO_LANGUAGE: 'setToLanguage',
    SET_FROM_LANGUAGE: 'setFromLanguage',
    BOOTSTRAP_EXTENSION: 'bootstrapExtension',
    CLEANUP_PAGE_OVERLAY: 'cleanupOverlay',
};

const STREAMING_REGEXES = {
    NETFLIX: /(https|http):\/\/(www.)?netflix.com\/watch\/*/,
};

const SUPPORTED_LANGUAGES = [
    { 'code':'en', 'name':'English' },
    { 'code':'ar', 'name':'Arabic' },
    { 'code':'zh', 'name':'Chinese' },
    { 'code':'fr', 'name':'French' },
    { 'code':'de', 'name':'German' },
    { 'code':'hi', 'name':'Hindi' },
    { 'code':'id', 'name':'Indonesian' },
    { 'code':'ga', 'name':'Irish' },
    { 'code':'it', 'name':'Italian' },
    { 'code':'ja', 'name':'Japanese' },
    { 'code':'ko', 'name':'Korean' },
    { 'code':'pl', 'name':'Polish' },
    { 'code':'pt', 'name':'Portuguese' },
    { 'code':'ru', 'name':'Russian' },
    { 'code':'es', 'name':'Spanish' },
    { 'code':'tr', 'name':'Turkish' },
    { 'code':'vi', 'name':'Vietnamese' },
];

export { WHITESPACE, MILISECONDS_TO_WAIT, EMPTY_STRING, MESSAGES, SUPPORTED_LANGUAGES, STREAMING_REGEXES };
