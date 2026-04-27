import { z } from 'zod';
import { ERROR_MESSAGES, formatMessage } from '@/lib/constants/messages';
import { FIELD, REGEX, MAX_LENGTH } from '@/lib/constants/validation';
import { DATE_FORMAT, EMPTY_STRING } from '@/lib/constants/employee';
//Check ngay hop le
const dateString = z.string().refine((date) => date === EMPTY_STRING || REGEX.DATE_YYYY_MM_DD.test(date), {
    message: formatMessage(ERROR_MESSAGES.ER011, [FIELD.BIRTH_DATE, DATE_FORMAT]),
});

//check validate cơ bản
export const employeeSchema = z.object({
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

    birthDate: dateString
        .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.BIRTH_DATE])),

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

    loginPassword: z
        .string()
        .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.PASSWORD]))
        .min(8, formatMessage(ERROR_MESSAGES.ER007, [FIELD.PASSWORD, String(MAX_LENGTH.PASSWORD_MIN), String(MAX_LENGTH.PASSWORD_MIN), String(MAX_LENGTH.PASSWORD)]))
        .max(50, formatMessage(ERROR_MESSAGES.ER007, [FIELD.PASSWORD, String(MAX_LENGTH.PASSWORD_MIN), String(MAX_LENGTH.PASSWORD_MIN), String(MAX_LENGTH.PASSWORD)]))
        .regex(REGEX.ASCII, formatMessage(ERROR_MESSAGES.ER008, [FIELD.PASSWORD])),

    loginPasswordConfirm: z
        .string()
        .min(1, formatMessage(ERROR_MESSAGES.ER001, [FIELD.PASSWORD_CONFIRM])),

    certificationId: z
        .string()
        .regex(REGEX.NUMBER, formatMessage(ERROR_MESSAGES.ER008, [FIELD.CERTIFICATION_ID])),
    certificationStartDate: dateString,
    certificationEndDate: dateString,

    score: z
        .string()
        .regex(REGEX.SCORE, formatMessage(ERROR_MESSAGES.ER008, [FIELD.SCORE])),

})

    //check confirmPassword phải trùng password
    .refine((checkConfirmPassword) => checkConfirmPassword.loginPassword === checkConfirmPassword.loginPasswordConfirm, {
        message: formatMessage(ERROR_MESSAGES.ER010),
        path: ['loginPasswordConfirm'],
    })

    //check bắt buộc 3 trường nếu đã chọn certification
    .refine((checkRequiredWhenSelected) => !checkRequiredWhenSelected.certificationId || checkRequiredWhenSelected.certificationStartDate !== EMPTY_STRING, {
        message: formatMessage(ERROR_MESSAGES.ER001, [FIELD.CERTIFICATION_START]),
        path: ['certificationStartDate'],
    })

    .refine((checkRequiredWhenSelected) => !checkRequiredWhenSelected.certificationId || checkRequiredWhenSelected.certificationEndDate !== EMPTY_STRING, {
        message: formatMessage(ERROR_MESSAGES.ER001, [FIELD.CERTIFICATION_END]),
        path: ['certificationEndDate'],
    })

    .refine((checkRequiredWhenSelected) => !checkRequiredWhenSelected.certificationId || checkRequiredWhenSelected.score !== EMPTY_STRING, {
        message: formatMessage(ERROR_MESSAGES.ER001, [FIELD.SCORE]),
        path: ['score'],
    })

    //check ngày bắt đầu phải trước hơn ngày kết thúc
    .refine((isEndAfterStart) => {
        if (!isEndAfterStart.certificationId || !isEndAfterStart.certificationStartDate || !isEndAfterStart.certificationEndDate) return true;
        return isEndAfterStart.certificationEndDate > isEndAfterStart.certificationStartDate;
    }, { message: formatMessage(ERROR_MESSAGES.ER012), path: ['certificationEndDate'] });

// export type EmployeeFormData = z.infer<typeof employeeSchema>;
