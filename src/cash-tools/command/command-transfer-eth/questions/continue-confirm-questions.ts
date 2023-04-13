import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'continue-confirm-questions' })
export class ContinueConfirmQuestions {
  @Question({
    message: 'Do you want to continue? (Y/n)',
    name: 'confirm',
    type: 'confirm',
  })
  parseConfirm(val: string) {
    return val;
  }
}
