import { format, isValid, parse } from 'date-fns';

export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    // First try to parse the date if it's in dd-MM-yyyy format
    const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
    
    // If the date is valid after parsing, return the formatted date
    if (isValid(parsedDate)) {
        return format(parsedDate, 'dd/MM/yyyy');
    }
    
    // If parsing failed, try parsing other common formats
    const formats = [
        'yyyy-MM-dd',
        'MM-dd-yyyy',
        'MM/dd/yyyy',
        'dd/MM/yyyy',
        'yyyy/MM/dd'
    ];
    
    for (const fmt of formats) {
        try {
            const attemptParse = parse(dateString, fmt, new Date());
            if (isValid(attemptParse)) {
                return format(attemptParse, 'dd/MM/yyyy');
            }
        } catch (e) {
            // Continue to next format if parsing fails
            continue;
        }
    }
    
    // If all format parsing failed, try creating a new Date object
    try {
        const date = new Date(dateString);
        if (isValid(date)) {
            return format(date, 'dd/MM/yyyy');
        }
    } catch (e) {
        // If date creation fails, return N/A
        return 'N/A';
    }
    
    // If all attempts fail, return N/A
    return 'N/A';
};

export const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // Try parsing the date if it's in dd-MM-yyyy format
    const parsedDate = parse(dateString, 'dd-MM-yyyy', new Date());
    
    // If the date is valid after parsing, return it
    if (isValid(parsedDate)) {
        return parsedDate;
    }
    
    // If parsing failed, try creating a new Date object
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isValid(date)) {
        return date;
    }
    
    // If all attempts fail, return null
    return null;
}; 