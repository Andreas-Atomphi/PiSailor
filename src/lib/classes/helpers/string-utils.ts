


export namespace StringUtils {
    export function format(str: string, ...val: string[]) {
        for (let index = 0; index < val.length; index++) {
			str = str.replaceAll(`{${index}}`, val[index]);
        }
        return str;
    }

}