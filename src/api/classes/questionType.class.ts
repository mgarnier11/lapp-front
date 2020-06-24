import {
  QuestionTemplate,
  QuestionTemplateBackModel,
} from './questionTemplate.class';

export interface QuestionTypeBackModel {
  _id: string;
  _name: string;
  _description: string;
  _template: QuestionTemplateBackModel;
  _icon: string;
  _hasQuestions: boolean;
  _allowParameters: boolean;
}

export class QuestionType {
  public id: string = '';

  public name: string = '';

  public description: string = '';

  public template: QuestionTemplate = new QuestionTemplate();

  public icon: string = '';

  public allowParameters: boolean = false;

  public hasQuestions: boolean = false;

  public static New(datas: Partial<QuestionType>): QuestionType {
    return Object.assign(new QuestionType(), datas);
  }

  public static fromBack(datas: QuestionTypeBackModel) {
    let newObj = new QuestionType();

    newObj.id = datas._id;
    newObj.name = datas._name;
    newObj.description = datas._description;
    newObj.template = QuestionTemplate.fromBack(datas._template);
    newObj.icon = datas._icon;
    newObj.hasQuestions = datas._hasQuestions;
    newObj.allowParameters = datas._allowParameters;

    return newObj;
  }

  public static CompareArrays(
    arr1: QuestionType[],
    arr2: QuestionType[]
  ): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => QuestionType.CompareObjects(e, arr2[i]))
    );
  }

  public static CompareObjects(
    obj1: QuestionType,
    obj2: QuestionType
  ): boolean {
    return (
      obj1 !== undefined &&
      obj2 !== undefined &&
      obj1.id === obj2.id &&
      obj1.name === obj2.name &&
      obj1.description === obj2.description &&
      QuestionTemplate.CompareObjects(obj1.template, obj2.template) &&
      obj1.icon === obj2.icon &&
      obj1.hasQuestions === obj2.hasQuestions &&
      obj1.allowParameters === obj2.allowParameters
    );
  }
}
