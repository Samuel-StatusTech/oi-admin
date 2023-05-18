export const cellPhoneMask = (phone) => {
    let phoneMasked = removeMask(phone);

    phoneMasked = phoneMasked.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    phoneMasked = !phoneMasked[2]
        ? phoneMasked[1]
        : '(' +
        phoneMasked[1] +
        ') ' +
        phoneMasked[2] +
        (phoneMasked[3] ? '-' + phoneMasked[3] : '');

    return phoneMasked;
}
export const removeMask = (value) => {
    return (value ?? '').replace(/\D/g, '');
}
export const currencyMask = (value) => {
    return valueMask(value, 'R$ ', '');
}
export const percentageMask = (value) => {
    return valueMask(value, '% ', '');
}
export const valueMask = (value, prefix, suffix) => {
    if (!value) value = 0;

    value = Number(value).toString().replace(/^\D+/g, '');
    value = value.replace(',', '');
    value = parseInt(value).toString();

    if (value.length === 0 || value === 0) {
      value = `0,00`;
    } else if (value.length === 1) {
      value = `0,0${value}`;
    } else if (value.length === 2) {
      value = `0,${value}`;
    } else {
        
      const position = value.length - 2;
      let money = new Intl.NumberFormat();
      value = `${money.format(value.slice(0, position))},${value.slice(position)}`;
    }

    return `${prefix}${value}${suffix}`;
}