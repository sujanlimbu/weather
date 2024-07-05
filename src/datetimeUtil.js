import {parse, format} from 'date-fns';

export function getHourAmPm(date){
    const formated = format(date, 'h a');
    if (formated === format(new Date(), 'h a'))
        return "Now";
    return formated;
}

export function getDaysName(date){
    const formated = format(date, 'EEE');
    if (formated === format(new Date(), 'EEE'))
        return "Today";
    return formated;
}