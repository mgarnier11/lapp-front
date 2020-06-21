export interface QuestionTemplateBackModel {
  _id: string;
  _name: string;
  _clientPath: string;
}

export class QuestionTemplate {
  public id: string = '';

  public name: string = '';

  public clientPath: string = '';

  public static New(datas: Partial<QuestionTemplate>): QuestionTemplate {
    return Object.assign(new QuestionTemplate(), datas);
  }

  public static fromBack(datas: QuestionTemplateBackModel) {
    let newObj = new QuestionTemplate();

    newObj.id = datas._id;
    newObj.name = datas._name;
    newObj.clientPath = datas._clientPath;

    return newObj;
  }

  public static CompareArrays(
    arr1: QuestionTemplate[],
    arr2: QuestionTemplate[]
  ): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((e, i) => QuestionTemplate.CompareObjects(e, arr2[i]))
    );
  }

  public static CompareObjects(
    obj1: QuestionTemplate,
    obj2: QuestionTemplate
  ): boolean {
    return (
      obj1 !== undefined &&
      obj2 !== undefined &&
      obj1.id === obj2.id &&
      obj1.name === obj2.name &&
      obj1.clientPath === obj2.clientPath
    );
  }
}
