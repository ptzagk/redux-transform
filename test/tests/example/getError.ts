export default function getError() {
    try {
        return `${Symbol("whoops")}`;
    } catch (e) {
        return e;
    }
}
