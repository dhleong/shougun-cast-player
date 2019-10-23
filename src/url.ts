import querystring from "querystring";
import urllib from "url";

export function setQueryParams(url: string, params: any) {
    const parsedUrl = urllib.parse(url);
    const originalParams = querystring.parse(parsedUrl.query || "");
    const newParams = Object.assign(originalParams, params);
    const newParamsString = querystring.stringify(newParams);
    parsedUrl.query = newParamsString;
    parsedUrl.search = "?" + newParamsString;
    return urllib.format(parsedUrl);
}
