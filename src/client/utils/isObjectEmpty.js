export default function isObjectEmpty(value) {
    return Boolean(value && typeof value === 'object') && !Object.keys(value).length;
}
