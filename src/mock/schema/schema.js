/*
    ## toJSONSchema

    把 Mock.js 风格的数据模板转换成 JSON Schema。

    > [JSON Schema](http://json-schema.org/)
 */
import Constant from '../constant';
import { type } from '../util';
import { parser } from '../parser';

function toJSONSchema(template, name, path = [] /* Internal Use Only */) {
    // type rule properties items
    const result = {
        name: typeof name === 'string' ? name.replace(Constant.RE_KEY, '$1') : name,
        template,
        type: type(template), // 可能不准确，例如 { 'name|1': [{}, {} ...] }
        rule: parser(name),
        path: path.slice(0),
    };
    result.path.push(name === undefined ? 'ROOT' : result.name);

    switch (result.type) {
        case 'array':
            result.items = template.map((value, index) => toJSONSchema(value, index, result.path));
            break;
        case 'object':
            result.properties = [...Object.entries(template)].map(([name, value]) =>
                toJSONSchema(value, name, result.path),
            );
            break;
    }

    return result;
}
export { toJSONSchema };
export default toJSONSchema;
