/**
 * Bảng mã lỗi và nội dung tiếng Nhật tương ứng.
 * {0}, {1}... là placeholder cho params từ API.
 */
export const ERROR_MESSAGES: Record<string, string> = {
  ER001: '「{0}」を入力してください。',
  ER002: '「{0}」を入力してください。',
  ER003: '「{0}」は既に存在しています。',
  ER004: '「{0}」は存在していません。',
  ER005: '「{0}」を{1}形式で入力してください。',
  ER006: '{0}桁以内の「{1}」を入力してください。',
  ER007: '「{0}」を{1}<={2}桁、<={3}桁で入力してください。',
  ER008: '「{0}」に半角英数を入力してください。',
  ER009: '「{0}」をカタカナで入力してください。',
  ER010: '「{0}」をひらがなで入力してください。',
  ER011: '「{0}」は無効になっています。',
  ER012: '「失効日」は「資格交付日」より未来の日を入力してください。',
  ER013: '該当するユーザは存在していません。',
  ER014: '該当するユーザは存在していません。',
  ER015: 'システムエラーが発生しました。',
  ER016: '「アカウント名」または「パスワード」は不正です。',
  ER017: '「パスワード」（確認）が不正です。',
  ER018: '「{0}」は半角で入力してください。',
  ER019: '「アカウント名」は(a-z, A-Z, 0-9 と _)の桁のみです。最初の桁は数字ではない。',
  ER020: '管理者ユーザを削除することはできません。',
  ER021: 'ソートは（ASC, DESC）でなければなりません。',
  ER022: 'ページが見つかりません。',
  ER023: 'システムエラーが発生しました。',
};

/**
 * Bảng mã thông báo thành công và nội dung tiếng Nhật tương ứng.
 */
export const SUCCESS_MESSAGES: Record<string, string> = {
  MSG001: 'ユーザの登録が完了しました。',
  MSG002: 'ユーザの更新が完了しました。',
  MSG003: 'ユーザの削除が完了しました。',
  MSG004: '削除します。よろしいでしょうか？',
  MSG005: '検索条件に該当するユーザが見つかりません。',
};

/**
 * Format message bằng cách thay thế {0}, {1}... bằng params.
 */
export function formatMessage(code: string, params?: string[]): string {
  const template = ERROR_MESSAGES[code] || SUCCESS_MESSAGES[code] || code;
  if (!params || params.length === 0) return template;

  return params.reduce((msg, param, index) => {
    return msg.replace(`{${index}}`, param);
  }, template);
}
