export default interface UrlMatchResponse {
    isMatching: boolean;
    pathParams?: Record<string, string>;
}
