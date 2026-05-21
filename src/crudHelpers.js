export function moveItem(list, from, to) {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function moveItemById(list, id, direction) {
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) return list;
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= list.length) return list;
  return moveItem(list, index, nextIndex);
}

export function upsertById(list, item, createId) {
  if (item.id) {
    return list.map((row) => (row.id === item.id ? item : row));
  }
  return [{ ...item, id: createId() }, ...list];
}

export function updateById(list, id, patch) {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function deleteById(list, id) {
  return list.filter((item) => item.id !== id);
}
