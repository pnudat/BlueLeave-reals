function birthDate(ldapTime) {  // res to birthDate function (values: DD/MM/YYYY)
    const Timestamp = parseInt(ldapTime) / 10000000 - 11644473600;
    const dateObject = new Date(Timestamp * 1000);

    const day = dateObject.getUTCDate().toString().padStart(2, '0');
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getUTCFullYear();

    return `${day}/${month}/${year}`;
}

function enteredDate(ldapDate) {    // res to enteredDate function (values: DD/MM/YYYY)
    const year = ldapDate.slice(0, 4);
    const month = ldapDate.slice(4, 6);
    const day = ldapDate.slice(6, 8);

    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);

    const formatDate = `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;

    return formatDate;
}

function calWorkExp(ldapDate) {
    const year = ldapDate.slice(0, 4);
    const month = ldapDate.slice(4, 6);
    const day = ldapDate.slice(6, 8);

    const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
    const formattedDate = `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
    const currentDate = new Date();

    const workExperience = currentDate - date;
    const dateNow = new Date(workExperience);

    const years = dateNow.getUTCFullYear() - 1970;
    const months = dateNow.getUTCMonth();
    const days = dateNow.getUTCDate() - 1;

    return {
        formattedDate: formattedDate,
        years: years,
        months: months,
        days: days
    };
}

async function formatDate(informDate) {
    const [day, month, year] = informDate.split('/');
    const formattedDate = `${year}/${month}/${day}`;

    return formattedDate;
}

function holidayDate(holidayDate) {    // res to enteredDate function (values: DD/MM/YYYY)
    const date = new Date(holidayDate);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

module.exports = {
    birthDate,
    enteredDate,
    calWorkExp,
    formatDate,
    holidayDate,
};