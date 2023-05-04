import { Question, QuestionSet } from 'nest-commander';

const message = `Welcome to CashMagnet CLI 🎉
Which operation do you want?
`;
@QuestionSet({ name: 'init-options-questions' })
export class InitOptionsQuestions {
  @Question({
    message: message,
    name: 'selected',
    type: 'rawlist',
    choices: [
      {
        name: 'Create project in directory(Empty)?',
        value: 'create-default',
      },
      {
        name: 'Create/Update project in directory?',
        value: 'create-or-update-default',
      },
    ],
  })
  parseSelected(val: string) {
    return val;
  }
}
