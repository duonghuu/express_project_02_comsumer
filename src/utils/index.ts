
function formatName(str: string) {

    str = str.replace(/  +/g, ' ');

    let arrTemp = str.split(' ');

    const objName: { LAST_NAME?: string; MIDDLE_NAME?: string; FIRST_NAME?: string } = {};
    if (arrTemp.length > 0) {

        objName['LAST_NAME'] = arrTemp[0];

        if (arrTemp.length > 1) {
            objName['FIRST_NAME'] = arrTemp[arrTemp.length - 1];
        }

        if (arrTemp.length > 2) {
            arrTemp.splice(0, 1);
            arrTemp.splice(arrTemp.length - 1, 1);
            objName['MIDDLE_NAME'] = arrTemp.join(' ');
        }
    }


    return objName;
}
function getDate(dateStr: string) {
    let timestamp = new Date(dateStr);
    return timestamp.getFullYear() + '/' + (timestamp.getMonth() + 1) + "/" + timestamp.getDate() + " " + timestamp.getHours() + ":" + timestamp.getMinutes() + ":" + timestamp.getSeconds();
}

export const utils = {
    formatName,
    getDate
}