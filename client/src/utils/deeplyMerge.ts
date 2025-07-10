type IObject = Record<string, unknown>;

export function isObject(val: unknown) {
  return typeof val === 'object' && val != null && !Array.isArray(val);
}

// @ts-expect-error: TODO: fix types
function handleAssignment({ assignmentTarget, targetValue }) {
  return isObject(targetValue) // force formatting
    ? deeplyMerge(assignmentTarget || {}, targetValue)
    : targetValue;
}

/**
 * @description Recursively merge source object into target object.
 * @todo Maybe replace with `lodash.merge` or `deeplyAssign`?
 *
 * @param target
 * @param source
 * @returns Original target object with source recursively merged into it.
 */
export function deeplyMerge<T extends IObject = IObject, S extends IObject = IObject>(
  target: T,
  source: S,
): T {
  if (!isObject(target)) {
    throw new TypeError("[deeplyMerge] : argument 'target' must be an object!");
  }
  if (!isObject(source)) {
    throw new TypeError("[deeplyMerge] : argument 'source' must be an object!");
  }

  for (const [sourceKey, sourceValue] of Object.entries(source)) {
    // @ts-expect-error: The argument will definitely be indexable
    target[sourceKey] = handleAssignment({
      assignmentTarget: target[sourceKey],
      targetValue: sourceValue,
    });
  }

  return target;
}
