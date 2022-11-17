export const getErrorDetails = (err) => {
    if (err.response?.data?.message) {
        return ' - ' + err.response.data.message;
    }
    return '';
}

export const checkAuthFailure = (err) => {
    return err.response.status === 401 || err.response.status === 403;
}
