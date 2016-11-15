import omit from 'lodash/omit';

const transform = (transformationMap, startField, transformations) =>
  transformations.reduce((field, transformation) =>
    transformationMap[transformation](field), startField)

export default transformationMap => store => next => action => {
  if (action.transformations && action.transformations.length)
    return next({
      ...omit(action, ['field', 'transformations']),
      field: transform(transformationMap, action.field, action.transformations)
    })
  return next(action)
}
