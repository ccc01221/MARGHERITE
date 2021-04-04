export function createCookie(name, value, minutes) {
    let expires;
    if (minutes) {
        let date = new Date();
        date.setTime(date.getTime() + minutes * 60 * 1000);
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};