import assert from "node:assert/strict";

import { deleteById, moveItemById, updateById, upsertById } from "../src/crudHelpers.js";

const original = [
  { id: "a", title: "A", visible: true },
  { id: "b", title: "B", visible: true },
  { id: "c", title: "C", visible: false },
];

const added = upsertById(original, { title: "D", visible: true }, () => "d");
assert.equal(added.length, 4, "add should insert one item");
assert.equal(added[0].id, "d", "add should create id and prepend");
assert.equal(original.length, 3, "add should not mutate original");

const updated = upsertById(added, { id: "b", title: "B updated", visible: false }, () => "unused");
assert.equal(updated.find((item) => item.id === "b").title, "B updated", "upsert should update matching item");
assert.equal(updated.find((item) => item.id === "b").visible, false, "upsert should preserve update payload");

const patched = updateById(updated, "c", { visible: true });
assert.equal(patched.find((item) => item.id === "c").visible, true, "updateById should patch one row");

const movedDown = moveItemById(patched, "d", 1);
assert.equal(movedDown[1].id, "d", "move down should move row by id");

const movedUp = moveItemById(movedDown, "d", -1);
assert.equal(movedUp[0].id, "d", "move up should move row by id");

const deleted = deleteById(movedUp, "b");
assert.equal(deleted.length, 3, "delete should remove one row");
assert.equal(deleted.some((item) => item.id === "b"), false, "delete should remove matching id");

console.log("CRUD helper tests passed");
