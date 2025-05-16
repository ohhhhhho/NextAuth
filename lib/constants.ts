export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
export const FILE_SIZE_MAX_LIMIT = 5 * 1024 * 1024;  // 5MB
export const AUTH_ERRORS = {
    EMAIL_EXISTS: {
        code: 'EMAIL_EXISTS',
        message: '이미 사용 중인 이메일입니다.'
    },
    EMAIL_AUTH: {
        code: 'EMAIL_AUTH',
        message: '유효하지 않은 이메일 형식입니다.'
    },
    EMAIL_NOT_FOUND: {
        code: 'EMAIL_NOT_FOUND',
        message: '해당 이메일로 가입된 계정이 없습니다.'
    },
    INVALID_CREDENTIALS: {
        code: 'INVALID_CREDENTIALS',
        message: '이메일 또는 비밀번호가 일치하지 않습니다.'
    },
    AUTH_PASSWORD: {
        code: 'AUTH_PASSWORD',
        message: '비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.'
    },
    INVALID_PASSWORD: {
        code: 'INVALID_PASSWORD',
        message: '비밀번호가 일치하지 않습니다.'
    },
    ACCOUNT_SUSPENDED: {
        code: 'ACCOUNT_SUSPENDED',
        message: '계정이 일시 정지되었습니다. 관리자에게 문의하세요.'
    },
    SERVER_ERROR: {
        code: 'SERVER_ERROR',
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    }
};