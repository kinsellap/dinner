import { isNotEmpty } from "./StringUtils";

export const dateOnly = (date) => {
    if (isNotEmpty(date)) {
        return date.split('T')[0];
    };
}

