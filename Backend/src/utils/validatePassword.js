const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Mật khẩu phải có ít nhất ${minLength} ký tự`);
    }
    if (!hasUpperCase) {
        errors.push('Mật khẩu phải chứa ít nhất 1 ký tự viết hoa');
    }
    if (!hasLowerCase) {
        errors.push('Mật khẩu phải chứa ít nhất 1 ký tự viết thường');
    }
    if (!hasNumber) {
        errors.push('Mật khẩu phải chứa ít nhất 1 chữ số');
    }
    if (!hasSpecialChar) {
        errors.push('Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

export default validatePassword;