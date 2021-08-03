export const insertArrayAtIndex = <T>(arr: Array<T>, index: number, newItem: Array<T>): Array<T> => [
    // part of the array before the specified index
    ...arr.slice(0, index),
    // inserted item
    ...newItem,
    // part of the array after the specified index
    ...arr.slice(index)
]