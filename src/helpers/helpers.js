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

module.exports = {
    birthDate,
    enteredDate,
  };