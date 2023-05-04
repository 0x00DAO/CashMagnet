import { Question, QuestionSet } from 'nest-commander';

@QuestionSet({ name: 'init-options-questions' })
export class InitOptionsQuestions {
  @Question({
    message: 'Which command do you want? (Y/n)',
    name: 'selected',
    type: 'list',
    choices: [
      { name: 'Create project in empty directory', value: 'create' },
      { name: 'Create project in current directory', value: 'create-current' },
    ],
  })
  parseSelected(val: string) {
    return val;
  }
}
