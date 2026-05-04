import { z } from 'zod';
import { ERROR_MESSAGES, formatMessage } from '@/lib/constants/messages';
import { FIELD, REGEX, MAX_LENGTH } from '@/lib/constants/validation';
import { DATE_FORMAT, EMPTY_STRING } from '@/lib/constants/employee';

// Check ngày hợp lệ
const dateString = z.string().refine(
    (date) => date === EMPTY_STRING || REGEX.DATE_YYYY_MM_DD.test(date),
    { message: formatMessage(ERROR_MESSAGES.ER011, [FIELD.BIRTH_DATE, DATE_FORMAT]) }
);

// ── Base OBJECT (chỉ z.object, KHÔNG refine — để có thể .extend()) ──
const baseEmployeeObject = z.object({
    loginId: z
        .string()
        .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.LOGIN_ID]))
        .trim()
        .max(50, formatMessage(ERROR_MESSAGES.ER006, [FIELD.LOGIN_ID, String(MAX_LENGTH.LOGIN_ID)]))
        .regex(REGEX.LOGIN_ID, formatMessage(ERROR_MESSAGES.ER019)),

    departmentId: z
        .string()
        .min(1, formatMessage(ERROR_MESSAGES.ER002, [FIELD.GROUP])),

    employeeName: z
        .string()
        .trim()
        .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.NAME]))
        .max(125, formatMessage(ERROR_MESSAGES.ER006, [FIELD.NAME, String(MAX_LENGTH.NAME)])),

    employeeNameKana: z
        .string()
        .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.NAME_KANA]))
        .max(125, formatMessage(ERROR_MESSAGES.ER006, [FIELD.NAME_KANA, String(MAX_LENGTH.NAME)]))
        .regex(REGEX.KANA_HALF_WIDTH, formatMessage(ERROR_MESSAGES.ER009, [FIELD.NAME_KANA])),

    birthDate: dateString.min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.BIRTH_DATE])),

    employeeEmail: z
        .email(formatMessage(ERROR_MESSAGES.ER005, [FIELD.EMAIL]))
        .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.EMAIL]))
        .max(255, formatMessage(ERROR_MESSAGES.ER006, [FIELD.EMAIL, String(MAX_LENGTH.EMAIL)])),

    employeeTelephone: z
        .string()
        .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.TELEPHONE]))
        .max(50, formatMessage(ERROR_MESSAGES.ER006, [FIELD.TELEPHONE, String(MAX_LENGTH.TELEPHONE)]))
        .regex(REGEX.TELEPHONE, formatMessage(ERROR_MESSAGES.ER018, [FIELD.TELEPHONE]))
        .regex(REGEX.TELEPHONE, formatMessage(ERROR_MESSAGES.ER008, [FIELD.TELEPHONE])),

    certificationId: z
        .string()
        .regex(REGEX.NUMBER, formatMessage(ERROR_MESSAGES.ER008, [FIELD.CERTIFICATION_ID])),
    certificationStartDate: dateString,
    certificationEndDate: dateString,

    score: z.string().refine((val) => val === EMPTY_STRING || REGEX.SCORE.test(val), {
        message: formatMessage(ERROR_MESSAGES.ER008, [FIELD.SCORE]),
    }),
});

// ── Helper: gắn các refine cross-field chung cho cả add/update ──
function attachCommonRefines<T extends z.ZodTypeAny>(schema: T) {
    return schema
        // 3 trường bắt buộc khi đã chọn certification
        .refine((d: any) => !d.certificationId || d.certificationStartDate !== EMPTY_STRING, {
            message: formatMessage(ERROR_MESSAGES.ER001, [FIELD.CERTIFICATION_START]),
            path: ['certificationStartDate'],
        })
        .refine((d: any) => !d.certificationId || d.certificationEndDate !== EMPTY_STRING, {
            message: formatMessage(ERROR_MESSAGES.ER001, [FIELD.CERTIFICATION_END]),
            path: ['certificationEndDate'],
        })
        .refine((d: any) => !d.certificationId || d.score !== EMPTY_STRING, {
            message: formatMessage(ERROR_MESSAGES.ER001, [FIELD.SCORE]),
            path: ['score'],
        })
        // endDate > startDate
        .refine(
            (d: any) => {
                if (!d.certificationId || !d.certificationStartDate || !d.certificationEndDate) return true;
                return d.certificationEndDate > d.certificationStartDate;
            },
            { message: formatMessage(ERROR_MESSAGES.ER012), path: ['certificationEndDate'] }
        );
}

// ── Schema cho ADD: extend object base + thêm password rules + refines ──
export const addEmployeeSchema = attachCommonRefines(
    baseEmployeeObject.extend({
        loginPassword: z
            .string()
            .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.PASSWORD]))
            .min(8, formatMessage(ERROR_MESSAGES.ER007, [FIELD.PASSWORD, String(MAX_LENGTH.PASSWORD_MIN), String(MAX_LENGTH.PASSWORD_MIN), String(MAX_LENGTH.PASSWORD)]))
            .max(50, formatMessage(ERROR_MESSAGES.ER007, [FIELD.PASSWORD, String(MAX_LENGTH.PASSWORD_MIN), String(MAX_LENGTH.PASSWORD_MIN), String(MAX_LENGTH.PASSWORD)]))
            .regex(REGEX.ASCII, formatMessage(ERROR_MESSAGES.ER008, [FIELD.PASSWORD])),

        loginPasswordConfirm: z
            .string()
            .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.PASSWORD_CONFIRM])),
    })
).refine(
    (d: any) => d.loginPassword === d.loginPasswordConfirm,
    { message: formatMessage(ERROR_MESSAGES.ER010, [FIELD.PASSWORD, FIELD.PASSWORD_CONFIRM]), path: ['loginPasswordConfirm'] }
);

// ── Schema cho UPDATE: password optional, KHÔNG check confirm vì FE đã ẩn 2 field ──
export const updateEmployeeSchema = attachCommonRefines(
    baseEmployeeObject.extend({
        loginPassword: z.string().optional(),
        loginPasswordConfirm: z.string().optional(),
    })
);