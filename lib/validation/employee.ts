import {z} from 'zod';
import { formatMessage } from '@/lib/constants/messages';

//Check ngay hop le
const dateString = z.string().refine((date) => date === '' || /^\d{4}\/\d{2}\/\d{2}$/.test(date), {
    message: formatMessage('ER011', ['日付', 'yyyy/MM/dd']),
});

export const employeeSchema = z.object({
    loginId: z
        .string()
        .min(1, formatMessage('ER001', ['アカウント名']))
        .trim()
        .max(50, formatMessage('ER006', ['アカウント名', '50']))
        .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, formatMessage('ER019')),
    
    departmentId: z
        .string()
        .min(1, formatMessage('ER002', ['グループ'])),
    
    employeeName: z
        .string()
        .trim()
        .min(1, formatMessage('ER001', ['氏名']))
        .max(125, formatMessage('ER006', ['氏名', '125'])),
    
    employeeNameKana: z
        .string()
        .min(1, formatMessage('ER001', ['カタカナ氏名']))
        .max(125, formatMessage('ER006', ['カタカナ氏名', '125']))
        .regex(/^[\uFF65-\uFF9F]+$/, formatMessage('ER009', ['カタカナ氏名'])),

    birthDate: dateString
        .min(1, formatMessage('ER001', ['生年月日'])),

    employeeEmail: z
        .string()
        .min(1, formatMessage('ER001', ['メールアドレス']))
        .max(255, formatMessage('ER006', ['メールアドレス', '255']))
        .email(formatMessage('ER005', ['メールアドレス', 'email'])),
    
    employeeTelephone: z
        .string()
        .min(1, formatMessage('ER001', ['電話番号']))
        .max(50, formatMessage('ER006', ['電話番号', '50']))
        .regex(/^[0-9\-]+$/, formatMessage('ER018', ['電話番号'])),
    
    loginPassword: z
        .string()
        .min(1, formatMessage('ER001', ['パスワード']))
        .min(8, formatMessage('ER007', ['パスワード', '8', '8', '50']))
        .max(255, formatMessage('ER007', ['パスワード', '8', '8', '50']))
        .regex(/^[a-zA-Z0-9]+$/, formatMessage('ER008', ['パスワード'])),

    loginPasswordConfirm: z
        .string()
        .min(1, formatMessage('ER001', ['パスワード（確認）'])),

    certificationId: z.string(),
    certificationStartDate: dateString,
    certificationEndDate: dateString,
    
    score: z
        .string()
        .regex(/^\d*\.?\d*$/, formatMessage('ER018', ['点数'])),

})

.refine((checkConfirmPassword) => checkConfirmPassword.loginPassword === checkConfirmPassword.loginPasswordConfirm, {
    message: formatMessage('ER017'),
    path: ['loginPasswordConfirm'],
})

.refine((data) => !data.certificationId || data.certificationStartDate !== '', {
    message: formatMessage('ER001', ['資格交付日']),
    path: ['certificationStartDate'],
})

.refine((data) => !data.certificationId || data.certificationEndDate !== '', {
    message: formatMessage('ER001', ['失効日']),
    path: ['certificationEndDate'],
})

.refine((data) => !data.certificationId || data.score !== '', {
    message: formatMessage('ER001', ['点数']),
    path: ['score'],
})

.refine((data) => {
    if (!data.certificationId || !data.certificationStartDate || !data.certificationEndDate) return true;
    return data.certificationEndDate > data.certificationStartDate;
}, { message: formatMessage('ER012'), path: ['certificationEndDate'] });

// export type EmployeeFormData = z.infer<typeof employeeSchema>;
