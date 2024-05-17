/**
 * Converts an object to a JSON string with escaped double quotes.
 * @param _data - The object to convert.
 * @returns A JSON string with escaped double quotes.
 */
export function convertToEscapedJSONString(_data:any): string{
    return convertToJSONString(_data).replace(/"/g, '\\"')
}

/**
 * Converts an object to a JSON string.
 * @param _data - The object to convert.
 * @returns A JSON string representation of the input object.
 */
export function convertToJSONString(_data:any): string{
    return (JSON.stringify(_data))
}

/**
 * Converts an JSON string to object.
 * @param _data - JSON string to convert.
 * @returns A object representation of the input JSON string.
 */
export function convertStringToJSON(_data:any): any{
    try
    {
        return (JSON.parse(_data))
    }
    catch(err)
    {
        console.log("🚀 ~ file: json.ts:27 ~ convertStringToJSON ~ err:", err)
        return {};
    }
}