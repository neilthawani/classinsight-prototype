import { format } from 'date-fns';

export default function(dateToParse) {
    var dateObj = dateToParse.split("-").reduce((prev, item, index) => {
        switch(index) {
            case 0:
                prev["year"] = parseInt(item, 10);
                break;
            case 1:
                prev["month"] = parseInt(item, 10) - 1;
                break;
            case 2:
                prev["date"] = parseInt(item, 10);
                break;
            default:
                break;
        }

        return prev;
    }, {
        year: 0,
        month: 0,
        date: 0
    });

    return format(new Date(dateObj['year'], dateObj['month'], dateObj['date']), 'PPP')
}
