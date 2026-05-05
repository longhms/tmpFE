// ===== Common =====
export const EMPTY_STRING = '';

// ===== Length =====
export const MAX_LENGTH = {
    LOGIN_ID: 50,
    NAME: 125,
    EMAIL: 125,
    TELEPHONE: 50,
    PASSWORD: 50,
    PASSWORD_MIN: 8,
};

// ===== Regex =====
export const REGEX = {
    DATE_YYYY_MM_DD: /^\d{4}\/\d{2}\/\d{2}$/,
    LOGIN_ID: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
    KANA_HALF_WIDTH: /^[\uFF65-\uFF9F]+$/,
    TELEPHONE: /^[0-9\-]+$/,
    ASCII: /^[\x00-\x7F]+$/,
    NUMBER: /^[0-9]*$/,
    SCORE: /^[0-9]+(\.[0-9]+)?$/,
};

export const FIELD = {
    LOGIN_ID: 'アカウント名',
    GROUP: 'グループ',
    NAME: '氏名',
    NAME_KANA: 'カタカナ氏名',
    BIRTH_DATE: '生年月日',
    EMAIL: 'メールアドレス',
    TELEPHONE: '電話番号',
    PASSWORD: 'パスワード',
    PASSWORD_CONFIRM: 'パスワード（確認）',
    CERTIFICATION_ID: '資格ID',
    CERTIFICATION_START: '資格交付日',
    CERTIFICATION_END: '失効日',
    SCORE: '点数',
} as const;