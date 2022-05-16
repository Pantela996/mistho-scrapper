class InvalidCredentialsException extends Error {
    constructor(message: string) {
       super(message);

       Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
    };
};

export default InvalidCredentialsException;