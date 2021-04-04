function pad(number, length){
    var str = "" + number
    while (str.length < length) {
        str = '0'+str
    }
    return str
}

let offset = new Date().getTimezoneOffset();
export const timezone = 'UTC '+((offset<0? '+':'-')+ pad(parseInt(Math.abs(offset/60)), 2)+':'+pad(Math.abs(offset%60), 2));